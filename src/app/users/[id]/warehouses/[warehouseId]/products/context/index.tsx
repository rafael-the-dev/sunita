import { createContext, useContext } from "react"

import { AnalyticStockReportInfoType } from "@/types/stock";
import { ContextType, PropsType } from "./types"
import { CategoryType } from "@/types/category";
import { SuppliersResponseType } from "@/types/Supplier"
import { UserType } from "@/types/user";

import { LoginContext } from "@/context/LoginContext"
import useFechProducts from "@/hooks/useFetchProducts";
import useFetch from "@/hooks/useFetch"

export const ProductsPageContext = createContext<ContextType>({} as ContextType)

export const ProductsPageContextProvider = ({ children }: PropsType) => {
    const { credentials } = useContext(LoginContext)

    const products = useFechProducts()

    const categories = useFetch<CategoryType[]>({
        autoFetch: true,
        url: `/api/stores/${credentials?.user?.stores[0]?.storeId}/products/categories`
    })

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

    const users = useFetch<UserType[]>({
        autoFetch: true,
        url: `/api/stores/${credentials?.user?.stores[0]?.storeId}/users`
    })

    return (
        <ProductsPageContext.Provider
            value={{
                categories,
                products: {
                    ...products,
                    fetchData: products.fetchProducts
                },
                suppliers,
                stockReports,
                users
            }}>
            { children }
        </ProductsPageContext.Provider>
    )
}