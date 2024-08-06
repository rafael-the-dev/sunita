import { createContext, useCallback, useContext, useEffect, useRef } from "react"

import { ContextType, PropsType } from "./types"
import { SuppliersResponseType } from "@/types/Supplier"
import { AnalyticStockReportInfoType } from "@/types/stock";

import { LoginContext } from "@/context/LoginContext"
import useFechProducts from "@/hooks/useFetchProducts";
import useFetch from "@/hooks/useFetch"

export const ProductsPageContext = createContext<ContextType>({} as ContextType)

export const ProductsPageContextProvider = ({ children }: PropsType) => {
    const { credentials } = useContext(LoginContext)

    const products = useFechProducts()

    const suppliers = useFetch<SuppliersResponseType>(
        {
            autoFetch: false,
            url: `/api/stores/${credentials?.user?.stores[0]?.storeId}/products/suppliers`
        }
    )

    const stockReports = useFetch<AnalyticStockReportInfoType>({
        autoFetch: false,
        url: `/api/stores/${credentials?.user?.stores[0]?.storeId}/products/stock-reports`
    })

    const fetchSuppliers = suppliers.fetchData

    useEffect(
        () => {
            const timeOut = setTimeout(
                () => fetchSuppliers({}),
                9000
            )

            return () => clearTimeout(timeOut)
        },
        [ fetchSuppliers ]
    )

    return (
        <ProductsPageContext.Provider
            value={{
                products,
                suppliers,
                stockReports
            }}>
            { children }
        </ProductsPageContext.Provider>
    )
}