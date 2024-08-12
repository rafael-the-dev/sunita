import * as React from "react"

import { defaultInputField } from "@/config/input"

import { 
    isValidBestBefore,
    isValidManufactureDate 
} from "@/validation/product"

export const defaultExpirableProduct = {
    barcode: structuredClone(defaultInputField),
    expirationDate: structuredClone(defaultInputField),
    manufactureDate: structuredClone(defaultInputField)
}   

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


export const useExpirableProduct = () => {
    const [ expirableProduct, setExpirableProduct ] = React.useState(defaultExpirableProduct)

    /*const changeHelper = React.useCallback(
        (prop: "barcode" | "expirationDate" | "manufactureDate", value: string, fn: (value: string) => boolean) => {
            const hasError = !fn(value)

            setExpirableProduct(
                product => ({
                    ...product,
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
    )*/

    const changeDate = React.useCallback(
        (prop: "expiration" | "manufacture", value: string, fn: (value: string, date: string) => boolean) => {
            setExpirableProduct(
                product => {

                    const productClone = { ...product };

                    if(prop === "expiration") {
                        setBestBefore(value, productClone)
                        setManufactureDate(productClone.manufactureDate.value, productClone)
                    } else {
                        setManufactureDate(value, productClone)
                        setBestBefore(productClone.expirationDate.value, productClone)
                    }

                    return productClone;

                }
            )
        },
        []
    )

    const changeBarcode = React.useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const { value } = e.target
            const hasError = !value.trim()

            setExpirableProduct(
                product => ({
                    ...product,
                        barcode: {
                            error: hasError,
                            helperText: hasError ? "Invalid value" : "",
                            value
                        }
                    }
                )
            )
        },
        [ ]
    )

    const changeExpirationDate = React.useCallback(
        (value: string) => changeDate("expiration", value, isValidBestBefore),
        [ changeDate ]
    )

    const changeManufactureDate = React.useCallback(
        (value: string) => changeDate("manufacture", value, isValidManufactureDate),
        [ changeDate ]
    )

    return {
        expirableProduct,

        changeBarcode,
        changeExpirationDate,
        changeManufactureDate
    }
}