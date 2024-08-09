import { ChangeEvent, createContext, useCallback, useState } from "react";

import { ContextType, PropsType } from "./types";

import { PRODUCTS_CATEGORIES } from "@/types/product";

export const ProductFormContext = createContext<ContextType>({} as ContextType)

const defaultInputField = {
    error: false,
    helperText: "",
    value: ""
}

const defaultInput = {
    category: { ...defaultInputField, value: PRODUCTS_CATEGORIES.EXPIRABLE }
}

export const ProductFormContextProvider = ({ children }: PropsType) => {
    const [ input, setInput ] = useState(defaultInput)

    const setInputHelper = useCallback(
        (key: string, value: typeof defaultInputField) => {
            setInput(
                input => (
                    {
                        ...input,
                        [key]: value
                    }
                )
            )
        },
        []
    )

    const changeCategory = useCallback(
        (e: ChangeEvent<HTMLInputElement>) => {
            setInputHelper("category", { ...defaultInputField, value: e.target.value as PRODUCTS_CATEGORIES })
        },
        [ setInputHelper ]
    )

    return (
        <ProductFormContext.Provider
            value={{
                input,

                changeCategory
            }}>
            { children }
        </ProductFormContext.Provider>
    )
}