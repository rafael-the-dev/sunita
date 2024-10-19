
import { ConfigType, FiltersType } from "@/types/app-config-server"
import { UserType } from "@/types/user"

export const getUsers = async (filters: FiltersType, { mongoDbConfig }: ConfigType) => {
    const users = await mongoDbConfig
        .collections
        .USERS
        .aggregate(
            [
                { 
                    $match: {
                        ...( filters ?? {} )
                    }
                },
                {
                    $lookup: {
                        from: "warehouses", // Replace with the name of your external product collection
                        localField: "username",
                        foreignField: "users.username",
                        as: "store_info"
                    }
                },
                { $unwind: "$store_info" },
                {
                    $group: {
                        _id: "$username",
                        address: { $first: "$address" },
                        category: { $first: "$category" },
                        contact: { $first: "$contact" },
                        document: { $first: "$document" },
                        firstName: { $first: "$firstName" },
                        id: { $first: "$username" },
                        lastName: { $first: "$lastName" },
                        stores: {
                            $push: {
                                category: "$category",
                                storeId: "$store_info.id",
                                status: "$store_info.status",
                                username: "$username"
                            }
                        },
                        username: { $first: "$username" }
                    }
                }
            ]
        )
        .toArray() as UserType[];

    return users

}