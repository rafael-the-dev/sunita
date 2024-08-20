import { PHONE_TYPE } from "@/types/contact";

import { defaultInputField } from "@/config/input";

export const defaultContact = {
    phone: [
        {
            type: { ...defaultInputField, value: PHONE_TYPE.WORK },
            number: structuredClone(defaultInputField)
        }
    ]
}