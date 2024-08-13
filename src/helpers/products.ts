
import { ConfigType } from "@/types/app-config-server";
import { MongoDbConfigType } from "@/types/mongoDb";
import { ProductInfoType, WarehouseProductType } from "@/types/product";

export const getProducts = async ({ filter }: { filter: Object }, { mongoDbConfig }: ConfigType) => {
    const products = await mongoDbConfig
        .collections
        .PRODUCTS
        .aggregate(
            [
                { $match: filter }
            ]
        )
        .toArray() as ProductInfoType[];
    
    return products;
}

export const updateProduct = (productProxy: WarehouseProductType, storeId: string, mongoDbConfig: MongoDbConfigType) => {
    return mongoDbConfig
        .collections
        .WAREHOUSES
        .updateOne(
            { id: storeId, "products.id": productProxy.id },
            { 
                $set: {
                    "products.$[product].profit": productProxy.profit,
                    "products.$[product].purchasePrice": productProxy.purchasePrice,
                    "products.$[product].sellPrice": productProxy.sellPrice,
                    "products.$[product].stock.quantity": productProxy.stock.quantity,
                }
            },
            {
                arrayFilters: [
                    { "product.id": productProxy.id }
                ]
            }
        )
}