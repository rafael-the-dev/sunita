import { Dispatch, SetStateAction } from "react"

import { PaymentType } from "@/types/payment-method";

export type IdType = number | string

export type PropsType = {
    setPayment: Dispatch<SetStateAction<PaymentType>>
}

export type ChangePaymentMethodValueType = "amount" | "receivedAmount"

export type PaymentFunctionsType = {
    addPaymentMethod: () => void;
    changePaymentMethodId: (id: IdType, newMethodId: number) => void;
    changePaymentMethodValue: (key: ChangePaymentMethodValueType, id: IdType, amount: number | string) => void;
    changePaymentMethodTransactionIdValue: (id: IdType, value: string ) => void;
    removePaymentMethod: (id: IdType) => void;
}