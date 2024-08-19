import { ChangeEvent, useCallback, useState } from "react"

import useAddress from "@/hooks/useContact"
import useContact from "@/hooks/useContact"
import useDocument from "@/hooks/useDocument"
import { defaultInputField } from "@/config/input"
import { isValidName } from "@/validation/user"
import { CustomerType } from "@/types/guest"

const defaultCLient = {
    firstName: structuredClone(defaultInputField),
    lastName: structuredClone(defaultInputField),
}

const useInput = () => {
    const [ input, setInput ] = useState(structuredClone(defaultCLient))

    const contact = useContact(null)
    const document = useDocument()

    const resetContact = contact.resetContact
    const resetDocument = document.resetDocument

    const changeName = useCallback(
        (key: "firstName" | "lastName") => (e: ChangeEvent<HTMLInputElement>) => {
            const { value } = e.target
            const hasError = !isValidName(value)

            setInput(input => ({
                ...input,
                [key]: {
                    error: hasError,
                    helperText: hasError ? "Invalid name" : "",
                    value
                }
            }))
        },
        []
    )

    const isValid = useCallback(
        (obj: typeof defaultInputField) => obj.error || !obj.value.trim(),
        []
    )

    const hasErrors = () => {
        return [
            contact.hasErrors,
            document.hasErrors(),
            isValid(input.firstName),
            isValid(input.lastName)
        ].find(error => error)
    }

    const reset = useCallback(
        () => {
            setInput(structuredClone(defaultCLient))
            resetContact()
            resetDocument()
        },
        [ resetContact, resetDocument ]
    )

    const toString = () => {
        const customer: CustomerType = {
            contact: {
                phone: contact
                    .getContact()
                    .phone
                    .map(contact => ({ number: contact.number.value, type: contact.type.value }))
            },
            document: {
                expireDate: document.document.expireDate.value,
                issueDate: document.document.issueDate.value,
                number: document.document.number.value,
                type: document.document.type.value
            },
            firstName: input.firstName.value,
            id: null,
            lastName: input.lastName.value
            
        }

        return JSON.stringify(customer)
    }

    return {
        ...contact,
        ...document,
        ...input,

        changeName,
        hasErrors,
        reset,
        toString
    }
}

export default useInput