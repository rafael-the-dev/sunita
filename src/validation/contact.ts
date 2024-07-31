import { PHONE_TYPE } from "@/types/contact"

export const isValidPhoneNumber = (value: string) => {
    const pattern = /^8[234567]{1}[0-9]{7}$/

    return pattern.test(value)
}

export const isValidPhoneType = (value: PHONE_TYPE) => {
    return Object
        .values(PHONE_TYPE)
        .includes(value)
}