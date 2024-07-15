import { getId } from "@/helpers/id";
import { ConfigType } from "@/types/app-config-server";
import { RoomType } from "@/types/room";
import getRoomProxy from "../proxy/room";
import { STATUS } from "@/types";
import Error404 from "@/errors/server/404Error";
import { getRooms, updateRoom } from "@/helpers/room";

class Room {
    static async get({ filter }: { filter: Object }, { mongoDbConfig, user }: ConfigType) {
        const storeId = user.stores[0].storeId;

        const result = await getRooms({ filter, storeId }, { mongoDbConfig, user })

        if(result.length === 0) throw new Error404("Room not found")
        
        const room = result[0] as RoomType

        return room
    }

    static async getAll({ filter }: { filter: Object }, { mongoDbConfig, user }: ConfigType) {
        const storeId = user.stores[0].storeId;

        const rooms = await getRooms({ filter, storeId }, { mongoDbConfig, user })

        return rooms
    }

    static async register({ dailyPrice, hourlyPrice, quantity, type }: RoomType, { mongoDbConfig, user }: ConfigType) {
        const id = getId();
        const storeId = user.stores[0].storeId;

        try {
            const room: RoomType = {
                dailyPrice: 0,
                hourlyPrice: 0,
                id,
                quantity: 0,
                status: STATUS.ACTIVE,
                type: null
            }

            const roomProxy = getRoomProxy(room)

            roomProxy.dailyPrice = dailyPrice;
            roomProxy.hourlyPrice = hourlyPrice;
            roomProxy.quantity = quantity;
            roomProxy.type = type;

            await mongoDbConfig
                .collections
                .WAREHOUSES
                .updateOne(
                    { id: storeId },
                    {
                        $push: {
                            rooms: room
                        }
                    }
                )
        } catch(e) {
            await mongoDbConfig
                .collections
                .WAREHOUSES
                .updateOne(
                    { id: storeId },
                    {
                        $pull: {
                            rooms: {
                                id
                            }
                        }
                    }
                );

            throw e
        }
    }

    static async upddate({ dailyPrice, hourlyPrice, id, quantity, status, type }: RoomType, { mongoDbConfig, user }: ConfigType) {
        const storeId = user.stores[0].storeId;

        const room = await this.get(
            { 
                filter: {
                    "rooms.id": id
                }
            },
            { 
                mongoDbConfig, 
                user 
            }
        );

        const roomClone = structuredClone(room);
        
        try {
            const roomProxy = getRoomProxy(roomClone);

            roomProxy.dailyPrice = dailyPrice;
            roomProxy.hourlyPrice = hourlyPrice;
            roomProxy.quantity = quantity;
            roomProxy.type = type;
            
            await updateRoom(roomProxy, storeId, mongoDbConfig);
        } catch(e) {
            await updateRoom(room, storeId, mongoDbConfig);

            throw e;
        }
    }
}

export default Room