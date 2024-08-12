import * as React from "react"
import currency from "currency.js"

import { PRODUCTS_CATEGORIES } from "@/types/product"

import { defaultInputField } from "@/config/input"

import { isValidCategory, isValidColor, isValidName, isValidPurchasePrice, isValidSellPrice } from "@/validation/product"

export const defaultProduct = {
    category: { ...defaultInputField, value: PRODUCTS_CATEGORIES.EXPIRABLE },
    color: structuredClone(defaultInputField ),
    description: structuredClone(defaultInputField ),
    name: structuredClone(defaultInputField ),
    price: {
        purchase: structuredClone(defaultInputField),
        sell: structuredClone(defaultInputField)
    }
}

const setPurchasePrice = (value: string, product: typeof defaultProduct) => {
    const hasError = !isValidPurchasePrice(value, currency(product.price.sell.value).value)

    product.price.purchase.error = hasError
    product.price.purchase.helperText = hasError ? "Invalid price or It is greater than sell price" : "",
    product.price.purchase.value = value
}

const setSellPrice = (value: string, product: typeof defaultProduct) => {
    const hasError = !isValidSellPrice(value, currency(product.price.purchase.value).value)

    product.price.sell.error = hasError
    product.price.sell.helperText = hasError ? "Invalid price or It less than purchase price" : "",
    product.price.sell.value = value
}


export const useProduct = () => {
    const [ product, setProduct ] = React.useState(defaultProduct)

    const changeHelper = React.useCallback(
        (prop: "category" | "color" | "description" | "name", value: string, fn: (value: string) => boolean) => {
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

    const changeDescription = React.useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => changeHelper("description", e.target.value, (value: string) => Boolean(value.trim())),
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
                    const productClone = structuredClone(product)

                    if(prop === "purchase") {
                        setPurchasePrice(value, productClone)
                        setSellPrice(productClone.price.sell.value, productClone)
                    } else {
                        setSellPrice(value, productClone)
                        setPurchasePrice(productClone.price.purchase.value, productClone)
                    }   
                    
                    return productClone
                }
            )
        },
        []
    )

    return {
        product,
        changeCategory,
        changeColor,
        changeDescription,
        changeName,
        changePrice
    }
}