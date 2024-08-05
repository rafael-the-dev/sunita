
import { ConfigType } from "@/types/app-config-server"
import { SupplierType } from "@/types/Supplier"

export const retrieveSuppliers = async ({ filters }: { filters?: Object }, { mongoDbConfig, user }: ConfigType) => {
    const id = user.stores[0].storeId;

    const suppliersList = await mongoDbConfig
        .collections
        .WAREHOUSES
        .aggregate(
            [
                { 
                    $match: { id }
                },
                {
                    $match: filters ?? {}
                },
                {
                    $lookup: {
                        from: "suppliers",
                        foreignField: "id",
                        localField: "suppliers.id",
                        as: "suppliersList"
                    }
                },
                {
                    $unwind: "$suppliersList"
                },
                {
                    $group: {
                        _id: "$suppliersList.id",
                        address: { $first: "$suppliersList.address" },
                        contact: { $first: "$suppliersList.contact"},
                        id: { $first: "$suppliersList.id" },
                        name: { $first: "$suppliersList.name" },
                        nuit: { $first: "$suppliersList.nuit" },
                        status: { $first: "$suppliersList.status" }
                    }
                }
            ]
        )
        .toArray() as SupplierType[]
    
    return suppliersList
}

export const updateSupplier = async ({ supplier }: { supplier: SupplierType }, { mongoDbConfig, user }: ConfigType) => {
    //@ts-ignore
    const { _id, ...rest } = supplier

    return mongoDbConfig
        .collections
        .SUPPLIERS
        .updateOne(
            { id: supplier.id },
            {
                $set: {
                    ...rest
                }
            }
        )
}