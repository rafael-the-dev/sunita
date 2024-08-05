import { ChangeEvent, useCallback, useContext, useMemo, useState } from "react"

import { FixedTabsContext } from "@/context/FixedTabsContext"

import { SupplierType } from "@/types/Supplier"

import { isValidAddress, isValidName } from "@/validation/user"
import { isValidNUIT } from "@/validation/document"
import { isValidAddressNumber } from "@/validation/address"

type AddressProps = "country" | "city" | "province" | "street"

const initialInput = {
    error: false,
    helperText: "",
    value: ""
}

const defaultInput = {
    address: {
        country: structuredClone(initialInput),
        city: structuredClone(initialInput),
        number: structuredClone(initialInput),
        province: structuredClone(initialInput),
        street: structuredClone(initialInput)
    },
    name: structuredClone(initialInput),
    nuit: structuredClone(initialInput)
}

const useForm = () => {
    const { getDialog } = useContext(FixedTabsContext)

    const supplier = getDialog().current?.payload as SupplierType;

    const [ input, setInput ] = useState(
        () => {
            if(!supplier) return defaultInput;

            return {
                address: {
                    country: structuredClone({ ...initialInput, value: supplier.address.country }),
                    city: structuredClone({ ...initialInput, value: supplier.address.city }),
                    number: structuredClone({ ...initialInput, value: supplier.address.number.toString() }),
                    province: structuredClone({ ...initialInput, value: supplier.address.province }),
                    street: structuredClone({ ...initialInput, value: supplier.address.street })
                },
                name: structuredClone({ ...initialInput, value: supplier.name }),
                nuit: structuredClone({ ...initialInput, value: supplier.nuit.toString() })
            }
        }
    )

    const hasErrors = useMemo(
        () => {
            const invalidField = [
                ...Object.values(input.address),
                input.name,
                input.nuit
            ]
            .find(item => item.error || !item.value.trim())

            return Boolean(invalidField)
        },
        [ input ]
    )

    const getInput = useCallback(
        () => structuredClone(input),
        [ input ]
    )

    const changeNUITHandler = useCallback(
        (e: ChangeEvent<HTMLInputElement>) => {
            const { value } = e.target

            const hasError = !isValidNUIT(value)

            setInput(
                input => ({
                    ...input,
                    nuit: {
                        error: hasError,
                        helperText: "",
                        value
                    }
                })
            )
        },
        []
    )

    const changeNameHandler = useCallback(
        (e: ChangeEvent<HTMLInputElement>) => {
            const { value } = e.target

            const hasError = !isValidName(value)

            setInput(
                input => ({
                    ...input,
                    "name": {
                        error: hasError,
                        helperText: "",
                        value
                    }
                })
            )
        },
        []
    )

    const changeAddressHandler = useCallback(
        (prop: AddressProps) => (e: ChangeEvent<HTMLInputElement>) => {
            const { value } = e.target

            const hasError = !isValidAddress(value)

            setInput(
                input => ({
                    ...input,
                    address: {
                        ...input.address,
                        [prop]: {
                            error: hasError,
                            helperText: "",
                            value
                        }
                    }
                })
            )
        },
        []
    )

    const changeAddressNumberHandler = useCallback(
        (e: ChangeEvent<HTMLInputElement>) => {
            const { value } = e.target

            const hasError = !isValidAddressNumber(value)

            setInput(
                input => ({
                    ...input,
                    address: {
                        ...input.address,
                        number: {
                            error: hasError,
                            helperText: "",
                            value
                        }
                    }
                })
            )
        },
        []
    )

    const resetForm = useCallback(
        () => setInput(defaultInput),
        [ ]
    )


    return {
        hasErrors,

        changeAddressHandler,
        changeAddressNumberHandler,
        changeNameHandler,
        changeNUITHandler,
        getInput,
        resetForm
    }

}

export default useForm