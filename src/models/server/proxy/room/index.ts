import InvalidArgumentError from "@/errors/server/InvalidArgumentError"
import { isInvalidNumber } from "@/helpers/validation"
import { STATUS } from "@/types";
import { ROOM_TYPE, RoomType } from "@/types/room"

type PropType = "dailyPrice" | "hourlyPrice" | "quantity" | "status" | "type";

const validateNumber = (value: number, errorMessage: string, minValue?: number) => {
    const isInvalidPrice = isInvalidNumber(value, minValue ?? 1);

    if(isInvalidPrice) {
        throw new InvalidArgumentError(errorMessage);
    }
};

const getRoomProxy = (target: RoomType) => {

    const proxyHandler: ProxyHandler<RoomType> = {
        set(target: RoomType, prop: PropType, newValue: any) {
            switch(prop) {
                case "dailyPrice": {
                    validateNumber(newValue as number, "Daily price must be greater than zero");

                    return Reflect.set(target, prop, newValue);
                }
                case "hourlyPrice": {
                    validateNumber(newValue as number, "Hourly price must be greater than zero");

                    return Reflect.set(target, prop, newValue);
                }
                case "quantity": {
                    validateNumber(newValue as number, "Quantity must be greater than zero");

                    return Reflect.set(target, prop, newValue);
                }
                case "status": {
                    const isValidRoomType = Object.
                        values(STATUS)
                        .includes(newValue as STATUS);
                    
                    if(!isValidRoomType) throw new InvalidArgumentError("Invalid status");

                    return Reflect.set(target, prop, newValue);
                }
                case "type": {
                    const isValidRoomType = Object.
                        values(ROOM_TYPE)
                        .includes(newValue as ROOM_TYPE);
                    
                    if(!isValidRoomType) throw new InvalidArgumentError("Invalid room type");

                    return Reflect.set(target, prop, newValue);
                }
            }

            return false
        }
    };

    return new Proxy(target, proxyHandler);
};

export default getRoomProxy