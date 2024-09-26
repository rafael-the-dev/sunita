import { ChangeEvent ,ReactNode } from "react"

import { USER_CATEGORY } from "@/types/user";

import { AddressEventHandlers, AddressInputType } from "@/hooks/useAddress/types"
import { ContactMethodsType, ContactInputType } from "@/hooks/useContact/types"
import { DocumentInputFunctions } from "@/hooks/useDocument/types"

export type PropsType = {
    children: ReactNode;
}

type InputType = {
    error: boolean,
    helperText: string,
    value: string
}

type ChangeNameKeyType = "firstName" | "lastName"
type ChangeAddressKeyType = "country" | "province" | "city" | "block"

export type ContextType = AddressEventHandlers & ContactMethodsType & DocumentInputFunctions &{
    hasErrors: () => boolean;
    input: {
        firstName: InputType,
        lastName: InputType,
        position: InputType & { value: USER_CATEGORY },
        username: InputType,
    },

    changeName: (key: ChangeNameKeyType) => (e: ChangeEvent<HTMLInputElement>) => void;
    changePostition: (position: USER_CATEGORY) => void;
    changeUsername: (e: ChangeEvent<HTMLInputElement>) => void;
    getAddress: () => AddressInputType;
    getContact: () => ContactInputType;
    resetForm: () => void,
    toString: () => string
}