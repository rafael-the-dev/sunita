
import { STATUS } from "@/types";
import { BedroomType, PROPERTY_TYPE, PriceType, PropertyType } from "@/types/property"
import { ROOM_TYPE } from "@/types/room"

import { validate } from "@/validation";
import { validateArray, validateObject } from "../../validation";
import { isValidName, isValidPrice, isValidQuantity } from "@/validation/product";

import InvalidArgumentError from "@/errors/server/InvalidArgumentError"

type PropType = "amenities" | "bedroom" | "images" | "name" | "price" | "quantity" | "status" | "type";

const getRoomProxy = (target: PropertyType) => {

    const proxyHandler: ProxyHandler<PropertyType> = {
        set(target: PropertyType, prop: PropType, newValue: any) {
            switch(prop) {
                case "amenities": {
                    validateArray("amenities", newValue)

                    const amenities = newValue as string[]

                    //remove duplicate amenities
                    const set = new Set(amenities)

                    //@ts-ignore
                    return Reflect.set(target, prop, [ ...set ]);
                }
                case "bedroom": {
                    validateObject("bedroom", newValue)

                    const bedroom = newValue as BedroomType

                    validate(bedroom.quantity?.toString(), "Quantity must be greater than zero", isValidQuantity);

                    const isValidRoomType = Object.
                        values(ROOM_TYPE)
                        .includes(bedroom.type);
                    
                    if(!isValidRoomType) throw new InvalidArgumentError("Invalid room type");

                    return Reflect.set(target, prop, newValue);
                }
                case "name": {
                    validate(newValue, "Invalid property name", isValidName)

                    return Reflect.set(target, prop, newValue);
                }
                case "images": {
                    validateArray("images", newValue)

                    const images = newValue as string[]

                    if(images.length === 0) throw new InvalidArgumentError("Insert at least one image link")

                    //remove duplicate images
                    const set = new Set(images)

                    //@ts-ignore
                    return Reflect.set(target, prop, [ ...set ]);
                }
                case "price": {
                    validateObject("price", newValue)

                    const price = newValue as PriceType

                    validate(price.hourly?.toString(), "Price per hour must be greater than zero", isValidPrice);
                    validate(price.daily?.toString(), "Price per day must be greater than zero", isValidPrice);
                    validate(price.night?.toString(), "Price per night must be greater than zero", isValidPrice);

                    return Reflect.set(target, prop, price);
                }
                case "status": {
                    const isValidRoomType = Object.
                        values(STATUS)
                        .includes(newValue as STATUS);
                    
                    if(!isValidRoomType) throw new InvalidArgumentError("Invalid status");

                    return Reflect.set(target, prop, newValue);
                }
                case "type": {
                    const isValidPropertyType = Object.
                        values(PROPERTY_TYPE)
                        .includes(newValue as PROPERTY_TYPE);
                    
                    if(!isValidPropertyType) throw new InvalidArgumentError("Invalid property type");

                    return Reflect.set(target, prop, newValue);
                }
            }

            return false
        }
    };

    return new Proxy(target, proxyHandler);
};

export default getRoomProxy