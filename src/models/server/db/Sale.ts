import currency from "currency.js";

import { ConfigType } from "@/types/app-config-server";
import { CartResquestType, RequestCartItem } from "@/types/cart";
import { StoreProductType, WarehouseProductType } from "@/types/product";
import { SaleType, SaleInfoType, SaleItemType } from "@/types/sale";

import { toISOString } from "@/helpers/date";
import { getId } from "@/helpers/id";
import { isInvalidNumber } from "@/helpers/validation";
import { getProduct, isValidCartItemTotalPrice, updateSale } from "@/helpers/sales";
import { sort } from "@/helpers/sort";
import { getProducts, updateProduct } from "@/helpers/products";
import getProductProxy from "../proxy/product";
import getSaleProxy from "../proxy/sale";

import Error404 from "@/errors/server/404Error";
import InvalidArgumentError from "@/errors/server/InvalidArgumentError";


class Sale {
    static async getAll({ filters,  storeId }: { filters?: Object, storeId: string }, { mongoDbConfig, user }: ConfigType) {
        const list = await mongoDbConfig
            .collections
            .WAREHOUSES
            .aggregate([
                { $match: { id: storeId } },
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
                        createdAt: { $first: "$sales.createdAt" },
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
            ])
            .toArray() as SaleInfoType[];

        /*await Promise.all(
            list.map(sale => {
                const saleProxy = structuredClone(sale)

                saleProxy.createdAt = sale.createdAt

                //@ts-ignore
                if(saleProxy.createAt) { //@ts-ignore
                    saleProxy.createdAt = sale.createAt
                }

                return updateSale(saleProxy, storeId, mongoDbConfig);
            })
        )*/
        
        sort(list);
        return list;
    }

    static async register({ cart, storeId }: { cart: CartResquestType, storeId: string }, { mongoDbConfig, user }: ConfigType) {
        const productsIds = cart.items.map(item => item.product.id)
        const saleId = getId()

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
                createdAt: toISOString(Date.now()),
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
    
            await mongoDbConfig
                .collections
                .WAREHOUSES
                .updateOne(
                    { id: storeId }, 
                    { 
                        $push: { 
                            sales: sale
                        }
                    }
                );

            await Promise.all(
                cart.items.map(item => {
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
                                sales: {
                                    id: saleId
                                }
                            }
                        }
                    ),
                ...structuredClone(products).map(product => {
                    return updateProduct(product, storeId, { mongoDbConfig, user })
                })
            ])

            throw e;
        }
    }

    static async update({ cart, storeId }: { cart: CartResquestType, storeId: string }, { mongoDbConfig, user }: ConfigType) {
        const salesList = await this.getAll(
            {
                filters: {
                    "sales.id": cart.id
                },
                storeId
            },
            {
                mongoDbConfig,
                user
            }
        )

        if(salesList.length === 0) throw new Error404("Sale details not found");

        const sale = structuredClone(salesList[0])

        const productsIds = cart.items.map(item => item.product.id)

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

        //const store = await Store.get({ id: storeId }, { mongoDbConfig, user })
        //const { sales } = store;

        //const salesClone = structuredClone(sales);
        const productsClone = structuredClone(productsList);

        //const selectedProducts = productsClone.filter(product => productsIds.includes(product.id));
        
        const itemsList: SaleItemType[] = [];
        const cartItemssMapper = new Map<string, RequestCartItem>();
        let totalProfit = 0;

        //const saleItemsMapper = new Map<string, SaleInfoItemType>()

        // sum all quantity values, then throws an InvalidArgumentError if quantity is invalid
        const totalPrice =  cart.items.reduce((prevValue, currentItem) => {
            //check if current item quantity value is valid, then throws an error if not
            if(isInvalidNumber(currentItem.quantity)) {
                throw new InvalidArgumentError("Quantity must not be less than or equal to zero");
            }

            const currentProduct = productsClone.find(product => currentItem.product.id === product.id);

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
            cartItemssMapper.set(currentProduct.id, currentItem);

            const price = currency(currentProduct.sellPrice).multiply(currentItem.quantity);
            return currency(prevValue).add(price).value;
        }, 0);

        const saleProxy = getSaleProxy(sale, cart)

        try {

            saleProxy.total = totalPrice
            saleProxy.totalReceived = cart.totalReceived
            saleProxy.profit = totalProfit
            saleProxy.changes = currency(sale.totalReceived).subtract(sale.total).value;

            productsClone.forEach(product => {
                const productProxy = getProductProxy(product)

                const mappedCartItem = cartItemssMapper.get(product.id);
                const saleItem = sale.items.find(item => item.product.id === product.id);  

                const difference = currency(saleItem.quantity).subtract(mappedCartItem.quantity).value;
                saleItem.quantity = currency(saleItem.quantity).subtract(difference).value;
                saleItem.total = currency(saleItem.quantity).multiply(saleItem.product.price).value;

                productProxy.stock.quantity = currency(product.stock.quantity).add(difference).value
            })
    
            await updateSale(saleProxy, storeId, mongoDbConfig);

            await Promise.all(
                productsClone.map(product => {
                    return updateProduct(getProductProxy(product), storeId, { mongoDbConfig, user })
                })
            )
        } catch(e) {
            await Promise.all(
                [ 
                    updateSale(salesList[0], storeId, mongoDbConfig),
                    ...structuredClone(productsList).map(product => {
                        return updateProduct(getProductProxy(product), storeId, { mongoDbConfig, user })
                    })
                ]
            )

            throw e;
        }
    }
}

export default Sale