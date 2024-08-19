
import { createContext, ReactNode, useContext } from "react"

import { CustomersResponseType } from "@/types/guest"
import { FetchDataFuncType } from "@/hooks/useFetch/types"

import { LoginContext } from "@/context/LoginContext"

import useFetch from "@/hooks/useFetch"

type ContextType = {
    customers: {
        data: CustomersResponseType,
        fetchData: FetchDataFuncType
    }
}

export const UsersPageContext = createContext<ContextType>({} as ContextType)

export const  UsersPageContextProvider = ({ children }: { children: ReactNode }) => {
    const { credentials } = useContext(LoginContext)

    const { data, fetchData } = useFetch<CustomersResponseType>(
        {
            url: `/api/stores/${credentials?.user?.stores[0]?.storeId}/clients`
        }
    )

    return (
        <UsersPageContext.Provider
            value={{
                customers: {
                    data,
                    fetchData
                }
            }}>
            { children }
        </UsersPageContext.Provider>
    )
}