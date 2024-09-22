import currency from "currency.js"

import { ConfigType, FiltersType } from "@/types/app-config-server"
import { FeeDetailsType } from "@/types/fees"

export const getFees = async (filters: FiltersType, config: ConfigType) => {
    //
    const fees = await config
        .mongoDbConfig
        .collections
        .FEES
        .aggregate(
            [
                {
                    $match: filters ?? {}
                },
                /*{
                    $lookup: {
                        from: "warehouses",
                        foreignField: "id",
                        localField: "storeId",
                        as: "stores"
                    }
                },*/
                {
                    $group: {
                        _id: "$id",
                        id: { $first: "$id" },
                        latePaymentFine: { $first: "$latePaymentFine" },
                        price: { $first: "$price" },
                        payment: { $first: "$payment" },
                        //registeredBy: "",
                        status: { $first: "$status" },
                        type: { $first: "$type" },
                        total: { $first: "$total" },
                    }
                }
            ]
        )
        .toArray() as FeeDetailsType[]
    
    const total = fees.reduce(
        (previousValue, currentFee) => currency(previousValue).add(currentFee.total).value,
        0
    )

    return {
        list: fees,
        total
    }

}