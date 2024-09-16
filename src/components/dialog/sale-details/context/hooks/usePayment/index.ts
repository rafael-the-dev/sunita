import { useCallback, useEffect, useMemo, useState } from "react"

import { ChangePaymentMethodValueType } from "@/hooks/usePayment/types";
import { PaymentType, PAYMENT_METHODS } from "@/types/payment-method";

import usePayment from "@/hooks/usePayment"

import { paymentMethodsList } from "@/config/payment-methods";
import { calculatePayment } from "@/helpers/booking";
import { isValidPayment } from "@/validation/payment"

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

const useBookingPayment = (initial: PaymentType, totalPrice: number) => {

    const [ payment, setPayment ] = useState(
        () => initial
    )

    const {
        add,
        abstractChangePaymentMethodValue,
        abstractRemovePaymentMethod,
        changePaymentMethodId,
        changePaymentMethodTransactionIdValue
    } = usePayment({ setPayment })

    const hasErrors = useMemo(
        () => !isValidPayment(payment, totalPrice),
        [ payment, totalPrice ]
    )

    const getPayment = useCallback(() => structuredClone(payment), [ payment ])

    const changePaymentMethodValue = useCallback(
        (key: ChangePaymentMethodValueType, id: number | string, amount: number | string ) => {
            abstractChangePaymentMethodValue(key, id as PAYMENT_METHODS, amount, (payment) => calculatePayment(payment, totalPrice))
        }, 
        [ abstractChangePaymentMethodValue, totalPrice ]
    )

    const removePaymentMethod = useCallback(
        (id: string | number) => abstractRemovePaymentMethod(id as PAYMENT_METHODS, (payment) => calculatePayment(payment, totalPrice)), 
        [ abstractRemovePaymentMethod, totalPrice ]
    );

    const reset = useCallback(
        () => setPayment(initialState),
        []
    );

    useEffect(
        () => {
            setPayment(payment => {
                const newPayment = structuredClone(payment);

                calculatePayment(newPayment, totalPrice);

                return newPayment;
            })
        },
        [ totalPrice ]
    )

    return {
        hasErrors, 

        addPaymentMethod: add,
        changePaymentMethodId, changePaymentMethodValue, changePaymentMethodTransactionIdValue,
        getPayment,
        removePaymentMethod,
        reset
    }
}

export default useBookingPayment