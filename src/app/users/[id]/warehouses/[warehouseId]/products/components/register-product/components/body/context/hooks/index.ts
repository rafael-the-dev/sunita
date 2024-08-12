import * as React from "react"
import currency from "currency.js"

import { PRODUCTS_CATEGORIES } from "@/types/product"

import { defaultInputField } from "@/config/input"

import { isValidCategory, isValidColor, isValidName, isValidPurchasePrice, isValidSellPrice } from "@/validation/product"

export const defaultProduct = {
    category: { ...defaultInputField, value: PRODUCTS_CATEGORIES.EXPIRABLE },
    color: structuredClone(defaultInputField ),
    name: structuredClone(defaultInputField ),
    price: {
        purchase: structuredClone(defaultInputField),
        sell: structuredClone(defaultInputField)
    }
}

export const useProduct = () => {
    const [ product, setProduct ] = React.useState(defaultProduct)

    const changeHelper = React.useCallback(
        (prop: "category" | "color" | "name", value: string, fn: (value: string) => boolean) => {
            const hasError = !fn(value)

            setProduct(
                product => ({
                    ...product,
                    [prop]: {
                        error: hasError,
                        helperText: hasError ? "Invalid value" : "",
                        value
                    }
                })
            )
        },
        []
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


    const changeName = React.useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => changeHelper("name", e.target.value, isValidName),
        [ changeHelper ]
    )

    const changePrice = React.useCallback(
        (prop: "purchase" | "sell") => (e: React.ChangeEvent<HTMLInputElement>) => {
            const { value } = e.target

            setProduct(
                product => {
                    let hasError = false

                    if(prop === "purchase") {
                        hasError = !isValidPurchasePrice(value, currency(product.price.sell.value).value)
                    } else {
                        hasError = !isValidSellPrice(value, currency(product.price.purchase.value).value)
                    }   
                    
                    return {
                        ...product,
                        price: {
                            ...product.price,
                            [prop]: {
                                error: hasError,
                                helperText: hasError ? "Invalid price" : "",
                                value
                            }
                        }
                    }
                }
            )
        },
        []
    )

    return {
        product,
        changeCategory,
        changeColor,
        changeName,
        changePrice
    }
}