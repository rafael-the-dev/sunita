
import { AddressType } from "./address"
import { ContactType } from "./contact"
import { PaymentType, PAYMENT_STATUS } from "./payment-method"
import { STATUS } from "."

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
    createdAt: string,
    id: string,
    price: number,
    latePaymentFine: boolean,
    registeredBy: string,
    status: PAYMENT_STATUS,
}

export type FeeDetailsType = FeeType & {
    store: {
        address: AddressType,
        contact: ContactType;
        id: string;
        name: string,
        status: STATUS
    }
}

export type FeesResponseType = {
    list: FeeDetailsType[],
    total: number
}