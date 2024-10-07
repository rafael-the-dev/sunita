import * as React from "react"
import currency from "currency.js"

import { AddressType, COUNTRIES } from "@/types/address";
import { PropsType} from "./types"

import { initialAddress } from "./values";

import { getInputFieldObject } from "@/config/input"
import { isValidCountry, isValidCity, isValidNumber, isValidState, isValidStreet } from "@/validation/address";
import { isInvalidInput } from "@/helpers";

type KeysType = "country" | "city" | "number" | "state" | "street";

const useAddress = (props?: PropsType) => {
    const [ address, setAddress ] = React.useState(
        () => {
            const address = props?.initialAddress;

            if(!address) return initialAddress;


            return {
                country: { error: false, helperText: "", value: address?.country ?? "" as COUNTRIES },
                province: getInputFieldObject(address?.state),
                city: getInputFieldObject(address?.city), 
                cords: {
                    lat: address?.cords?.lat,
                    long: address?.cords?.long
                },
                state: getInputFieldObject(address?.state),
                street: getInputFieldObject(address?.street),
                number: getInputFieldObject(address?.number?.toString()),
            }
        }
    )

    const hasCords = Boolean(props?.hasCords)

    const hasCordsErrors = () => {
        if(!hasCords) return false

        return !(address.cords.lat && address.cords.long)
    }

    const hasErrors = () => {
        console.log(address.cords)
        return [
            isInvalidInput(address.city),
            isInvalidInput(address.country),
            //isInvalidInput(address.province),
            isInvalidInput(address.state),
            isInvalidInput(address.street),
            isInvalidInput(address.number),
            hasCordsErrors()
        ].find(error => error)
    }

    const getAddress = React.useCallback(
        () => address,
        [ address ]
    )

    const changeHandlerHelper = React.useCallback(
        (e: React.ChangeEvent<HTMLInputElement>, key: KeysType, errorMessage: string, validator: (value: string) => boolean) => {
            const { value } = e.target

            const hasError = !validator(value)

            setAddress(address => ({
                ...address,
                [key]: {
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
        (e: React.ChangeEvent<HTMLInputElement>) => changeHandlerHelper(e, "state", "Invalid state", isValidState),
        [ changeHandlerHelper ]
    )

    const streetChangeHandler = React.useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => changeHandlerHelper(e, "street", "Invalid street address", isValidStreet),
        [ changeHandlerHelper ]
    )

    const setCords = React.useCallback(
        (lat: number, long: number) => {
            setAddress(address => ({ ...address, cords: { lat, long }}))
        },
        []
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
        toLiteralObject,
        setCords
    }

}

export default useAddress