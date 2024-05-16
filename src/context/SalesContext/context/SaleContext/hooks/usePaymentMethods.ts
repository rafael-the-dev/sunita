import * as React from "react";
import currency from "currency.js";

import { ProductPayment } from "@/types/payment-method";
import { CartType } from "@/types/cart";
import { setTotalReceivedAmountAndChanges } from "@/helpers/product-payment";
import { isInvalidNumber } from "@/helpers/validation";

import { paymentMethodsList } from "@/config/payment-methods";

const initialState = {
    changes: 0,
    paymentMethods: [
        {
            amount: 0, 
            id: paymentMethodsList[0].value
        }
    ],
    remainingAmount: 0,
    totalReceived: 0
};

const usePaymentMethods = <T>(cart: CartType<T>) => {
    const [ paymentMethods, setPaymentMethods ] = React.useState<ProductPayment>(initialState)

    const add = React.useCallback(() => {
        setPaymentMethods(payment => {
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
    }, [])

    const changePaymentMethodValue = React.useCallback((key: string, id: number | number, amount: number | string ) => {
        setPaymentMethods(payment => {
            const paymentTemp = structuredClone({ ...payment });

            const paymentMethod = paymentTemp.paymentMethods.find(item => item.id === id);

            paymentMethod[key] = currency(amount).value;

            if(isInvalidNumber(paymentMethod[key])) {
                paymentMethod[key] = 1;
            }

            setTotalReceivedAmountAndChanges(cart, paymentTemp);

            return paymentTemp;
        })
    }, [ cart ])

    const changePaymentMethodId = React.useCallback((id: number | number, newMethodId: number | string ) => {
        setPaymentMethods(payment => {
            const paymentTemp = structuredClone({ ...payment });

            //return previous payment methods list, if newMethodId if already selected in another payment method
            if(Boolean(paymentTemp.paymentMethods.find(item => item.id === newMethodId))) {
                return payment;
            }

            const paymentMethod = paymentTemp.paymentMethods.find(item => item.id === id);

            paymentMethod.id = newMethodId;

            return paymentTemp;
        })
    }, [])

    const removePaymentMethod = React.useCallback((id: string | number) => {
        setPaymentMethods(payment => {
            const paymentTemp = structuredClone({ ...payment });
            paymentTemp.paymentMethods = paymentTemp.paymentMethods.filter(paymentMethod => paymentMethod.id !== id);

            setTotalReceivedAmountAndChanges(cart, paymentTemp);

            return paymentTemp;
        })
    }, [ cart ]);

    const reset = React.useCallback(() => {
        setPaymentMethods(initialState)
    }, [])

    const getPaymentMethods = React.useCallback(() => paymentMethods, [ paymentMethods ]);

    React.useEffect(() => {
        setPaymentMethods(payment => {
            const paymentTemp = structuredClone({ ...payment });

            setTotalReceivedAmountAndChanges(cart, paymentTemp);

            return paymentTemp;
        })
    }, [ cart ]);

    return {
        addPaymentMethod: add,
        changePaymentMethodValue,
        changePaymentMethodId,
        getPaymentMethods,
        removePaymentMethod,
        reset
    }

}

export default usePaymentMethods