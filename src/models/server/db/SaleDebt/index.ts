import currency from "currency.js";

import { ConfigType } from "@/types/app-config-server";
import { RequestCartItem } from "@/types/cart";
import { StoreProductType } from "@/types/product";
import { SaleItemType, SaleDebtType, SaleDebtInfoType } from "@/types/sale";

import { getId } from "@/helpers/id";
import { getAndSetTotalValues } from "./helpers";
import { sort } from "@/helpers/sort";
import { getProducts, updateProduct } from "@/helpers/products";
import getProductProxy from "../../proxy/product";
import getUnpaidSaleProxy from "./proxy";
import { toISOString } from "@/helpers/date";
import { updateProductInDB, updateSaleDebt, updateSaleDebtProduct } from "./helpers/db";

import Error404 from "@/errors/server/404Error";
import InvalidArgumentError from "@/errors/server/InvalidArgumentError";

import Customers from "../Customer";


class Sale {
    static async getAll({ filters,  storeId }: { filters?: Object, storeId: string }, { mongoDbConfig, user }: ConfigType) {
        const list = await mongoDbConfig
            .collections
            .WAREHOUSES
            .aggregate([
                { $match: { id: storeId } },
                { $unwind: "$unpaid-sales" },
                { $match: { ...(filters ?? {} ) } },
                { $unwind: "$unpaid-sales.items" },
                {
                    $lookup: {
                        from: "products", // Replace with the name of your external product collection
                        localField: "unpaid-sales.items.product.id",
                        foreignField: "id",
                        as: "product_info"
                    }
                },
                { $unwind: "$product_info" },
                {
                    $lookup: {
                        from: "clients", // Replace with the name of your external product collection
                        localField: "unpaid-sales.customer",
                        foreignField: "id",
                        as: "customer_info"
                    }
                },
                {
                    $lookup: {
                        from: "users", // Replace with the name of your external product collection
                        localField: "unpaid-sales.createdBy",
                        foreignField: "username",
                        as: "user_info"
                    }
                },
                { $unwind: "$user_info" },
                {
                    $addFields: {
                        "unpaid-sales.items.product": {
                        item: "$product_info", // Embed product info into sales document
                        // price: 
                        }
                    }
                },
                {
                    $group: {
                        _id: "$unpaid-sales.id",
                        createdAt: { $first: "$unpaid-sales.createdAt" },
                        changes: { $first: "$unpaid-sales.changes" },
                        customer: { 
                            $first: {
                                firstName: "$customer_info.firstName",
                                lastName: "$customer_info.lastName",
                                username: "$customer_info.username"
                            }
                        },
                        id: { $first: "$unpaid-sales.id" },
                        items: {
                            $push: {
                                quantity: "$unpaid-sales.items.quantity",
                                total: "$unpaid-sales.items.total",
                                product: {
                                    barcode: "$product_info.barcode",
                                    category: "$product_info.category",
                                    id: "$unpaid-sales.items.product.id",
                                    name: "$product_info.name",
                                    sellPrice: "$unpaid-sales.items.product.price",
                                }
                            }
                        },
                        profit: { $first: "$unpaid-sales.profit" },
                        paymentMethods: { $first: "$unpaid-sales.paymentMethods" },
                        remainingAmount: { $first: "$unpaid-sales.remainingAmount" },
                        total: { $first: "$unpaid-sales.total" },
                        totalReceived: { $first: "$unpaid-sales.totalReceived" },
                        user: { 
                            $first: {
                                firstName: "$user_info.firstName",
                                lastName: "$user_info.lastName",
                                username: "$user_info.username"
                            }
                        }
                    }
                }
            ])
            .toArray() as SaleDebtInfoType[];
        
        sort(list);
        
        return { 
            data: list
        };
    }

    static async register(debt: SaleDebtType, { mongoDbConfig, user }: ConfigType) {
        const { storeId } = user.stores[0]
        const saleId = getId()

        if(!debt || typeof debt !== "object") throw new InvalidArgumentError("Invalid debt details");

        await Customers.get(
            {
                filters: {
                    "clients.id": debt.customer
                },
                tableName: "CUSTOMERS"
            },
            {
                mongoDbConfig,
                user
            }
        )

        const productsIds = debt.items.map(item => item.product.id)

        const products = await getProducts(
            {
                filter: {
                    stores: storeId,
                    id: { $in: productsIds }
                }
            },
            { 
                mongoDbConfig, 
                user
            }
        )

        const productsClone = structuredClone(products)
        
        const productsMapper = new Map<string, StoreProductType>();

        productsClone.forEach(product => {
            if(productsIds.includes(product.id)) {
                productsMapper.set(product.id, product)
            }
        });
        
        const itemsList: SaleItemType[] = [];
        const cartItemssMapper = new Map<string, RequestCartItem>();

        // sum all quantity values, then throws an InvalidArgumentError if quantity is invalid
        const { totalPrice, totalProfit } = getAndSetTotalValues(
            {
                cartItems: debt.items,
                itemsList,
                itemsMapper: cartItemssMapper,
                productsMapper: productsMapper
            }
        )

        if(debt.total !== totalPrice) {
            throw new InvalidArgumentError("Total price is not correct.")
        }

        try {
            let unpaidSale: SaleDebtType = {
                changes: 0,
                createdAt: toISOString(Date.now()),
                createdBy: user.username,
                customer: debt.customer,
                dueDate: debt.dueDate,
                id: saleId,
                items: structuredClone(itemsList),
                latePaymentFine: debt.latePaymentFine,
                profit: totalProfit,
                paymentMethods: debt.paymentMethods ?? [],
                remainingAmount: totalPrice,
                total: totalPrice,
                totalReceived: debt.totalReceived ?? 0,
            };
    
            await mongoDbConfig
                .collections
                .WAREHOUSES
                .updateOne(
                    { id: storeId }, 
                    { 
                        $push: { 
                            "unpaid-sales": unpaidSale
                        }
                    }
                );

            await Promise.all(
                debt.items.map(item => {
                    const mappedCartItem = cartItemssMapper.get(item.product.id);
                    const productInfo = productsMapper.get(item.product.id)

                    const productProxy = getProductProxy(productInfo)
                    
                    productProxy.stock.quantity = currency(productInfo.stock.quantity).subtract(mappedCartItem.quantity).value;

                    return updateProduct(productInfo, storeId, { mongoDbConfig, user })
                })
            )
        } catch(e) {
            await Promise.all([
                mongoDbConfig
                    .collections
                    .WAREHOUSES
                    .updateOne(
                        { id: storeId }, 
                        { 
                            $pull: { 
                                "unpaid-sales": {
                                    id: saleId
                                }
                            }
                        }
                    ),
                ...updateProductInDB(structuredClone(products), { mongoDbConfig, user })
                
            ])

            throw e;
        }
    }

    static async update(saleDebt: SaleDebtType, { mongoDbConfig, user }: ConfigType) {
        const { storeId } = user.stores[0]

        const salesList = await this.getAll(
            {
                filters: {
                    "unpaid-sales.id": saleDebt.id
                },
                storeId
            },
            {
                mongoDbConfig,
                user
            }
        )

        if(salesList.data.length === 0) throw new Error404("Unpaid sale details not found");

        const unpaidSale = structuredClone(salesList.data[0])

        const productsIds = saleDebt.items.map(item => item.product.id)

        const productsList = await getProducts(
            {
                filter: {
                    stores: storeId,
                    id: { $in: productsIds }
                }
            }, 
            { 
                mongoDbConfig, 
                user 
            }
        )

        const productsClone = structuredClone(productsList);
        
        const itemsList: SaleItemType[] = [];
        const cartItemssMapper = new Map<string, RequestCartItem>();
        const productsMapper = new Map<string, StoreProductType>();

        productsClone.forEach(product => {
            if(productsIds.includes(product.id)) {
                productsMapper.set(product.id, product)
            }
        });

        // sum all quantity values, then throws an InvalidArgumentError if quantity is invalid
        // sum all quantity values, then throws an InvalidArgumentError if quantity is invalid
        const { totalPrice, totalProfit } = getAndSetTotalValues(
            {
                cartItems: saleDebt.items,
                itemsList,
                itemsMapper: cartItemssMapper,
                productsMapper: productsMapper
            }
        )

        const unpaidSaleProxy = getUnpaidSaleProxy(unpaidSale, totalPrice)

        unpaidSale.profit = totalProfit
        unpaidSaleProxy.total = saleDebt.total
        unpaidSaleProxy.totalReceived = saleDebt.totalReceived
        unpaidSaleProxy.paymentMethods = saleDebt.paymentMethods
        unpaidSaleProxy.changes = saleDebt.changes
        
        const remainingAmount = currency(totalPrice).subtract(saleDebt.totalReceived).value

        unpaidSale.remainingAmount = remainingAmount

        try {
            await updateSaleDebt(unpaidSale, storeId, mongoDbConfig);

            await updateSaleDebtProduct(
                {
                    cartItemsMapper: cartItemssMapper,
                    products: productsClone,
                    unpaidSale
                },
                {
                    mongoDbConfig,
                    user
                }
            )
        } catch(e) {
            await Promise.all(
                [ 
                    updateSaleDebt(salesList[0], storeId, mongoDbConfig),
                    ...updateProductInDB(structuredClone(productsList), { mongoDbConfig, user })
                ]
            )

            throw e;
        }
    }
}

export default Sale