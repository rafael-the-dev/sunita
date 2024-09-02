import * as React from "react"

import { CustomerInfoType } from "@/types/guest"
import { FetchResponseType } from "@/types"
import { FetchResponseType as ResponseType } from "@/types"
import { SaleDebtInfoType } from "@/types/sale"

import { LoginContext } from "@/context/LoginContext"

import useFetch from "@/hooks/useFetch"
import useSearchParams from "@/hooks/useSearchParams"

type ContextType = {
    customers: FetchResponseType<ResponseType<CustomerInfoType[]>>,
    unpaidSales: FetchResponseType<ResponseType<SaleDebtInfoType[]>>
}

type PropsType = {
    children: React.ReactNode
}

export const SalesContext = React.createContext<ContextType>({} as ContextType)

export const SalesContextProvider = ({ children }: PropsType) => {
    const { credentials } = React.useContext(LoginContext)

    const searchParams = useSearchParams()
    const search = (searchParams.get("search", "") as string).replaceAll("-", " ")

    const customers = useFetch<ResponseType<CustomerInfoType[]>>(
        {
            autoFetch: false,
            url: `/api/stores/${credentials?.user?.stores[0]?.storeId}/clients`
        }
    )

    const unpaidSalesRespnse = useFetch<ResponseType<SaleDebtInfoType[]>>(
        {
            autoFetch: true,
            url: `/api/stores/${credentials?.user?.stores[0]?.storeId}/sales/debts`
        }
    )

    const unpaidSalesList = unpaidSalesRespnse
        ?.data
        ?.data
        ?.filter(
            unpaidSale => {
                const { firstName, lastName } = unpaidSale.customer

                const fullName = `${firstName} ${lastName}`

                return fullName
                    .toLowerCase()
                    .includes(search.toLowerCase())
            }
        )

    const fetchCustomers = customers.fetchData

    React.useEffect(
        () => {
            const controller = new AbortController()

            const timeout = setTimeout(() => fetchCustomers({ signal: controller.signal }), 30000)

            return () => {
                controller.abort()
                clearTimeout(timeout)
            }
        },
        [ fetchCustomers ]
    )

    return ( 
        <SalesContext.Provider
            value={{
                customers,
                unpaidSales: {
                    ...unpaidSalesRespnse,
                    data: {
                        ...unpaidSalesRespnse.data,
                        data: unpaidSalesList
                    }
                }
            }}>
            { children }
        </SalesContext.Provider>
    )
}