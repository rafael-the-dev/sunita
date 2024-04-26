import { v4 as uuidV4 } from "uuid";
import currency from "currency.js";

import { MongoDbConfigType } from "@/types/mongoDb";
import { GblobalProductType, ProductType, ProductInfoType, WarehouseProductType } from "@/types/product";
import { ConfigType } from "@/types/app-config-server";

import { getProducts } from "@/helpers/products"

import Error404 from "@/errors/server/404Error";
import WarehouseModel from "./Warehouse";

class Product {
    static async get({ productId, warehouseId }: { productId: string, warehouseId: string }, { mongoDbConfig, user }: ConfigType) {
        const products = await getProducts({ filter: { "products.id": productId, id: warehouseId,  } }, { mongoDbConfig, user })

        if(products.length === 0) throw new Error404("Product not found")

        return products
    }

    static async getAll({ filters, warehouseId }: { filters?: Object, warehouseId: string }, { mongoDbConfig, user }: ConfigType) {
        try {
            const products = await getProducts({ filter: { ...filters, id: warehouseId } }, { mongoDbConfig, user })
            return products;
        } catch (error) {
              console.error('Error retrieving products:', error);
              throw error;
        }
    }
    
    static async delete({ id, warehouseId }: { id: string, warehouseId: string }, { mongoDbConfig }: ConfigType) {
        return await mongoDbConfig.collections
            .PRODUCTS
            .deleteOne({ id });
    }

    static async register({ barcode, category, name, purchasePrice, sellPrice }: ProductType, { mongoDbConfig, user }: ConfigType) {
        const productId = uuidV4();

        try {
            const product: GblobalProductType = {
                barcode,
                category,
                id: productId,
                name,
                warehouses: [ "12345" ]
            };
    
            const warehouseProduct: WarehouseProductType = {
                id: productId,
                purchasePrice,
                profit: currency(sellPrice).subtract(purchasePrice).value,
                stock: {
                    quantity: 0
                },
                sellPrice
            };
    
            const productPromise = mongoDbConfig.collections
                .PRODUCTS
                .insertOne(product);
            
    
            return await Promise.all([
                productPromise,
                WarehouseModel.addProduct({ product: warehouseProduct, warehouseId: "12345" }, { mongoDbConfig, user })
            ])
        } catch(e) {
            //delete this product if occured an error
            await Promise.all([
                this.delete({ id: productId, warehouseId: "12345" }, { mongoDbConfig, user }),
                WarehouseModel.deleteProduct({ productId, warehouseId: "12345" }, { mongoDbConfig, user })
            ]);

            throw e;
        }
    }
}

export default Product;