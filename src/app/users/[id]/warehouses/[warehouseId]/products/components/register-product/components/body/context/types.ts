import { ChangeEvent, ReactNode } from "react"

import { PRODUCTS_CATEGORIES } from "@/types/product"

type InputField = {
    error: boolean,
    helperText: string,
    value: string
}

export type ContextType = {
    changeCategory: (e: ChangeEvent<HTMLInputElement>) => void,
    input: {
        category: InputField & { value: PRODUCTS_CATEGORIES }
    }
}

export type PropsType = {
    children: ReactNode
}