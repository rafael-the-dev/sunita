import { ChangeEvent, useCallback, useState } from "react"

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
    const [ input, setInput ] = useState(defaultInput)

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


    return {
        changeAddressHandler,
        changeAddressNumberHandler,
        changeNameHandler,
        changeNUITHandler,
        getInput
    }

}

export default useForm