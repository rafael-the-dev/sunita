
import { ConfigType, FiltersType } from "@/types/app-config-server"

export const getStores = async (filters: FiltersType, config: ConfigType) => {
    const stores = await config
        .mongoDbConfig
        .collections
        .WAREHOUSES
        .aggregate(
            [
                {
                    $match: filters ?? {}
                },
                {
                    $project: {
                        _id: "$id",
                        address: "$address",
                        contact: "$contact",
                        id: "$id",
                        name: "$name",
                        status: "$status"
                    }
                }
            ]
        )
        .toArray()
    
    stores.forEach(store => console.log(store))
    
    return stores
}