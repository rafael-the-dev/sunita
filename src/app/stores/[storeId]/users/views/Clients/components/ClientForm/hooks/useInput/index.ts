import { ChangeEvent, useCallback, useState } from "react"

import useAddress from "@/hooks/useContact"
import useContact from "@/hooks/useContact"
import useDocument from "@/hooks/useDocument"
import { defaultInputField } from "@/config/input"
import { isValidName } from "@/validation/user"

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

    const reset = useCallback(
        () => {
            setInput(structuredClone(defaultCLient))
            resetContact()
            resetDocument()
        },
        [ resetContact, resetDocument ]
    )

    return {
        ...contact,
        ...document,
        ...input,

        changeName,
        reset
    }
}

export default useInput