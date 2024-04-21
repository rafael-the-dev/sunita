
import WarehouseModel from "@/models/server/db/Warehouse";

import { ConfigType } from "@/types/app-config-server";
import { ProductInfoType } from "@/types/product";

export const getProducts = async ({ filter }: { filter: Object }, { mongoDbConfig }) => {
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
                price: '$products.sellPrice',
                stock: '$products.stock'
                
                // Include additional fields as needed
            }
        }
    ])
    .toArray() as ProductInfoType[];

    return products;
}