import { MutableRefObject, ReactNode } from "react"

import { AnalyticStockReportInfoType } from "@/types/stock"
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
        
    },
    stockReports: {
        data: AnalyticStockReportInfoType,
        fetchData: FetchDataFuncType,
        loading: boolean,
    },
}

export type PropsType = {
    children: ReactNode

}