
import { PaymentType, PAYMENT_STATUS } from "./payment-method"

export enum FEES_TYPE {
    ENROLLMENT = "enrollment",
    SUBSCRIPTION = "subscription" 
}

export type BaseFeeType = {
    price: number,
    payment: PaymentType,
    storeId: string,
    type: FEES_TYPE,
    total: number,
}

export type FeeType = BaseFeeType & {
    date: string,
    id: string,
    price: number,
    latePaymentFine: boolean,
    registeredBy: string,
    status: PAYMENT_STATUS,
}