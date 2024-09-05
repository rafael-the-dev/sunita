import { ReactNode } from "react"

import {PropertyType} from "@/types/property"
import { FetchDataFuncType } from "@/hooks/useFetch/types"

export type ContextType = {
    fetchProperties: FetchDataFuncType,
    getProperties: () => PropertyType[],
    loading: boolean
}

export type PropsType = {
    children: ReactNode
}