import * as React from "react"
import currency from "currency.js"

import { PRODUCTS_CATEGORIES } from "@/types/product"
import { ProductInputsType } from "../types"

import { defaultInput, getDefaultProduct } from "../values"

import { isValidCategory, isValidColor, isValidName, isValidPurchasePrice, isValidSellPrice } from "@/validation/product"
import { hasError } from "./helper"

const defaultProduct = getDefaultProduct()

const setPrice = (error: boolean, helperText: string, value: string, prop: "purchase" | "sell", product: typeof defaultProduct) => {
    product.price[prop] = {
        error,
        helperText: error ? helperText : "",
        value
    }
}

const setPurchasePrice = (value: string, product: typeof defaultProduct) => {
    const hasError = !isValidPurchasePrice(value, currency(product.price.sell.value).value)
    setPrice(hasError, "Invalid price or It is greater than sell price", value, "purchase", product)
}

const setSellPrice = (value: string, product: typeof defaultProduct) => {
    const hasError = !isValidSellPrice(value, currency(product.price.purchase.value).value)
    setPrice(hasError, "Invalid price or It less than purchase price", value, "sell", product)
}


const useProduct = (input: ProductInputsType, setInput: React.Dispatch<React.SetStateAction<ProductInputsType>>) => {
    const changeHelper = React.useCallback(
        (prop: "category" | "color" | "description" | "name", value: string, fn: (value: string) => boolean) => {
            const hasError = !fn(value)

            setInput(
                input => ({
                    ...input,
                    [prop]: {
                        error: hasError,
                        helperText: hasError ? "Invalid value" : "",
                        value
                    }
                })
            )
        },
        [ setInput ]
    )

    const changeCategory = React.useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            changeHelper("category",  e.target.value as PRODUCTS_CATEGORIES, isValidCategory)
        },
        [ changeHelper ]
    )

    const changeColor = React.useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => changeHelper("color", e.target.value, isValidColor),
        [ changeHelper ]
    )

    const changeDescription = React.useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => changeHelper("description", e.target.value, (value: string) => true),
        [ changeHelper ]
    )


    const changeName = React.useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => changeHelper("name", e.target.value, isValidName),
        [ changeHelper ]
    )

    const changePrice = React.useCallback(
        (prop: "purchase" | "sell") => (e: React.ChangeEvent<HTMLInputElement>) => {
            const { value } = e.target

            setInput(
                input => {
                    const inputClone = { ...input }

                    if(prop === "purchase") {
                        setPurchasePrice(value, inputClone)
                        setSellPrice(inputClone.price.sell.value, inputClone)
                    } else {
                        setSellPrice(value, inputClone)
                        setPurchasePrice(inputClone.price.purchase.value, inputClone)
                    }   
                    
                    return inputClone
                }
            )
        },
        [ setInput ]
    )

    const hasErrors = () => {
        return [
            hasError(input.category),
            hasError(input.name),
            hasError(input.price.purchase),
            hasError(input.price.sell)
        ].find(error => error)
    }

    return {
        changeCategory,
        changeColor,
        changeDescription,
        changeName,
        changePrice,
        hasErrors
    }
}

export default useProduct