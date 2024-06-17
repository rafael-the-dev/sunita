import InvalidArgumentError from "@/errors/server/InvalidArgumentError"
import { WarehouseProductType } from "@/types/product"
import currency from "currency.js"

type PropType = "profit" | "purchasePrice" | "quantity" | "stock" | "sellPrice"

const isLessThanZero = (newValue: string | number, errorMessage: string) => {
    const value = currency(newValue as number).value

    if(value < 0) throw new InvalidArgumentError(errorMessage);

    return false
}

const getProductProxy = (target: WarehouseProductType) => {

    const proxyHandler = {
        get(target: WarehouseProductType, prop: PropType, receiver) {
            const value = Reflect.get(target, prop, receiver);

            if (typeof value === 'object' && value !== null) {
                return new Proxy(value, this); // Return a proxy for nested objects
            }

            return value;
        },
        set(obj: WarehouseProductType, prop: PropType, newValue: any) {
            switch(prop) {
                case "profit": {
                    isLessThanZero(newValue, "Profit must not be less than or equal to zero");

                    return Reflect.set(obj, prop, newValue);
                }
                case "purchasePrice": {
                    isLessThanZero(newValue, "Purchase price must not be less than to zero");

                    return Reflect.set(obj, prop, newValue);
                }
                case "quantity": {
                    isLessThanZero(newValue, "Quantity must not be less than zero");

                    return Reflect.set(obj, prop, newValue);
                }
                case "sellPrice": {
                    isLessThanZero(newValue, "Sell price must not be less than zero");

                    if(obj[prop] < obj.purchasePrice) throw new InvalidArgumentError("Sell price must not be less than purchase price");

                    return Reflect.set(obj, prop, newValue);
                }
            }

            return false
        }
    }

    return new Proxy(target, proxyHandler)
}

export default getProductProxy