import { ChangeEvent } from "react"

import { PHONE_TYPE } from "@/types/contact"

import { defaultContact } from "./values"

export type ContactInputType = typeof defaultContact

export type ContactMethodsType = {
    hasErrors: boolean,

    addPhoneNumber: () => void,
    changePhone: (id: PHONE_TYPE, prop: "number" | "type") => (e: ChangeEvent<HTMLInputElement>) => void,
    getAvailableTypes: () => { label: PHONE_TYPE, value: PHONE_TYPE}[]
    removePhoneNumber: (id: PHONE_TYPE) => () => void,
    resetContact: () => void
}