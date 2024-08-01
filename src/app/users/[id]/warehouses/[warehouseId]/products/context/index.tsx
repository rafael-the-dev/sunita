import { createContext, useContext, useEffect } from "react"

import { ContextType, PropsType } from "./types"
import { SuppliersResponseType } from "@/types/Supplier"

import { LoginContext } from "@/context/LoginContext"
import useFetch from "@/hooks/useFetch"

export const ProductsPageContext = createContext<ContextType>({} as ContextType)

export const ProductsPageContextProvider = ({ children }: PropsType) => {
    const { credentials } = useContext(LoginContext)

    const suppliers = useFetch<SuppliersResponseType>(
        {
            autoFetch: false,
            url: `/api/stores/${credentials?.user?.stores[0]?.storeId}/products/suppliers`
        }
    )

    const fetchSuppliers = suppliers.fetchData

    console.log(suppliers.data)

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
                suppliers
            }}>
            { children }
        </ProductsPageContext.Provider>
    )
}