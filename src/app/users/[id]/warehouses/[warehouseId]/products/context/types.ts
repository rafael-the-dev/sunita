import { MutableRefObject, ReactNode } from "react"

import { AnalyticStockReportInfoType } from "@/types/stock"
import { ProductInfoType } from "@/types/product"
import { SuppliersResponseType } from "@/types/Supplier"

import { FetchDataFuncType } from "@/hooks/useFetch/types"
import { CategoryType } from "@/types/category"
import { UserType } from "@/types/user"

type ContextFieldType<T> = {
    data: T,
    error: Error,
    fetchData: FetchDataFuncType,
    loading: boolean,
}

export type ContextType = {
    categories: ContextFieldType<CategoryType[]>,
    products: ContextFieldType<ProductInfoType[]>,
    suppliers: ContextFieldType<SuppliersResponseType>,
    stockReports: ContextFieldType<AnalyticStockReportInfoType>
    users: ContextFieldType<UserType[]>
}

export type PropsType = {
    children: ReactNode

}