import { ChangeEvent, useCallback, useMemo, useState } from "react"
import moment from "moment"

import { USER_CATEGORY, User } from "@/types/user"

import useAddress from "@/hooks/useAddress"
import useContact from "@/hooks/useContact"
import useDocument from "@/hooks/useDocument"

import { 
    isValidName, isValidUsername
} from "@/validation/user"

type ChangeNameKeyType = "firstName" | "lastName"
type ChangeAddressKeyType = "country" | "province" | "city" | "block"

const initialInput = {
    error: false,
    helperText: "",
    value: ""
}  

const initial = {
    firstName: structuredClone(initialInput),
    lastName: structuredClone(initialInput),
    position: structuredClone({ ...initialInput, value: USER_CATEGORY.EMPLOYEE }),
    username: structuredClone(initialInput),
}

const useForm = () => {
    const [ input, setInput ] = useState(initial);

    const address = useAddress()
    const contact = useContact()
    const document = useDocument()

    const hasAddressErrors = address.hasErrors()
    const hasContactErrors = contact.hasErrors
    const hasDocumentErrors = document.hasErrors()
    
    const hasErrors = useCallback(
        () => {
            return [
                Boolean(
                    Object
                        .values(input)
                        .find(inputProps => inputProps.error || !Boolean(inputProps.value.trim()))
                    ),
                hasAddressErrors,
                hasContactErrors,
                hasDocumentErrors
            ]
            .find(error => error)
        }, 
        [ hasAddressErrors, hasContactErrors, hasDocumentErrors, input ]
    )

    const changeName = useCallback((key: ChangeNameKeyType) => (e: ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;

        const hasError = !isValidName(value);

        setInput(input => ({
            ...input,
            [key]: {
                error: hasError,
                helperText: "",
                value
            }
        }));
    }, [])

    const changePostition = useCallback((position: USER_CATEGORY) => {
        setInput(input => ({
            ...input,
            position: {
                error: false,
                helperText: "",
                value: position
            }
        }))
    }, [])

    const changeUsername = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target

        setInput(input => ({
            ...input,
            username: {
                error: !isValidUsername(value),
                helperText: "",
                value
            }
        }))
    }, [])

    const resetForm = useCallback(() => setInput(structuredClone(initial)), [])

    const toString = () => {
        const user: User = {
            address: address.toLiteralObject(),
            category: input.position.value,
            contact: contact.toLiteralObject(),
            document: document.toLiteralObject(),
            firstName: input.firstName.value,
            id: null,
            lastName: input.lastName.value,
            password: "",
            stores: null,
            username: input.username.value
        }

        return JSON.stringify(user)
    }

    return {
        address,
        contact,
        document,
        getAddress: address.getAddress,
        getContact: contact.getContact,
        hasErrors,
        input,

        changeName, changePostition, changeUsername,
        resetForm,
        toString
    }

}

export default useForm