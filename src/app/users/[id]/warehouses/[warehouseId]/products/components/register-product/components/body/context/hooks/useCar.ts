import { ChangeEvent, Dispatch, SetStateAction, useCallback, useState } from "react"
import currency from "currency.js"

import { ProductInputsType } from "../types"
import { PRODUCTS_CATEGORIES } from "@/types/product"

import { 
    isValidEngineNumber, isValidEngineType,
    isValidMake, isValidModel,
    isValidTransmission,
    isValidYear
} from "@/validation/product/car"
import { hasError } from "./helper"

const useCar = (input: ProductInputsType, setInput: Dispatch<SetStateAction<ProductInputsType>>) => {
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

    const isNotCarCategory = input.category.value !== PRODUCTS_CATEGORIES.CARS

    const hasErrors = () => {
        if(isNotCarCategory) return false;

        return[
                hasError(input.car.color),
                hasError(input.car.engine.number),
                hasError(input.car.engine.type),
                hasError(input.car.make),
                hasError(input.car.model),
                hasError(input.car.transmission),
                hasError(input.car.year)
            ].find(hasError => hasError);
    }

    const toString = () => {
        return isNotCarCategory ? null : {
            color: input.car.color.value,
            engine: {
                horsepower: currency(input.car.engine.number.value).value,
                type: input.car.engine.type.value
            },
            make: input.car.make.value,
            model: input.car.model.value,
            transmission: input.car.transmission.value,
            year: currency(input.car.year.value).value
        }
    }

    return {
        changeEngineNumber,
        changeEngineType,
        changeMake, 
        changeModel,
        changeTransmission,
        changeYear,
        hasErrors,
        toString
    }
}

export default useCar