import { ChangeEvent ,ReactNode } from "react"

import { DOCUMENT_TYPE, USER_CATEGORY } from "@/types/user";

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

export type ContextType = {
    hasErrors: () => boolean;
    input: {
        address: {
            block: InputType,
            country: InputType, 
            province: InputType 
            city: InputType, 
            house: InputType 
        },
        document: {
            expireDate: InputType, 
            issueDate: InputType 
            type: InputType & { value: DOCUMENT_TYPE }, 
            number: InputType 
        },
        firstName: InputType,
        lastName: InputType,
        position: InputType & { value: USER_CATEGORY },
        username: InputType,
    },
    //address
    changeAddress: (key: ChangeAddressKeyType) => (e: ChangeEvent<HTMLInputElement>) => void;
    changeHouseNumber: (e: ChangeEvent<HTMLInputElement>) => void;

    //document
    changeDocumentExpireDate: (newDate: string) => void;
    changeDocumentIssueDate: (newDate: string) => void;
    changeDocumentNumber: (e: ChangeEvent<HTMLInputElement>) => void;
    changeDocumentType: (documentType: DOCUMENT_TYPE) => void;

    changeName: (key: ChangeNameKeyType) => (e: ChangeEvent<HTMLInputElement>) => void;
    changePostition: (position: USER_CATEGORY) => void;
    changeUsername: (e: ChangeEvent<HTMLInputElement>) => void;
    resetForm: () => void,
    toString: () => string
}