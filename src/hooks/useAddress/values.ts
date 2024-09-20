
import { defaultInputField } from "@/config/input"

export const initialAddress = { 
    country: structuredClone(defaultInputField),
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