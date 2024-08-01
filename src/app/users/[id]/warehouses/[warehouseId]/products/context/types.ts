import { ReactNode } from "react"

import { SuppliersResponseType } from "@/types/Supplier"

import { FetchDataFuncType } from "@/hooks/useFetch/types"

export type ContextType = {
    suppliers: {
        data: SuppliersResponseType,
        fetchData: FetchDataFuncType,
        //:::
    }
}

export type PropsType = {
    children: ReactNode

}