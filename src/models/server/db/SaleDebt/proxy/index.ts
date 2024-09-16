import currency from "currency.js";

import { PaymentMethodType } from "@/types/payment-method";
import { DebtType, SaleItemType, SaleType } from "@/types/sale"

import { isValidCartTotalPrice } from "@/validation/sale";
import { isValidPrice } from "@/validation/product";
import { isValidPaymentMethods } from "@/helpers/sales";
import { isInvalidTransactionId, hasInvalidAmount } from "@/validation/payment";

import { validate } from "@/validation";

import InvalidArgumentError from "@/errors/server/InvalidArgumentError";

const getUnpaidSaleProxy = (target: DebtType, cartTotalPrice: number) => {
    const proxyHandler = {
        get(target: DebtType, prop: string, receiver) {
            const value = Reflect.get(target, prop, receiver);

            if (typeof value === 'object' && value !== null) {
                return new Proxy(value, this); // Return a proxy for nested objects
            }

            return value;
        },
        set(obj: DebtType, prop: string, newValue) {
            switch(prop) {
                case "changes": {
                    validate(obj?.changes?.toString(), "Changes are not valid amount", isValidPrice)

                    if(obj.changes > 0 && obj.totalReceived < obj.remainingAmount) {
                        throw new InvalidArgumentError("Invalid changes, Total received is not greater than remaining amount")
                    }

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
                    const paymentMethods = newValue.list as PaymentMethodType[]

                    if(isInvalidTransactionId(paymentMethods)) throw new InvalidArgumentError('Invalid transaction ID')

                    if(hasInvalidAmount(paymentMethods)) throw new InvalidArgumentError('Amount must be greater than zero')
                   
                    //check if server total price match with the client total price, then throw an error if not
                    isValidPaymentMethods(paymentMethods, obj.totalReceived);

                    return Reflect.set(obj, prop, paymentMethods)
                }
                case "total": {
                    const total = newValue as number

                    validate(total?.toString(), "Total price is not valid number", isValidPrice)

                    //check if server total price match with the client total price, then throw an error if not
                    isValidCartTotalPrice(total, cartTotalPrice);

                    return Reflect.set(obj, prop, total)
                }
                case "totalReceived": {
                    const totalReceived = newValue as number

                    //check if total received amount is valid and it is greater than or equal to total price
                    //isValidReceivedAmount(totalReceived, obj.total);
                    validate(totalReceived?.toString(), "Total received amount is not valid number", isValidPrice)

                    return Reflect.set(obj, prop, totalReceived)
                }
            }

            return false
        }
    }

    return new Proxy(target, proxyHandler)
}

export default getUnpaidSaleProxy