import * as React from "react";

import { PAYMENT_METHODS, ProductPayment } from "@/types/payment-method";
import { CartType } from "@/types/cart";
import { setTotalReceivedAmountAndChanges } from "@/helpers/product-payment";

import { paymentMethodsList } from "@/config/payment-methods";

import usePayment from "@/hooks/usePayment";
import { ChangePaymentMethodValueType } from "@/hooks/usePayment/types";

const initialState = {
    changes: 0,
    paymentMethods: [
        {
            amount: 0, 
            id: paymentMethodsList[0].value,
            transactionId: ""
        }
    ],
    remainingAmount: 0,
    totalReceived: 0
};

const usePaymentMethods = <T>(cart: CartType<T>) => {
    const [ paymentMethods, setPaymentMethods ] = React.useState<ProductPayment>(initialState)

    const {
        add,
        abstractChangePaymentMethodValue,
        abstractRemovePaymentMethod,
        changePaymentMethodId,
        changePaymentMethodTransactionIdValue
    } = usePayment({ setPayment: setPaymentMethods })

    const changePaymentMethodValue = React.useCallback(
        (key: ChangePaymentMethodValueType, id: number | number, amount: number | string ) => {
            abstractChangePaymentMethodValue(key, id, amount, (payment) => setTotalReceivedAmountAndChanges(cart, payment))
        }, 
        [ abstractChangePaymentMethodValue, cart ]
    )

    const removePaymentMethod = React.useCallback(
        (id: PAYMENT_METHODS) => abstractRemovePaymentMethod(id, (payment) => setTotalReceivedAmountAndChanges(cart, payment))
        , 
        [ abstractRemovePaymentMethod, cart ]
    );

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
        changePaymentMethodTransactionIdValue,
        getPaymentMethods,
        removePaymentMethod,
        reset
    }

}

export default usePaymentMethods