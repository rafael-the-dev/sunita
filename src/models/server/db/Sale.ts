import currency from "currency.js";

import { ConfigType } from "@/types/app-config-server";
import { CartResquestType, RequestCartItem } from "@/types/cart";
import { WarehouseProductType } from "@/types/product";
import { SaleType, SaleInfoType, SaleItemType } from "@/types/sale";

import { toISOString } from "@/helpers/date";
import { getId } from "@/helpers/id";
import { isValidCartTotalPrice, isValidReceivedAmount } from "@/validation/sale";
import { isInvalidNumber } from "@/helpers/validation";

import Store from "./Warehouse";
import Error404 from "@/errors/server/404Error";
import InvalidArgumentError from "@/errors/server/InvalidArgumentError";
import { getProduct, isValidCartItemTotalPrice, isValidPaymentMethods } from "@/helpers/sales";
import { sort } from "@/helpers/sort";
import { getProducts, updateProduct } from "@/helpers/products";
import getProductProxy from "../proxy/product";
import getSaleProxy from "../proxy/sale";


class Sale {
    static async getAll({ filters,  warehouseId }: { filters?: Object, warehouseId: string }, { mongoDbConfig, user }: ConfigType) {
        const list = await mongoDbConfig.collections
            .WAREHOUSES
            .aggregate([
                { $match: { id: warehouseId } },
                { $unwind: "$sales" },
                { $match: { ...(filters ?? {} ) } },
                { $unwind: "$sales.items" },
                {
                    $lookup: {
                        from: "products", // Replace with the name of your external product collection
                        localField: "sales.items.product.id",
                        foreignField: "id",
                        as: "product_info"
                    }
                },
                { $unwind: "$product_info" },
                {
                    $lookup: {
                        from: "users", // Replace with the name of your external product collection
                        localField: "sales.user",
                        foreignField: "username",
                        as: "user_info"
                    }
                },
                { $unwind: "$user_info" },
                {
                    $addFields: {
                        "sales.items.product": {
                        item: "$product_info", // Embed product info into sales document
                        // price: 
                        }
                    }
                },
                {
                    $group: {
                        _id: "$sales.id",
                        createdAt: { $first: "$sales.createAt" },
                        changes: { $first: "$sales.changes" },
                        id: { $first: "$sales.id" },
                        items: {
                            $push: {
                                quantity: "$sales.items.quantity",
                                total: "$sales.items.total",
                                product: {
                                    barcode: "$product_info.barcode",
                                    category: "$product_info.category",
                                    id: "$sales.items.product.id",
                                    name: "$product_info.name",
                                    sellPrice: "$sales.items.product.price",
                                }
                            }
                        },
                        profit: { $first: "$sales.profit" },
                        paymentMethods: { $first: "$sales.paymentMethods" },
                        total: { $first: "$sales.total" },
                        totalReceived: { $first: "$sales.totalReceived" },
                        user: { 
                            $first: {
                                firstName: "$user_info.firstName",
                                lastName: "$user_info.lastName",
                                username: "$user_info.username"
                            }
                         }
                    }
                }
            ]).toArray() as SaleInfoType[];
        
        sort(list);
        return list;
    }

    static async register({ cart, warehouseId }: { cart: CartResquestType, warehouseId: string }, { mongoDbConfig, user }: ConfigType) {
        const productsIds = cart.items.map(item => item.product.id)
        const saleId = getId()

        const products = await getProducts(
            {
                filter: {
                    id: warehouseId,
                    "products.id": { $in: productsIds }
                }
            },
            { 
                mongoDbConfig, 
                user
            }
        )

        const productsClone = structuredClone(products)
        
        const productsMapper = new Map<string, WarehouseProductType>();

        productsClone.forEach(product => {
            if(productsIds.includes(product.id)) {
                productsMapper.set(product.id, product)
            }
        });
        
        const itemsList: SaleItemType[] = [];
        const cartItemssMapper = new Map<string, RequestCartItem>();
        let totalProfit = 0;

        // sum all quantity values, then throws an InvalidArgumentError if quantity is invalid
        const totalPrice =  cart.items.reduce((prevValue, currentItem) => {
            //check if current item quantity value is valid, then throws an error if not
            if(isInvalidNumber(currentItem.quantity)) {
                throw new InvalidArgumentError("Quantity must not be less than or equal to zero");
            }

            const currentProduct = getProduct(productsMapper, currentItem.product.id);

            if(currentItem.quantity > currentProduct.stock.quantity) {
                throw new InvalidArgumentError(`Quantity is greater than available stock`);
            }

            isValidCartItemTotalPrice(currentItem, currentProduct);

            const item = {
                ...currentItem,
                id: currentItem.product.id,
                product: {
                    id: currentItem.product.id,
                    price: currentProduct.sellPrice
                }
            };

            //sum profit
            totalProfit = currency(totalProfit).add(currency(currentProduct.profit).multiply(currentItem.quantity).value).value;
            itemsList.push(item);
            cartItemssMapper.set(currentProduct.id, currentItem);

            const price = currency(currentProduct.sellPrice).multiply(currentItem.quantity);
            return currency(prevValue).add(price).value;
        }, 0);

        try {
            let sale: SaleType = {
                changes: cart.changes,
                createAt: toISOString(Date.now()),
                id: saleId,
                items: itemsList,
                profit: totalProfit,
                paymentMethods: [],
                total: 0,
                totalReceived: 0,
                user: user.username
            };

            const saleProxy = getSaleProxy(sale, cart)

            saleProxy.total = totalPrice
            saleProxy.totalReceived = cart.totalReceived
            saleProxy.paymentMethods = cart.paymentMethods.list
    
            await mongoDbConfig.collections
                .WAREHOUSES
                .updateOne(
                    { id: warehouseId }, 
                    { 
                        $push: { 
                            sales: sale
                        }
                    }
                );
            
            Promise.all(
                cart.items.map(item => {
                    const mappedCartItem = cartItemssMapper.get(item.product.id);
                    const productInfo = productsMapper.get(item.product.id)

                    const productProxy = getProductProxy(productInfo)
                    
                    productProxy.stock.quantity = currency(productInfo.stock.quantity).subtract(mappedCartItem.quantity).value;

                    return updateProduct(productProxy, warehouseId, mongoDbConfig)
                })
            )
        } catch(e) {
            await Promise.all([
                mongoDbConfig.collections.
                    WAREHOUSES
                    .updateOne(
                        { id: warehouseId }, 
                        { 
                            $pull: { 
                                sales: {
                                    id: saleId
                                }
                            }
                        }
                    ),
                ...structuredClone(products).map(product => {
                    return updateProduct(getProductProxy(product), warehouseId, mongoDbConfig)
                })
            ])

            throw e;
        }
    }

    static async update({ cart, storeId }: { cart: CartResquestType, storeId: string }, { mongoDbConfig, user }: ConfigType) {
        const productsIds = cart.items.map(item => item.product.id)

        const store = await Store.get({ id: storeId }, { mongoDbConfig, user });
        const { products, sales } = store;

        const salesClone = structuredClone(sales);
        const productsClone = structuredClone(products);

        const sale = salesClone.find(listItem => listItem.id === cart.id);

        if(!sale) {
            throw new Error404("Sale details not found");
        }

        const selectedProducts = productsClone.filter(product => productsIds.includes(product.id));
        
        const itemsList: SaleItemType[] = [];
        const productsMap = new Map<string, RequestCartItem>();
        let totalProfit = 0;

        const saleItemsMap = new Map<string, SaleItemType>()

        sale.items.forEach(item => {
            saleItemsMap.set(item.product.id, item)
        })

        // sum all quantity values, then throws an InvalidArgumentError if quantity is invalid
        const totalPrice =  cart.items.reduce((prevValue, currentItem) => {
            //check if current item quantity value is valid, then throws an error if not
            if(isInvalidNumber(currentItem.quantity)) {
                throw new InvalidArgumentError("Quantity must not be less than or equal to zero");
            }

            const currentProduct = selectedProducts.find(product => currentItem.product.id === product.id);

            if(!currentProduct) throw new Error404(`Product with '${currentItem.product.id}' id not found`);

            const item = {
                ...currentItem,
                id: currentItem.product.id,
                product: {
                    id: currentItem.product.id,
                    price: currentProduct.sellPrice
                }
            };

            //sum profit
            totalProfit = currency(totalProfit).add(currency(currentProduct.profit).multiply(currentItem.quantity)).value;
            itemsList.push(item);
            productsMap.set(currentProduct.id, currentItem);

            const price = currency(currentProduct.sellPrice).multiply(currentItem.quantity);
            return currency(prevValue).add(price).value;
        }, 0);

        //check if total received amount is valid and it is greater than or equal to total price
        isValidReceivedAmount(cart.totalReceived, totalPrice);
       
        //check if server total price match with the client total price, then throw an error if not
        isValidCartTotalPrice(totalPrice, cart.total);

        sale.total = totalPrice;
        sale.profit = totalProfit;
        sale.changes = currency(sale.totalReceived).subtract(sale.total).value;

        try {
            selectedProducts.forEach(product => {
                const mappedProduct = productsMap.get(product.id);
                const saleItem = saleItemsMap.get(product.id);  

                if(mappedProduct) {
                    const difference = currency(saleItem.quantity).subtract(mappedProduct.quantity).value;
                    saleItem.quantity = currency(saleItem.quantity).subtract(difference).value;
                    saleItem.total = currency(saleItem.quantity).multiply(saleItem.product.price).value;

                    product.stock = {
                        quantity: currency(product.stock.quantity).add(difference).value
                    }
                };
            })
    
            await mongoDbConfig.collections
                .WAREHOUSES
                .updateOne({ id: storeId }, { $set: { products: selectedProducts, sales: salesClone }});
        } catch(e) {
            await mongoDbConfig.collections.
                WAREHOUSES
                .updateOne({ id: storeId }, { $set: { products, sales }});

            throw e;
        }
    }
}

export default Sale