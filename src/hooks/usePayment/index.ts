import * as React from "react"
import currency from "currency.js"

import { ChangePaymentMethodValueType, PropsType } from "./types"
import { PaymentType } from "@/types/payment-method"

import { paymentMethodsList } from "@/config/payment-methods"

import { isInvalidNumber } from "@/helpers/validation"


const usePayment = ({ setPayment }: PropsType) => {
    const add = React.useCallback(() => {
        setPayment(payment => {
            const paymentTemp = structuredClone({ ...payment });

            for(let i = 0; i < paymentMethodsList.length; i++) {
                //look for not selected payment method, then add it to the list of paymentMethods
                if(!Boolean(paymentTemp.paymentMethods.find(item =>  item.id === paymentMethodsList[i].value))) {
                    paymentTemp.paymentMethods.push({ 
                        amount: 0, 
                        id: paymentMethodsList[i].value
                    });
                    break;
                }
            }

            return paymentTemp;
        })
    }, [ setPayment ])

    const changePaymentMethodId = React.useCallback((id: number | number, newMethodId: number | string ) => {
        setPayment(payment => {
            const paymentTemp = structuredClone({ ...payment });

            //return previous payment methods list, if newMethodId if already selected in another payment method
            if(Boolean(paymentTemp.paymentMethods.find(item => item.id === newMethodId))) {
                return payment;
            }

            const paymentMethod = paymentTemp.paymentMethods.find(item => item.id === id);

            paymentMethod.id = newMethodId;

            return paymentTemp;
        })
    }, [ setPayment ])

    const abstractRemovePaymentMethod = React.useCallback((id: string | number, func: (payment: PaymentType) => void) => {
        setPayment(payment => {
            const paymentTemp = structuredClone({ ...payment });
            paymentTemp.paymentMethods = paymentTemp.paymentMethods.filter(paymentMethod => paymentMethod.id !== id);

            func(paymentTemp);

            return paymentTemp;
        })
    }, [ setPayment ]);

    const abstractChangePaymentMethodValue = React.useCallback((key: ChangePaymentMethodValueType, id: number | string, amount: number | string, func: (payment: PaymentType) => void ) => {
        setPayment(payment => {
            const paymentTemp = structuredClone({ ...payment });

            const paymentMethod = paymentTemp.paymentMethods.find(item => item.id === id);

            paymentMethod[key] = currency(amount).value;

            if(isInvalidNumber(paymentMethod[key])) {
                paymentMethod[key] = 1;
            }

            func(paymentTemp);

            return paymentTemp;
        })
    }, [ setPayment ])
    
    return {
        add,
        abstractChangePaymentMethodValue, 
        abstractRemovePaymentMethod,
        changePaymentMethodId
    }

}

export default usePayment