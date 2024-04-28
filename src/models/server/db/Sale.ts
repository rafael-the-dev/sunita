import { v4 as uuidV4} from "uuid"
import currency from "currency.js";

import { ConfigType } from "@/types/app-config-server";
import { CartResquestType, RequestCartItem } from "@/types/cart";
import { SaleType, SaleInfoType } from "@/types/sale";

import ProductModel from "./Product";
import Error404 from "@/errors/server/404Error";

class Sale {
    static async getAll({ warehouseId }: { warehouseId: string }, { mongoDbConfig, user }: ConfigType) {
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

        const [ products, warehouse ] = await Promise.all([
            await ProductModel.getAll({ warehouseId }, { mongoDbConfig, user }),
            mongoDbConfig.collections.WAREHOUSES.findOne({ id: warehouseId })
        ]);

        const selectedProducts = products.filter(product => productsIds.includes(product.id))
        
        const itemsList = [];
        const productsMap = new Map<string, RequestCartItem> ();
        let totalProfit = 0;

        const totalPrice =  cart.items.reduce((prevValue, currentItem) => {
            const currentProduct = selectedProducts.find(product => currentItem.product.id === product.id);

            if(!currentProduct) throw new Error404(`Product with '${currentItem.product.id}' id not found`);

            const item = {
                ...currentItem,
                product: {
                    id: currentItem.product.id,
                    price: currentProduct.sellPrice
                }
            };

            totalProfit = currency(totalProfit).add(currency(currentProduct.profit).multiply(currentItem.quantity).value).value;
            itemsList.push(item);
            productsMap.set(currentProduct.id, currentItem);

            const price = currency(currentProduct.sellPrice).multiply(currentItem.quantity);
            return currency(prevValue).add(price).value;
        }, 0)
       
        if(totalPrice !== cart.total) {
            throw new InvalidArgumentError("Client total price doesn't match with server total price")
        }

        let sale: SaleType = {
            changes: cart.changes,
            createAt: new Date(),
            id: uuidV4(),
            items: itemsList,
            profit: totalProfit,
            total: cart.total,
            totalReceived: cart.totalReceived,
            user: "rafaeltivane"
        };

        const sales = structuredClone(warehouse.sales);
        sales.push(sale)
        
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

            return product
        })

        await mongoDbConfig.collections.WAREHOUSES.updateOne({}, { $set: { products: updatedProducts, sales }});
    }
}

export default Sale