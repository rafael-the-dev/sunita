import { ChangeEvent, useCallback, useContext, useState } from "react"

import { User as UserType, USER_CATEGORY } from "@/types/user"

//import { FixedTabsContext as StaticContext } from "@/context/FixedTabsContext"

import { defaultInputField, getInputFieldObject } from "@/config/input"
import { isValidName } from "@/validation/user"

import useAddress from "@/hooks/useAddress"
import useContact from "@/hooks/useContact"
import useDocument from "@/hooks/useDocument"

const defaultCLient = {
    firstName: structuredClone(defaultInputField),
    lastName: structuredClone(defaultInputField),
}

const useInput = () => {

    const hasPayload = null// Boolean(customer)

    const [ input, setInput ] = useState(
        () => {
            //if(!hasPayload) 
            return structuredClone(defaultCLient);

            /*return {
                firstName: getInputFieldObject(customer.firstName),
                lastName: getInputFieldObject(customer.lastName)
            }*/
        }
    )
    
    const address = useAddress()
    const contact = useContact()
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

    const toLiteralObject = () => {
        const user: UserType = {
            address: address.toLiteralObject(),
            category: USER_CATEGORY.ADMIN,
            contact: contact.toLiteralObject(),
            document: document.toLiteralObject(),
            firstName: input.firstName.value,
            id: null,
            lastName: input.lastName.value,
            password: null,
            username: "",
            stores: null,
        }

        return user
    }

    return {
        address,
        contact,
        document,
        ...input,

        changeName,
        hasErrors,
        hasPayload,
        reset,
        toLiteralObject
    }
}

export default useInput