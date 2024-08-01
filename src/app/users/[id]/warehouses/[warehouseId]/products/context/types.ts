import { ReactNode } from "react"

import { ProductInfoType } from "@/types/product"
import { SuppliersResponseType } from "@/types/Supplier"

import { FetchDataFuncType } from "@/hooks/useFetch/types"

export type ContextType = {
    products: {
        data: ProductInfoType[],
        fetchProducts: FetchDataFuncType
    },
    suppliers: {
        data: SuppliersResponseType,
        fetchData: FetchDataFuncType,
        
    }
}

export type PropsType = {
    children: ReactNode

}