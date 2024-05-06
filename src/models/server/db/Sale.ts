import { v4 as uuidV4} from "uuid"
import currency from "currency.js";

import { ConfigType } from "@/types/app-config-server";
import { CartResquestType, RequestCartItem } from "@/types/cart";
import { SaleType, SaleInfoType } from "@/types/sale";
import { toISOString } from "@/helpers/date";
import { isInvalidNumber } from "@/helpers/validation";

import ProductModel from "./Product";
import Store from "./Warehouse";
import Error404 from "@/errors/server/404Error";
import InvalidArgumentError from "@/errors/server/InvalidArgumentError";
import { getId } from "@/helpers/id";
import { isValidCartTotalPrice, isValidReceivedAmount } from "@/validation/sale";


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
                                    name: "$product_info.name"
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
        const products = store.products;
        const sales = store.sales;

        const selectedProducts = products.filter(product => productsIds.includes(product.id));
        
        const itemsList = [];
        const productsMap = new Map<string, RequestCartItem>();
        let totalProfit = 0;

        // sum all quantity values, then throws an InvalidArgumentError if quantity is invalid
        const totalPrice =  cart.items.reduce((prevValue, currentItem) => {
            //check if current item quantity value is valid, then throws an error if not
            if(isInvalidNumber(currentItem.quantity)) {
                throw new InvalidArgumentError("Quantity must not be less than or equal to zero");
            }

            const currentProduct = selectedProducts.find(product => currentItem.product.id === product.id);

            if(!currentProduct) throw new Error404(`Product with '${currentItem.product.id}' id not found`);

            if(currentItem.quantity > currentProduct.stock.quantity) {
                throw new InvalidArgumentError(`Quantity is greater than available stock`);
            }

            const item = {
                ...currentItem,
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
    
            const salesClone = structuredClone(sales);
            salesClone.push(sale);
            
            const updatedProducts = products.map(product => {
                const mappedProduct = productsMap.get(product.id);
    
                if(mappedProduct) {
                    return {
                        ...product,
                        stock: {
                            quantity: currency(product.stock.quantity).subtract(mappedProduct.quantity).value
                        }
                    }
                }
    
                return product;
            });
    
            await mongoDbConfig.collections
                .WAREHOUSES
                .updateOne({ id: warehouseId }, { $set: { products: updatedProducts, sales: salesClone }});
        } catch(e) {
            await mongoDbConfig.collections.
                WAREHOUSES
                .updateOne({ id: warehouseId }, { $set: { products, sales }});

            throw e;
        }
    }
}

export default Sale