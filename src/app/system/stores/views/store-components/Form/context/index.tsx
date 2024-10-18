import * as React from "react"

import { EnrollStoreType, Store as StoreDetailsType } from "@/types/warehouse"
import { FormContextType, PropsType } from "./types"
import { STATUS } from "@/types";

import { FixedTabsContext as StaticTabsContext } from "@/context/FixedTabsContext";

import useAddress from "@/hooks/useAddress"
import useContact from "@/hooks/useContact"
import usePayment from "./hooks/usePayment"
import useUser from "./hooks/useUser"

import { isValidName } from "@/validation/product"

import { defaultInputField, getInputFieldObject } from "@/config/input"

export const FormContext = React.createContext<FormContextType>({} as FormContextType)

const initialBaseDetails = {
    name: defaultInputField,
    status: STATUS.ACTIVE
}

export const FormContextProvider = ({ baseTest, children, initialAddress, initialContact, initialId, initialName, initialStatus }: PropsType) => {
    const { getDialog } = React.useContext(StaticTabsContext);

    const storeDetails = getDialog().current?.payload as StoreDetailsType;
    const hasPayload = Boolean(storeDetails);
   
    const [ baseDetails, setBaseDetails ] = React.useState(
        () => {
            if(!hasPayload) return { 
                name: getInputFieldObject(initialName ?? ""),
                status: initialStatus ?? STATUS.ACTIVE
            };
           
            return {
                name: getInputFieldObject(storeDetails.name),
                status: storeDetails.status
            }
        }
    )

    const address = useAddress({ hasCords: true, initialAddress: initialAddress ?? storeDetails?.address })
    const contact = useContact(initialContact ?? storeDetails?.contact)
    const payment = usePayment(8500)
    const user = useUser()

    const hasErrors = () => {
        return [
            address.hasErrors(),
            baseDetails.name.error || !baseDetails.name.value.trim(),
            contact.hasErrors,
            hasPayload || baseTest ? false : payment.hasErrors,
            hasPayload || baseTest ? false : user.hasErrors()
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

    const statusChangeHandler = React.useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => setBaseDetails(details => ({ ...details, status: e.target.value as STATUS})),
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
            id: initialId ?? storeDetails?.id,
            name: baseDetails.name.value,
            payment: hasPayload || baseTest ? null : payment.getPayment(),
            status: baseDetails.status,
            users: hasPayload || baseTest ? null : [ user.toLiteralObject() ]
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
                reset, statusChangeHandler,
                toLiteralObject
            }}>
            { children }
        </FormContext.Provider>
    )
}