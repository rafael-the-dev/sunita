import * as React from "react"

import { EnrollStoreType,  } from "@/types/warehouse"
import { FormContextType, PropsType } from "./types"

import useAddress from "@/hooks/useAddress"
import useContact from "@/hooks/useContact"
import usePayment from "./hooks/usePayment"
import useUser from "./hooks/useUser"

import { isValidName } from "@/validation/product"

import { defaultInputField } from "@/config/input"

export const FormContext = React.createContext<FormContextType>({} as FormContextType)

const initialBaseDetails = {
    name: defaultInputField,
}

export const FormContextProvider = ({ children }: PropsType) => {
    const [ baseDetails, setBaseDetails ] = React.useState(initialBaseDetails)

    const address = useAddress({ hasCords: true })
    const contact = useContact()
    const payment = usePayment(8500)
    const user = useUser()

    const hasErrors = () => {
        return [
            baseDetails.name.error || !baseDetails.name.value.trim(),
            contact.hasErrors,
            payment.hasErrors,
            user.hasErrors()
        ].find(error => error)
    }

    const nameChangeHandler = React.useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const { value } = e.target

            const hasError = !isValidName(value)

            setBaseDetails(details => ({
                ...details,
                name: {
                    error: hasError,
                    helperText: hasError ? "Invalid name" : "",
                    value
                }
            }))
        },
        []
    )

    const reset = () => {
        setBaseDetails(structuredClone(initialBaseDetails))
        contact.resetContact()
        payment.reset()
        user.reset()
    }

    const toLiteralObject = () => {
        const storeEnrollment: EnrollStoreType = {
            address: address.toLiteralObject(),
            contact: contact.toLiteralObject(),
            id: null,
            name: baseDetails.name.value,
            payment: payment.getPayment(),
            status: null,
            users: [ user.toLiteralObject() ]
        }

        return storeEnrollment
    }

    return (
        <FormContext.Provider
            value={{
                ...baseDetails,
                address,
                contact,
                payment,
                user,

                hasErrors,
                nameChangeHandler,
                reset,
                toLiteralObject
            }}>
            { children }
        </FormContext.Provider>
    )
}