import { ChangeEvent, useCallback, useState } from "react"

import { CAR_ENGINE_TYPE } from "@/types/product"

import { defaultInputField } from "@/config/input"

import { 
    isValidEngineNumber, isValidEngineType 
} from "@/validation/product/car"

export const defaultCarInput = {
    engine: {
        number: structuredClone(defaultInputField),
        type: { ...defaultInputField, value: CAR_ENGINE_TYPE.DIESEL }
    }
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
                                helperText: hasError ? "Invalid number" : "",
                                value
                            }
                        }
                    }
                )
            )

        },
        []
    )

    const changeEngineNumber = useCallback(
        (e: ChangeEvent<HTMLInputElement>) => {
            const { value } = e.target

            changeEngine("number", value, isValidEngineNumber)
        },
        [ changeEngine ]
    )

    const changeEngineType = useCallback(
        (e: ChangeEvent<HTMLInputElement>) => {
            const { value } = e.target

            changeEngine("type", value, isValidEngineType)
        },
        [ changeEngine ]
    )

    return {
        car,
        changeEngineNumber,
        changeEngineType
    }
}