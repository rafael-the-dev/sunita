import { ChangeEvent, useCallback, useContext, useState } from "react"

import { CustomerInfoType, CustomerType } from "@/types/guest"

import { FixedTabsContext as StaticContext } from "@/context/FixedTabsContext"

import { defaultInputField, getInputFieldObject } from "@/config/input"
import { isValidName } from "@/validation/user"

import useAddress from "@/hooks/useContact"
import useContact from "@/hooks/useContact"
import useDocument from "@/hooks/useDocument"

const defaultCLient = {
    firstName: structuredClone(defaultInputField),
    lastName: structuredClone(defaultInputField),
}

const useInput = () => {
    const { getDialog } = useContext(StaticContext)

    const customer = getDialog()?.current?.payload as CustomerInfoType

    const hasPayload = Boolean(customer)

    const [ input, setInput ] = useState(
        () => {
            if(!hasPayload) return structuredClone(defaultCLient);

            return {
                firstName: getInputFieldObject(customer.firstName),
                lastName: getInputFieldObject(customer.lastName)
            }
        }
    )

    const contact = useContact(customer?.contact)
    const document = useDocument(customer?.document)

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

        customerPayload: customer,

        changeName,
        hasErrors,
        hasPayload,
        reset,
        toString
    }
}

export default useInput