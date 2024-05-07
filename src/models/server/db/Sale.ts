import { v4 as uuidV4} from "uuid"
import currency from "currency.js";

import { ConfigType } from "@/types/app-config-server";
import { CartResquestType, RequestCartItem } from "@/types/cart";
import { SaleType, SaleInfoType, SaleItemType } from "@/types/sale";
import { toISOString } from "@/helpers/date";
import { isInvalidNumber } from "@/helpers/validation";

import ProductModel from "./Product";
import Store from "./Warehouse";
import Error404 from "@/errors/server/404Error";
import InvalidArgumentError from "@/errors/server/InvalidArgumentError";
import { getId } from "@/helpers/id";
import { isValidCartTotalPrice, isValidReceivedAmount } from "@/validation/sale";
import { WarehouseProductType } from "@/types/product";


class Sale {
    static async getAll({ filters,  warehouseId }: { filters?: Object, warehouseId: string }, { mongoDbConfig, user }: ConfigType) {
        return await mongoDbConfig.collections
            .WAREHOUSES
            .aggregate([
                { $match: { id: warehouseId } },
                { $unwind: "$sales" },
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
                { $match: { ...(filters ?? {} ) } },
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
    }

    static async register({ cart, warehouseId }: { cart: CartResquestType, warehouseId: string }, { mongoDbConfig, user }: ConfigType) {
        const productsIds = cart.items.map(item => item.product.id)

        const store = await Store.get({ id: warehouseId }, { mongoDbConfig, user });
        const { products, sales } = store;

        const productsClone = structuredClone(products)
        const salesClone = structuredClone(sales);
        
        const selectedProductsMap = new Map<string, WarehouseProductType>();

        productsClone.forEach(product => {
            if(productsIds.includes(product.id)) {
                selectedProductsMap.set(product.id, product)
            }
        });
        
        const itemsList: SaleItemType[] = [];
        const productsMap = new Map<string, RequestCartItem>();
        let totalProfit = 0;

        // sum all quantity values, then throws an InvalidArgumentError if quantity is invalid
        const totalPrice =  cart.items.reduce((prevValue, currentItem) => {
            //check if current item quantity value is valid, then throws an error if not
            if(isInvalidNumber(currentItem.quantity)) {
                throw new InvalidArgumentError("Quantity must not be less than or equal to zero");
            }

            const currentProduct = selectedProductsMap.get(currentItem.product.id);

            if(!currentProduct) throw new Error404(`Product with '${currentItem.product.id}' id not found`);

            if(currentItem.quantity > currentProduct.stock.quantity) {
                throw new InvalidArgumentError(`Quantity is greater than available stock`);
            }

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
            productsMap.set(currentProduct.id, currentItem);

            const price = currency(currentProduct.sellPrice).multiply(currentItem.quantity);
            return currency(prevValue).add(price).value;
        }, 0);

        //check if total received amount is valid and it is greater than or equal to total price
        isValidReceivedAmount(cart.totalReceived, totalPrice);
       
        //check if server total price match with the client total price, then throw an error if not
        isValidCartTotalPrice(totalPrice, cart.total);

        try {
            let sale: SaleType = {
                changes: cart.changes,
                createAt: toISOString(Date.now()),
                id: getId(),
                items: itemsList,
                profit: totalProfit,
                total: cart.total,
                totalReceived: cart.totalReceived,
                user: "rafaeltivane"
            };
    
            salesClone.push(sale);
            
            cart.items.forEach(item => {
                const mappedProduct = productsMap.get(item.product.id);
                const productInfo = selectedProductsMap.get(item.product.id)
                
                productInfo.stock = {
                    quantity: currency(productInfo.stock.quantity).subtract(mappedProduct.quantity).value
                };
            });
    
            await mongoDbConfig.collections
                .WAREHOUSES
                .updateOne({ id: warehouseId }, { $set: { products: productsClone, sales: salesClone }});
        } catch(e) {
            await mongoDbConfig.collections.
                WAREHOUSES
                .updateOne({ id: warehouseId }, { $set: { products, sales }});

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