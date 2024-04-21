import { v4 as uuidV4 } from "uuid";
import currency from "currency.js";

import { MongoDbConfigType } from "@/types/mongoDb";
import { GblobalProductType, ProductType, WarehouseProductType } from "@/types/product";
import Error404 from "@/errors/server/404Error";
import { ConfigType } from "@/types/app-config-server";
import { WarehouseType } from "@/types/warehouse";
//import { WarehouseProductType } from "@/types/warehouse";

type SettingTypo = {
    mongoDbConfig: MongoDbConfigType
}

type UpdateType<T> = { 
    helper: (warehouse: WarehouseType) => T, 
    id: string, 
    key: string 
}

class Product {
    static async get({ id }: { id: string }, { mongoDbConfig }: ConfigType) {
        const warehouse = await mongoDbConfig.collections
            .WAREHOUSES
            .findOne({ id })

        if(!warehouse) throw new Error404("Warehouse not found");

        return warehouse;
    }

    /** Get selected warehouse, then pass it to the helper function that return updated value of type T of the selected key*/
    static async update<T>({ helper, id, key }: UpdateType<T>, { mongoDbConfig, user }: ConfigType) {
        const warehouse = await this.get({ id }, { mongoDbConfig, user });

        //modify selected key's value, then returns new value
        const value = helper(warehouse);

        return await mongoDbConfig
            .collections
            .WAREHOUSES
            .updateOne({ id }, { $set: { [key]: value }});
    }

    static async addProduct({ product, warehouseId }: { product: WarehouseProductType, warehouseId: string }, { mongoDbConfig, user }: ConfigType) {
        // const warehouse = await this.get({ id: warehouseId }, { mongoDbConfig, user });

        // const products = [ ...warehouse.products, product ];

        // return await mongoDbConfig
        //     .collections
        //     .WAREHOUSES
        //     .updateOne({ id: warehouseId }, { $set: { products }});

        return await this.update<WarehouseProductType[]>(
            {
                helper: warehouse => [ ...warehouse.products, product ],
                id: warehouseId,
                key: "products"
            },
            { 
                mongoDbConfig, 
                user 
            }
        )
    }

    static async deleteProduct({ productId, warehouseId }: { productId: string, warehouseId: string }, { mongoDbConfig, user }: ConfigType) {
        try {
            return await this.update<WarehouseProductType[]>(
                {
                    helper: warehouse => [ ...warehouse.products ].filter(product => product.id !== productId ),
                    id: warehouseId,
                    key: "products"
                },
                { 
                    mongoDbConfig, 
                    user 
                }
            );
        } catch(e) {

        }
    }
}

export default Product;