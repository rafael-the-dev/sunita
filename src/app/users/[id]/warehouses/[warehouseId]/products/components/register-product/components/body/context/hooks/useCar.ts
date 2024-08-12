import { ChangeEvent, useCallback, useState } from "react"

import { CAR_ENGINE_TYPE, CAR_TRANSMISSION } from "@/types/product"

import { defaultInputField } from "@/config/input"

import { 
    isValidEngineNumber, isValidEngineType,
    isValidMake, isValidModel,
    isValidTransmission,
    isValidYear
} from "@/validation/product/car"

export const defaultCarInput = {
    color: structuredClone(defaultInputField),
    engine: {
        number: structuredClone(defaultInputField),
        type: { ...defaultInputField, value: CAR_ENGINE_TYPE.DIESEL }
    },
    make: structuredClone(defaultInputField),
    model: structuredClone(defaultInputField),
    transmission: { ...defaultInputField, value: CAR_TRANSMISSION.AUTOMATIC },
    year: structuredClone(defaultInputField),
}

export const useCar = () => {
    const [ car, setCar ] = useState(defaultCarInput)

    const changeEngine = useCallback(
        (prop: "number" | "type", value: string, fn: (value: string) => boolean) => {

            const hasError = !fn(value)

            setCar(
                car => ({
                    ...car,
                    engine: {
                        ...car.engine,
                        [prop]: {
                            error: hasError,
                            helperText: hasError ? "Invalid value" : "",
                            value
                        }
                    }}
                )
            )

        },
        []
    )

    const changeHandler = useCallback(
        (prop: "make" | "model" | "transmission" | "year", value: string, fn: (value: string) => boolean) => {
            const hasError = !fn(value)

            setCar(
                car => ({
                    ...car,
                        [prop]: {
                            error: hasError,
                            helperText: hasError ? "Invalid value" : "",
                            value
                        }
                    }
                )
            )
        },
        []
    )

    const changeEngineNumber = useCallback(
        (e: ChangeEvent<HTMLInputElement>) => changeEngine("number", e.target.value, isValidEngineNumber),
        [ changeEngine ]
    )

    const changeEngineType = useCallback(
        (e: ChangeEvent<HTMLInputElement>) => changeEngine("type", e.target.value, isValidEngineType),
        [ changeEngine ]
    )

    const changeModel = useCallback(
        (e: ChangeEvent<HTMLInputElement>) => changeHandler("model", e.target.value, isValidModel),
        [ changeHandler ]
    )

    const changeMake = useCallback(
        (e: ChangeEvent<HTMLInputElement>) => changeHandler("make", e.target.value, isValidMake),
        [ changeHandler ]
    )

    const changeTransmission = useCallback(
        (e: ChangeEvent<HTMLInputElement>) => changeHandler("transmission", e.target.value, isValidTransmission),
        [ changeHandler ]
    )
    
    const changeYear = useCallback(
        (e: ChangeEvent<HTMLInputElement>) => changeHandler("year", e.target.value, isValidYear),
        [ changeHandler ]
    )

    return {
        car,
        changeEngineNumber,
        changeEngineType,
        changeMake, 
        changeModel,
        changeTransmission,
        changeYear
    }
}