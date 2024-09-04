import { ConfigType, FiltersType } from "@/types/app-config-server"
import { MongoDbConfigType } from "@/types/mongoDb"
import { PropertyType } from "@/types/property";
import { STATUS } from "@/types";

import getPropertyProxy from "../proxy"

export const setProperty = (newProperty: PropertyType, property: PropertyType) => {
    const { amenities, bedroom, images, name, price, type } = property

    const propertyProxy = getPropertyProxy(newProperty)

    propertyProxy.amenities = amenities;
    propertyProxy.bedroom = bedroom;
    propertyProxy.images = images
    propertyProxy.name = name
    propertyProxy.price = price;
    propertyProxy.status = STATUS.ACTIVE;
    propertyProxy.type = type;
}

export const getProperties =  async ({ filter, storeId }: { filter: FiltersType, storeId?: string }, { mongoDbConfig }: ConfigType) => {
    const result = await mongoDbConfig
        .collections
        .PROPERTIES
        .aggregate(
            [
                //{ $unwind: "$rooms" },
                {
                    $match: { ...( filter ?? {} ) }
                },
                /*{
                    $group: {
                        _id: "$rooms.id",
                        dailyPrice: { $first: "$rooms.dailyPrice" },
                        hourlyPrice: { $first: "$rooms.hourlyPrice" },
                        id: { $first: "$rooms.id" },
                        quantity: { $first: "$rooms.quantity" },
                        status: { $first: "$rooms.status" },
                        type: { $first: "$rooms.type" }
                    }
                }*/
            ]
        )
        .toArray();
    
    const rooms = result as PropertyType[];

    return rooms;
}

export const updateRoom = (property: PropertyType, owner: string, mongoDbConfig: MongoDbConfigType) => {
    //@ts-ignore
    const { _id, ...propertyRest } = property

    return mongoDbConfig
        .collections
        .PROPERTIES
        .updateOne(
            { id: property.id, owner },
            { 
                $set: propertyRest
            }
        )
}