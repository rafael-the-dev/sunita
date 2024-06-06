import { ReactNode } from "react"

import { FetchDataFuncType } from "@/hooks/useFetch/types"

export type FiltersContextType<T> = {
    data: T,
    fetchData: FetchDataFuncType,
    loading: boolean,
    url: string
}

export type PropsTypes = {
    children: ReactNode,
    url: string
}