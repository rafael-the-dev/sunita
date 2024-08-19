import moment from "moment"

import { DOCUMENT_TYPE } from "@/types/user"

import { defaultInputField } from "@/config/input"

export const initial = {
    expireDate: structuredClone({ ...defaultInputField, value: moment(new Date(Date.now())).toISOString() }),
    issueDate: structuredClone({ ...defaultInputField, value: moment(new Date(Date.now())).toISOString() }),
    type: structuredClone({ ...defaultInputField, value: DOCUMENT_TYPE.DRIVING_LICENCE }), 
    number: structuredClone(defaultInputField) 
}