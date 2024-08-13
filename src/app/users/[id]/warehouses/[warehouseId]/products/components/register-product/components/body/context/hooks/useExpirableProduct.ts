import * as React from "react"

import { ProductInputsType } from "../types"
import { PRODUCTS_CATEGORIES } from "@/types/product"

import { defaultExpirableProduct } from "../values"

import { 
    isValidBestBefore,
    isValidManufactureDate 
} from "@/validation/product"
import { hasError } from "./helper"
 



const setBestBefore = (value: string, product: typeof defaultExpirableProduct) => {
    const hasError = !isValidBestBefore(value, product.manufactureDate.value);

    product.expirationDate.error = hasError;
    product.expirationDate.helperText = hasError ? "Date must not be equal to current date or before manufacture date" : "";
    product.expirationDate.value = value;
}

const setManufactureDate = (value: string, product: typeof defaultExpirableProduct) => {
    const hasError = !isValidManufactureDate(value, product.expirationDate.value);

    product.manufactureDate.error = hasError;
    product.manufactureDate.helperText = hasError ? "Date must not be after best before" : "";
    product.manufactureDate.value = value;
}


const useExpirableProduct = (input: ProductInputsType, setInput: React.Dispatch<React.SetStateAction<ProductInputsType>>) => {

    const changeDate = React.useCallback(
        (prop: "expiration" | "manufacture", value: string, fn: (value: string, date: string) => boolean) => {
            setInput(
                input => {

                    const inputClone = { ...input }
                    const productClone = inputClone.expirable;

                    if(prop === "expiration") {
                        setBestBefore(value, productClone)
                        setManufactureDate(productClone.manufactureDate.value, productClone)
                    } else {
                        setManufactureDate(value, productClone)
                        setBestBefore(productClone.expirationDate.value, productClone)
                    }

                    return inputClone;

                }
            )
        },
        [ setInput ]
    )

    const changeBarcode = React.useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const { value } = e.target
            const hasError = !value.trim()

            setInput(
                input => ({
                    ...input,
                        expirable: {
                            ...input.expirable,
                            barcode: {
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

    const changeExpirationDate = React.useCallback(
        (value: string) => changeDate("expiration", value, isValidBestBefore),
        [ changeDate ]
    )

    const changeManufactureDate = React.useCallback(
        (value: string) => changeDate("manufacture", value, isValidManufactureDate),
        [ changeDate ]
    )

    const isNotExpirableCategory = input.category.value !== PRODUCTS_CATEGORIES.EXPIRABLE;

    const hasErrors = () => {
        if(isNotExpirableCategory) return false;

        const expirationDate = input.expirable.expirationDate.value;
        const manufactureDate = input.expirable.manufactureDate.value;

        return [
                hasError(input.expirable.barcode),
                !isValidManufactureDate(manufactureDate, expirationDate),
                !isValidBestBefore(expirationDate, manufactureDate)
            ].find(hasError => hasError);
    }

    const toString = () => {
        return isNotExpirableCategory ? null : {
            barcode: input.expirable.barcode.value,
            expirationDate: input.expirable.expirationDate.value,
            manufactureDate: input.expirable.manufactureDate.value
        }
    }

    return {
        changeBarcode,
        changeExpirationDate,
        changeManufactureDate,
        hasErrors,
        toString
    }
}

export default useExpirableProduct