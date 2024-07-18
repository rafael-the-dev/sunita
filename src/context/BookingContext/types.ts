import { ChangeEvent, ReactNode } from "react"

import { BOOKING_TYPE, RoomType } from "@/types/room"
import { DOCUMENT_TYPE } from "@/types/user"
import { PaymentFunctionsType } from "@/hooks/usePayment/types"
import { PaymentType } from "@/types/payment-method"

export type PropsType = {
    children: ReactNode
}

type InputType = {
    error: boolean,
    helperText: string,
    value: string
}

type ChangeNameKeyType = "first" | "last"

export type ContextType = PaymentFunctionsType & {
    booking: {
        checkIn: InputType,
        checkOut: InputType,
        room: RoomType,
        store: string;
        type: InputType & { value: BOOKING_TYPE }, 
        totalPrice: number 
    },
    guest: {
        firstName: InputType,
        lastName: InputType,
        document: {
            expireDate: InputType, 
            issueDate: InputType 
            type: InputType & { value: DOCUMENT_TYPE }, 
            number: InputType 
        }
    },
    changeName: (key: ChangeNameKeyType) => (e: ChangeEvent<HTMLInputElement>) => void;

    //document
    changeDocumentExpireDate: (newDate: string) => void;
    changeDocumentIssueDate: (newDate: string) => void;
    changeDocumentNumber: (e: ChangeEvent<HTMLInputElement>) => void;
    changeDocumentType: (documentType: DOCUMENT_TYPE) => void;

    changeRoom: (id: string) => void,
    changeType: (bookingType: BOOKING_TYPE) => void,
    changeTime: (prop: "checkIn" | "checkOut") => (newTime: string) => void,

    getPayment: () => PaymentType;

    toString: () => string
}