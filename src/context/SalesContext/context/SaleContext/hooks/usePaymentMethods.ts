import * as React from "react";
import currency from "currency.js";

import { PaymentMethodListItemType, PaymentMethodType } from "@/types/payment-method";

const paymentMethodsList: PaymentMethodListItemType[] = [
    { value: 100, label: "Cash" },
    { value: 200, label: "M-pesa" },
    { value: 300, label: "E-mola" },
    { value: 400, label: "M-kesh" },
    { value: 500, label: "POS" },
    { value: 600, label: "P24" }
];

const usePaymentMethods = () => {
    const [ paymentMethods, setPaymentMethods ] = React.useState<PaymentMethodType[]>([])

    const add = React.useCallback(() => {
        setPaymentMethods(currentMethods => {
            const listTemp = structuredClone([ ...currentMethods ]);

            for(let i = 0; i < paymentMethodsList.length; i++) {
                //look for not selected payment method, then add it to the list of paymentMethods
                if(!Boolean(listTemp.find(item =>  item.id === paymentMethodsList[i].value))) {
                    listTemp.push({ 
                        amount: 0, 
                        id: paymentMethodsList[i].value, 
                        receivedAmount: 0 
                    });
                    break;
                }
            }

            return listTemp;
        })
    }, [])

    const changePaymentMethodValue = React.useCallback((key: string, id: number | number, amount: number | string ) => {
        setPaymentMethods(currentMethods => {
            const listTemp = structuredClone([ ...currentMethods ]);

            const paymentMethod = listTemp.find(item => item.id === id);

            paymentMethod[key] = currency(amount).value;

            return listTemp;
        })
    }, [])

    const changePaymentMethodId = React.useCallback((id: number | number, newMethodId: number | string ) => {
        setPaymentMethods(currentMethods => {
            const listTemp = structuredClone([ ...currentMethods ]);

            //return previous payment methods list, if newMethodId if already selected in another payment method
            if(Boolean(listTemp.find(item => item.id === newMethodId))) {
                return currentMethods;
            }

            const paymentMethod = listTemp.find(item => item.id === id);

            paymentMethod.id = newMethodId;

            return listTemp;
        })
    }, [])

    const removePaymentMethod = React.useCallback((id: string | number) => {
        setPaymentMethods(currentMethods => {
            return structuredClone([ ...currentMethods ]).filter(paymentMethod => paymentMethod.id !== id);
        })
    }, [])

    const getPaymentMethods = () => paymentMethods;

    return {
        addPaymentMethod: add,
        changePaymentMethodValue,
        changePaymentMethodId,
        getPaymentMethods,
        removePaymentMethod
    }

}

export default usePaymentMethods