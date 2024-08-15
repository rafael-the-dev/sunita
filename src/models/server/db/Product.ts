import { v4 as uuidV4 } from "uuid";
import currency from "currency.js";

import { GblobalProductType, PRODUCT_STATUS, ProductType, StoreProductType, WarehouseProductType } from "@/types/product";
import { ConfigType } from "@/types/app-config-server";

import { toISOString } from "@/helpers/date"
import { getProducts } from "@/helpers/products"

import getProductProxy from "../proxy/product";

import Error404 from "@/errors/server/404Error";
import InvalidArgumentError from "@/errors/server/InvalidArgumentError";

class Product {
    static async get({ productId, storeId }: { productId: string, storeId: string }, config: ConfigType) {
        const products = await getProducts({ filter: { id: productId, stores: storeId,  } }, config)

        if(products.length === 0) throw new Error404("Product not found")

        return products[0]
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
            barcode,
            car,
            category, 
            cloth,
            description,
            expirable,
            furnicture,
            name, 
            purchasePrice, 
            sellPrice 
        } = product

        const productId = uuidV4();

        try {
            const requestedProduct = await this.getAll(
                {
                    filters: {
                        barcode: product.barcode,
                    },
                    storeId: user.stores[0].storeId
                },
                {
                    mongoDbConfig,
                    user
                }
            )

            if(requestedProduct.length  > 0) throw new InvalidArgumentError("Id/Barcode already exists")

            const storeProduct: StoreProductType = {
                barcode: null,
                createdAt: toISOString(new Date(Date.now())),
                category: null,
                description,
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

            productProxy.barcode = barcode;
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
        } catch(e) {
            //delete this product if occured an error
            await this.delete({ id: productId, storeId }, { mongoDbConfig, user })

            throw e;
        }
    }

    static async update({ product, storeId }: { product: StoreProductType, storeId: string }, config: ConfigType) {
        const { 
            barcode,
            car,
            category, 
            cloth,
            description,
            expirable,
            furnicture,
            name, 
            purchasePrice, 
            sellPrice 
        } = product

        const requestedProduct = await this.get(
            {
                productId: product.id,
                storeId: "12345"
            },
            config
        )

        const  { mongoDbConfig, user } = config

        try {
            const productClone = structuredClone(requestedProduct)

            const productProxy = getProductProxy(productClone)

            productClone.description = description
            productProxy.barcode = barcode;
            productProxy.car = car;
            productProxy.category = category;
            productProxy.expirable = expirable;
            productProxy.furnicture = furnicture;
            productProxy.name = name;
            productProxy.purchasePrice = purchasePrice;
            productProxy.sellPrice = sellPrice;

            //@ts-ignore
            const { _id, ...productRest } = productClone
    
            await mongoDbConfig
                .collections
                .PRODUCTS
                .updateOne(
                    { id: product.id },
                    {
                        $set: {
                            ...productRest
                        }
                    }
                );
        } catch(e) {
            //@ts-ignore
            const { _id, ...productRest } = requestedProduct

            await mongoDbConfig
                .collections
                .PRODUCTS
                .updateOne(
                    { id: product.id },
                    {
                        $set: {
                            ...productRest
                        }
                    }
                );

            throw e;
        }
    }
}

export default Product;