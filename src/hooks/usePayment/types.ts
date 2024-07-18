import { Dispatch, SetStateAction } from "react"

import { PaymentType } from "@/types/payment-method";

export type PropsType = {
    setPayment: Dispatch<SetStateAction<PaymentType>>
}

export type ChangePaymentMethodValueType = "amount" | "receivedAmount"

export type PaymentFunctionsType = {
    addPaymentMethod: () => void;
    changePaymentMethodId: (id: number | string, newMethodId: number) => void;
    changePaymentMethodValue: (key: ChangePaymentMethodValueType, id: number | string, amount: number | string ) => void;
    removePaymentMethod: (id: string | number) => void;
}