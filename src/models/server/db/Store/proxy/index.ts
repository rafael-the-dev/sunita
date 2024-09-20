
import { ContactType } from "@/types/contact"
import { EnrollStoreType as StoreType } from "@/types/warehouse"
import { PaymentType } from "@/types/payment-method";
import { STATUS } from "@/types";

import { STORE_STATUS } from "@/helpers/store";

import { isValidName } from "@/validation/product"
import { isValidPaymentMethods } from "@/helpers/sales";
import { isInvalidTransactionId, hasInvalidAmount } from "@/validation/payment";
import { validate } from "@/validation"
import { validateAddress } from "@/models/server/proxy/validation";
import { validateObject } from "../../validation"
import { validateContact } from "@/models/server/proxy/validation/user"

import InvalidArgumentError from "@/errors/server/InvalidArgumentError";

type StorePropType = "address" | "contact" | "name" | "payment" | "status"

const getStoreProxy = (target: StoreType) => {
    const proxyHandler: ProxyHandler<StoreType> = {
        set(obj: StoreType, prop: StorePropType, newValue: any) {
            switch(prop) {
                case "address": {
                    //throw an error, If address is invalid
                    validateAddress(newValue)

                    return Reflect.set(target, prop, newValue);
                }
                case "contact": {
                    //throw an error, If contact is invalid
                    validateObject("contact", newValue)

                    validateContact(newValue as ContactType)

                    return Reflect.set(target, prop, newValue);
                }
                case "name": {
                    const name = newValue as string

                    validate(name, "Invalid store name", isValidName)

                    return Reflect.set(target, prop, name)
                }
                case "payment": {
                    const payment = newValue as PaymentType

                    if(isInvalidTransactionId(payment.paymentMethods)) throw new InvalidArgumentError('Invalid transaction ID')

                    if(hasInvalidAmount(payment.paymentMethods)) throw new InvalidArgumentError('Amount must be greater than zero')
                   
                    //check if server total price match with the client total price, then throw an error if not
                    isValidPaymentMethods(payment.paymentMethods, payment.totalReceived);

                    return Reflect.set(obj, prop, payment)
                }
                case "status": {
                    const status = newValue as STATUS

                    validate(status, "Invalid status", status => STORE_STATUS.includes(status as STATUS))

                    return Reflect.set(target, prop, name)
                }
            
            }
        }
    }

    const storeProxy = new Proxy(target, proxyHandler)

    return storeProxy
}

export default getStoreProxy