import { ChangeEvent, useCallback, useContext, useState } from "react"

import { User as UserType, USER_CATEGORY } from "@/types/user"

import { defaultInputField, getInputFieldObject } from "@/config/input"
import { isValidName, isValidUsername } from "@/validation/user"

import { defaultUserInput } from "./values"

import useAddress from "@/hooks/useAddress"
import useContact from "@/hooks/useContact"
import useDocument from "@/hooks/useDocument"

type KeysType = "firstName" | "lastName" | "username"

const useUser = () => {

    const hasPayload = null// Boolean(customer)

    const [ input, setInput ] = useState(
        () => {
            //if(!hasPayload) 
            return structuredClone(defaultUserInput);

            /*return {
                firstName: getInputFieldObject(customer.firstName),
                lastName: getInputFieldObject(customer.lastName)
            }*/
        }
    )
    
    const address = useAddress();
    const contact = useContact();
    const document = useDocument();

    const resetContact = contact.resetContact;
    const resetDocument = document.resetDocument;

    const getUserInput = useCallback(
        () => input,
        [ input ]
    )

    const changeHelper = useCallback(
        (e: ChangeEvent<HTMLInputElement>, key: KeysType, validator: (value: string) => boolean) => {
            const { value } = e.target

            const hasError = !validator(value)

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


    const changeName = useCallback(
        (key: "firstName" | "lastName") => (e: ChangeEvent<HTMLInputElement>) => changeHelper(e, key, isValidName),
        [ changeHelper ]
    )

    const changeUsername = useCallback(
        (e: ChangeEvent<HTMLInputElement>) => changeHelper(e, "username", isValidUsername),
        [ changeHelper ]
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
            setInput(structuredClone(defaultUserInput))
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
            username: input.username.value,
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
        changeUsername,
        hasErrors,
        hasPayload,
        getUserInput,
        reset,
        toLiteralObject
    }
}

export default useUser