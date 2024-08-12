import { ChangeEvent, Dispatch, SetStateAction, useCallback, useState } from "react"

import { ProductInputsType } from "../types"

import { 
    isValidEngineNumber, isValidEngineType,
    isValidMake, isValidModel,
    isValidTransmission,
    isValidYear
} from "@/validation/product/car"

const useCar = (setInput: Dispatch<SetStateAction<ProductInputsType>>) => {
    const changeEngine = useCallback(
        (prop: "number" | "type", value: string, fn: (value: string) => boolean) => {

            const hasError = !fn(value)

            setInput(
                input => ({
                    ...input,
                   car: {
                        ...input.car,
                        engine: {
                            ...input.car.engine,
                            [prop]: {
                                error: hasError,
                                helperText: hasError ? "Invalid value" : "",
                                value
                            }
                        }}
                   }
                )
            )

        },
        [ setInput ]
    )

    const changeHandler = useCallback(
        (prop: "make" | "model" | "transmission" | "year", value: string, fn: (value: string) => boolean) => {
            const hasError = !fn(value)

            setInput(
                input => ({
                    ...input,
                        car: {
                            ...input.car,
                            [prop]: {
                                error: hasError,
                                helperText: hasError ? "Invalid value" : "",
                                value
                            }
                        }
                    }
                )
            )
        },
        [ setInput ]
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
        changeEngineNumber,
        changeEngineType,
        changeMake, 
        changeModel,
        changeTransmission,
        changeYear
    }
}

export default useCar