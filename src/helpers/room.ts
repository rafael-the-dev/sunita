import { ConfigType } from "@/types/app-config-server"
import { MongoDbConfigType } from "@/types/mongoDb"
import { RoomType } from "@/types/room"

export const getRooms =  async ({ filter }: { filter: Object }, { mongoDbConfig }: ConfigType) => {
    const result = await mongoDbConfig
        .collections
        .WAREHOUSES
        .aggregate(
            [
                {
                    $match: { ...( filter ?? {} ) }
                },
                { $unwind: "$rooms" },
                {
                    $group: {
                        _id: "$rooms.id",
                        dailyPrice: { $first: "$rooms.dailyPrice" },
                        hourlyPrice: { $first: "$rooms.hourlyPrice" },
                        id: { $first: "$rooms.id" },
                        quantity: { $first: "$rooms.quantity" },
                        status: { $first: "$rooms.status" },
                        type: { $first: "$rooms.type" }
                    }
                }
            ]
        )
        .toArray();
    
    const rooms = result as RoomType[];

    return rooms;
}

export const updateRoom = (room: RoomType, storeId: string, mongoDbConfig: MongoDbConfigType) => {
    return mongoDbConfig
        .collections
        .WAREHOUSES
        .updateOne(
            { id: storeId, "rooms.id": room.id },
            { 
                $set: {
                    "rooms.$[room].dailyPrice": room.dailyPrice,
                    "rooms.$[room].hourlyPrice": room.hourlyPrice,
                    "rooms.$[room].quantity": room.quantity,
                    "rooms.$[room].status": room.status,
                    "rooms.$[room].type": room.type,
                }
            },
            {
                arrayFilters: [
                    { "room.id": room.id }
                ]
            }
        )
}