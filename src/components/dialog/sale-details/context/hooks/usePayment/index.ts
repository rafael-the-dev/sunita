import { useCallback, useContext, useEffect, useMemo, useState } from "react"

import { ChangePaymentMethodValueType } from "@/hooks/usePayment/types";
import { BookingInfoType } from "@/types/booking";
import { PaymentType } from "@/types/payment-method";

import { FixedTabsContext } from "@/context/FixedTabsContext";

import usePayment from "@/hooks/usePayment"

import { paymentMethodsList } from "@/config/payment-methods";
import { calculatePayment } from "@/helpers/booking";

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

const useBookingPayment = (initial: PaymentType, totalPrice: number) => {

    const [ payment, setPayment ] = useState(
        () => initial
    )

    const {
        add,
        abstractChangePaymentMethodValue,
        abstractRemovePaymentMethod,
        changePaymentMethodId
    } = usePayment({ setPayment })

    const hasErrors = useMemo(
        () => payment.totalReceived < totalPrice || totalPrice <= 0,
        [ payment, totalPrice ]
    )

    const getPayment = useCallback(() => structuredClone(payment), [ payment ])

    const changePaymentMethodValue = useCallback(
        (key: ChangePaymentMethodValueType, id: number | string, amount: number | string ) => {
            abstractChangePaymentMethodValue(key, id, amount, (payment) => calculatePayment(payment, totalPrice))
        }, 
        [ abstractChangePaymentMethodValue, totalPrice ]
    )

    const removePaymentMethod = useCallback(
        (id: string | number) => abstractRemovePaymentMethod(id, (payment) => calculatePayment(payment, totalPrice)), 
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
        changePaymentMethodId, changePaymentMethodValue,
        getPayment,
        removePaymentMethod,
        reset
    }
}

export default useBookingPayment