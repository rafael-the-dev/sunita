
import { ContactType } from "@/types/contact"
import { FeeType, FEES_TYPE } from "@/types/fees";
import { EnrollStoreType as StoreType } from "@/types/warehouse"
import { PaymentType, PAYMENT_STATUS } from "@/types/payment-method";
import { STATUS } from "@/types";

import { STORE_STATUS } from "@/helpers/store";

import { isValidName } from "@/validation/product"
import { isValidPaymentMethods } from "@/helpers/sales";
import { isInvalidTransactionId, hasInvalidAmount } from "@/validation/payment";
import { validate } from "@/validation"
import { validateObject } from "../../validation"
import { validateContact } from "@/models/server/proxy/validation/user"

import InvalidArgumentError from "@/errors/server/InvalidArgumentError";

type StorePropType = "contact" | "latePaymentFine" | "payment" | "status" | "type"

const getFeeProxy = (target: FeeType, monthlyFeePrice: number) => {
    const proxyHandler: ProxyHandler<FeeType> = {
        set(obj: FeeType, prop: StorePropType, newValue: any) {
            switch(prop) {
                case "latePaymentFine": {
                    const latePaymentFine = newValue as boolean

                    if(latePaymentFine) {
                        //replace code below by late payment fine algorythm
                        obj.price = monthlyFeePrice
                        obj.total = monthlyFeePrice
                    } else {
                        obj.price = monthlyFeePrice
                        obj.total = monthlyFeePrice
                    }

                    return Reflect.set(obj, prop, newValue)
                }
                case "payment": {
                    const payment = newValue as PaymentType

                    if(isInvalidTransactionId(payment.paymentMethods)) throw new InvalidArgumentError('Invalid transaction ID')

                    if(hasInvalidAmount(payment.paymentMethods)) throw new InvalidArgumentError('Amount must be greater than zero')
                   
                    //check if server total price match with the client total price, then throw an error if not
                    isValidPaymentMethods(payment.paymentMethods, payment.totalReceived);

                    if(payment.totalReceived < obj.total) {
                        throw new InvalidArgumentError("Total received amount is less than total price")
                    }

                    return Reflect.set(obj, prop, payment)
                }
                case "status": {
                    const status = newValue as PAYMENT_STATUS

                    validate(status, "Invalid status", status => Object.values(PAYMENT_STATUS).includes(status as PAYMENT_STATUS))

                    return Reflect.set(target, prop, status)
                }
                case "type": {
                    const feeType = newValue as FEES_TYPE

                    validate(feeType, "Invalid type", feeType => Object.values(FEES_TYPE).includes(feeType as FEES_TYPE))

                    return Reflect.set(target, prop, feeType)
                }
            
            }
        }
    }

    const storeProxy = new Proxy(target, proxyHandler)

    return storeProxy
}

export default getFeeProxy