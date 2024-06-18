import { PaymentMethodType } from "@/types/payment-method";
import { SaleItemType, SaleType } from "@/types/sale"

import { isValidCartTotalPrice, isValidReceivedAmount } from "@/validation/sale";
import { isValidPaymentMethods } from "@/helpers/sales";
import { CartResquestType } from "@/types/cart";


const getSaleProxy = (target: SaleType, cart: CartResquestType) => {
    const proxyHandler = {
        get(target: SaleType, prop: string, receiver) {
            const value = Reflect.get(target, prop, receiver);

            if (typeof value === 'object' && value !== null) {
                return new Proxy(value, this); // Return a proxy for nested objects
            }

            return value;
        },
        set(obj: SaleType, prop: string, newValue) {
            switch(prop) {
                case "changes": {
                    return Reflect.set(obj, prop, newValue)
                }
                case "items": {
                    const items = newValue as SaleItemType[]

                    return Reflect.set(obj, prop, items)
                }
                case "profit": {
                    return Reflect.set(obj, prop, newValue)
                }
                case "paymentMethods": {
                    const paymentMethods = newValue as PaymentMethodType[]

                    //check if server total price match with the client total price, then throw an error if not
                    isValidPaymentMethods(paymentMethods, obj.totalReceived);

                    return Reflect.set(obj, prop, paymentMethods)
                }
                case "total": {
                    const total = newValue as number

                    //check if server total price match with the client total price, then throw an error if not
                    isValidCartTotalPrice(total, cart.total);

                    return Reflect.set(obj, prop, total)
                }
                case "totalReceived": {
                    const totalReceived = newValue as number

                    //check if total received amount is valid and it is greater than or equal to total price
                    isValidReceivedAmount(totalReceived, obj.total);

                    return Reflect.set(obj, prop, totalReceived)
                }
            }

            return false
        }
    }

    return new Proxy(target, proxyHandler)
}

export default getSaleProxy