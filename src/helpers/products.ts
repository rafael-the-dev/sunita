
import { ConfigType } from "@/types/app-config-server";
import { MongoDbConfigType } from "@/types/mongoDb";
import { ProductInfoType, WarehouseProductType } from "@/types/product";

export const getProducts = async ({ filter }: { filter: Object }, { mongoDbConfig }: ConfigType) => {
    const products = await mongoDbConfig.collections.WAREHOUSES.aggregate([
        // Match the store by its ID
        { $unwind: '$products' },
        { $match: filter },
        // Lookup products that belong to the store
        {
            $lookup: {
                from: 'products', // The name of the Product collection
                localField: 'products.id',
                foreignField: 'id',
                as: 'productsInfo'
            }
        },
        // Unwind the products array to get individual product documents
        { $unwind: '$productsInfo' },
        // Project to reshape the output and remove unnecessary fields
        {
            $project: {
                barcode: '$productsInfo.barcode',
                category: '$productsInfo.category',
                id: '$productsInfo.id',
                name: '$productsInfo.name',
                purchasePrice: '$products.purchasePrice',
                profit: '$products.profit',
                sellPrice: '$products.sellPrice',
                stock: '$products.stock'
                
                // Include additional fields as needed
            }
        }
    ])
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