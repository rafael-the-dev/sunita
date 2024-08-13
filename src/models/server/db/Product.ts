import { v4 as uuidV4 } from "uuid";
import currency from "currency.js";

import { GblobalProductType, PRODUCT_STATUS, ProductType, StoreProductType, WarehouseProductType } from "@/types/product";
import { ConfigType } from "@/types/app-config-server";

import { toISOString } from "@/helpers/date"
import { getProducts } from "@/helpers/products"

import getProductProxy from "../proxy/product";

import Error404 from "@/errors/server/404Error";

class Product {
    static async get({ productId, storeId }: { productId: string, storeId: string }, { mongoDbConfig, user }: ConfigType) {
        const products = await getProducts({ filter: { "products.id": productId, id: storeId,  } }, { mongoDbConfig, user })

        if(products.length === 0) throw new Error404("Product not found")

        return products
    }

    static async getAll({ filters, storeId }: { filters?: Object, storeId: string }, config: ConfigType) {
        try {
            const products = await getProducts(
                { 
                    filter: { 
                        ...filters, 
                        stores: storeId 
                    } 
                }, 
                config
            )

            return products;
        } catch (error) {
              console.error('Error retrieving products:', error);
              throw error;
        }
    }
    
    static async delete({ id, storeId }: { id: string, storeId: string }, { mongoDbConfig }: ConfigType) {
        return await Promise.all(
            [
                mongoDbConfig
                    .collections
                    .PRODUCTS
                    .deleteOne({ id }),
                /*mongoDbConfig
                    .collections
                    .WAREHOUSES
                    .updateOne(
                        { id: storeId },
                        {
                            $pull: {
                                "products": {
                                    id
                                } 
                            }
                        }
                    )*/
            ]
        )
    }

    static async register({ product, storeId }: { product: StoreProductType, storeId: string }, { mongoDbConfig, user }: ConfigType) {
        const { 
            car,
            category, 
            cloth,
            expirable,
            furnicture,
            name, 
            purchasePrice, 
            sellPrice 
        } = product
        const productId = uuidV4();

        try {
            const storeProduct: StoreProductType = {
                createdAt: toISOString(new Date(Date.now())),
                category: null,
                id: productId,
                name: null,
                purchasePrice: null,
                profit: currency(sellPrice).subtract(purchasePrice).value,
                status: PRODUCT_STATUS.ACTIVE,
                stock: { quantity: 0 },
                sellPrice,
                username: user.username,
                stores: [ storeId ]
            };

            const productProxy = getProductProxy(storeProduct)

            productProxy.car = car;
            productProxy.category = category;
            productProxy.expirable = expirable;
            productProxy.furnicture = furnicture;
            productProxy.name = name;
            productProxy.purchasePrice = purchasePrice;
            productProxy.sellPrice = sellPrice;
    
            await mongoDbConfig
                .collections
                .PRODUCTS
                .insertOne(storeProduct);

            /*await mongoDbConfig
                .collections
                .WAREHOUSES 
                .updateOne(
                    {
                        id: storeId
                    },
                    {
                        $push: {
                            products: storeProduct
                        }
                    }
                )*/
        } catch(e) {
            //delete this product if occured an error
            await this.delete({ id: productId, storeId }, { mongoDbConfig, user })

            throw e;
        }
    }
}

export default Product;