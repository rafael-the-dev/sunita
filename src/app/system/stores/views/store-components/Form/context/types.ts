import { ReactNode } from "react"

import { AddressEventHandlers, AddressInputType } from "@/hooks/useAddress/types"
import { ContactInputType, ContactMethodsType } from "@/hooks/useContact/types"
import { DocumentInputFunctions } from "@/hooks/useDocument/types"
import { EnrollStoreType } from "@/types/warehouse"
import { PaymentType } from "@/types/payment-method"
import { PaymentFunctionsType } from "@/hooks/usePayment/types"
import { UserInputHandlers } from "@/hooks/useUser/types"

import { defaultInputField } from "@/config/input"

type InputType = typeof defaultInputField

type AddressType = AddressEventHandlers & {
    getAddress: () => AddressInputType
}

type ContactType = ContactMethodsType & {
    getContact: () => ContactInputType
}

export type FormContextType = {
    address: AddressType,
    contact: ContactType,
    name: InputType,
    payment: PaymentFunctionsType & {
        getPayment: () => PaymentType
    },
    user: UserInputHandlers & {
        address: AddressType
        contact: ContactType,
        document: DocumentInputFunctions,
        firstName: InputType,
        lastName: InputType
    },

    
    hasErrors: () => boolean,
    nameChangeHandler: (e: React.ChangeEvent<HTMLInputElement>) => void,
    reset: () => void,
    toLiteralObject: () => EnrollStoreType,
}

export type PropsType = {
    children: ReactNode
}