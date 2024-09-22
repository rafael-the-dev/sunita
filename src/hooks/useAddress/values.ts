
import {COUNTRIES} from "@/types/address"

import { defaultInputField } from "@/config/input"

export const initialAddress = { 
    country: { ...defaultInputField, value: COUNTRIES.MOZAMBIQUE },
    province: structuredClone(defaultInputField),
    city: structuredClone(defaultInputField), 
    cords: {
        lat: null,
        long: null
    },
    state: structuredClone(defaultInputField),
    street: structuredClone(defaultInputField),
    number: structuredClone(defaultInputField),
}