import * as React from "react"
import currency from "currency.js"

import { AddressType } from "@/types/address";

import { defaultInputField } from "@/config/input";
import { initialAddress } from "./values";

import { isValidCountry, isValidCity, isValidNumber, isValidState, isValidStreet } from "@/validation/address";

type KeysType = "country" | "city" | "number" | "state" | "street";

const hasError = (input: typeof defaultInputField) => input.error || !(input.value.trim() )

const useAddress = () => {
    const [ address, setAddress ] = React.useState(initialAddress)

    const hasErrors = () => {
        return [
            hasError(address.city),
            hasError(address.country),
            hasError(address.province),
            hasError(address.state),
            hasError(address.street),
            hasError(address.number),
        ].find(error => error)
    }

    const getAddress = React.useCallback(
        () => address,
        [ address ]
    )

    const changeHandlerHelper = React.useCallback(
        (e: React.ChangeEvent<HTMLInputElement>, key: KeysType, errorMessage: string, validator: (value: string) => boolean) => {
            const { value } = e.target

            const hasError = validator(value)

            setAddress(address => ({
                ...address,
                country: {
                    error: hasError as boolean,
                    helperText: hasError ? errorMessage : "",
                    value
                }
            }))
        },
        []
    )


    const countryChangeHandler = React.useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => changeHandlerHelper(e, "country", "Invalid country name", isValidCountry),
        [ changeHandlerHelper ]
    )

    const cityChangeHandler = React.useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => changeHandlerHelper(e, "city", "Invalid city name", isValidCity),
        [ changeHandlerHelper ]
    )

    const numberChangeHandler = React.useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => changeHandlerHelper(e, "number", "Invalid number", isValidNumber),
        [ changeHandlerHelper ]
    )

    const statetChangeHandler = React.useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => changeHandlerHelper(e, "state", "Invalid state", isValidStreet),
        [ changeHandlerHelper ]
    )

    const streetChangeHandler = React.useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => changeHandlerHelper(e, "street", "Invalid street address", isValidStreet),
        [ changeHandlerHelper ]
    )

    const toLiteralObject = () => {
        const newAddress: AddressType = {
            country: address.country.value,
            cords: address.cords,
            city: address.city.value,
            number: currency(address.number.value).value,
            state: address.state.value,
            street: address.street.value
        }

        return newAddress
    }

    return {
        countryChangeHandler,
        cityChangeHandler,
        getAddress,
        hasErrors,
        numberChangeHandler,
        statetChangeHandler,
        streetChangeHandler,
        toLiteralObject
    }

}

export default useAddress