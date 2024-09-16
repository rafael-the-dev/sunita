import { useCallback, useContext, useEffect, useMemo, useState } from "react"

import { ChangePaymentMethodValueType } from "@/hooks/usePayment/types";
import { BookingInfoType } from "@/types/booking";
import { PAYMENT_METHODS } from "@/types/payment-method";

import { FixedTabsContext } from "@/context/FixedTabsContext";

import usePayment from "@/hooks/usePayment"

import { paymentMethodsList } from "@/config/payment-methods";
import { calculatePayment } from "@/helpers/booking";
import { isValidPayment } from "@/validation/payment";

const initialState = {
    changes: 0,
    paymentMethods: [
        {
            amount: 0, 
            id: paymentMethodsList[0].value,
            transactionId: null
        }
    ],
    remainingAmount: 0,
    totalReceived: 0
};

const useBookingPayment = (totalPrice: number) => {
    const { getDialog } = useContext(FixedTabsContext);

    const bookingInfo = getDialog().current?.payload as BookingInfoType
    const hasPayload = Boolean(bookingInfo)

    const [ payment, setPayment ] = useState(
        () => {
            if(!hasPayload) return initialState;

            return {
                ...bookingInfo.payment
            }
        }
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
        (key: ChangePaymentMethodValueType, id: PAYMENT_METHODS, amount: number | string ) => {
            abstractChangePaymentMethodValue(key, id, amount, (payment) => calculatePayment(payment, totalPrice))
        }, 
        [ abstractChangePaymentMethodValue, totalPrice ]
    )

    const removePaymentMethod = useCallback(
        (id: PAYMENT_METHODS) => abstractRemovePaymentMethod(id, (payment) => calculatePayment(payment, totalPrice)), 
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