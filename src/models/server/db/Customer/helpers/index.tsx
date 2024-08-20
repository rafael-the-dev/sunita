
import { ConfigType, FiltersType } from "@/types/app-config-server"
import { CustomerInfoType } from "@/types/guest"

export const getCustomers = async ({ filters }: { filters?: FiltersType }, { mongoDbConfig, user }: ConfigType) => {
    const id = user.stores[0].storeId

    const customers = await mongoDbConfig
        .collections
        .WAREHOUSES
        .aggregate(
            [
                {
                    $match: { id }
                },
                {
                    $lookup: {
                        from: "clients",
                        foreignField: "id",
                        localField: "clients.id",
                        as: "customerInfo"
                    }
                },
                {
                    $unwind: "$customerInfo"
                },
                {
                    $project: {
                        _id: "$custommerInfo.id",
                        contact: "$customerInfo.contact" ,
                        document: "$customerInfo.document" ,
                        firstName: "$customerInfo.firstName" ,
                        id: "$customerInfo.id",
                        lastName: "$customerInfo.lastName" 
                    }
                }
            ]
        )
        .toArray() as CustomerInfoType[]

    return customers
}