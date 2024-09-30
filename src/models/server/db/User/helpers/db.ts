

import { ConfigType, FiltersType } from "@/types/app-config-server"

export const getUsers = async (filters: FiltersType, { mongoDbConfig }: ConfigType) => {
    const users = await mongoDbConfig
        .collections
        .WAREHOUSES
        .aggregate([
            { 
                $match: {
                    ...( filters ?? {} )
                }
            },
            {
                $lookup: {
                    from: "users", // Replace with the name of your external product collection
                    localField: "users.username",
                    foreignField: "username",
                    as: "user_info"
                }
            },
            { $unwind: "$user_info" },
            { $unwind: "$users" },
            {
                $group: {
                    _id: "$user_info.username",
                    category: { $first: "$user_info.category" },
                    firstName: { $first: "$user_info.firstName" },
                    id: { $first: "$user_info.username" },
                    lastName: { $first: "$user_info.lastName" },
                    stores: {
                        $push: {
                            category: "$users.category",
                            storeId: "$id",
                            status: "$users.status",
                            username: "$users.username"
                        }
                    },
                    username: { $first: "$user_info.username" }
                }
            }
        ])
        .toArray();

    return users
}