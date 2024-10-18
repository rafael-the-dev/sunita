import * as React from "react"

import { FetchResponseType } from "@/types"
import { PropsType, SettingsContextType } from "./types"
import { Store as StoreType } from "@/types/warehouse"
import { USER_CATEGORY, User as UserType } from "@/types/user"

import { LoginContext } from "@/context/LoginContext"

import useFetch from "@/hooks/useFetch"

export const SettingsContext = React.createContext<SettingsContextType>({} as SettingsContextType)

export const SettingsContextProvider = ({ children }: PropsType) => {
    const { credentials } = React.useContext(LoginContext)
    
    const isEmployee = credentials?.user?.category === USER_CATEGORY.EMPLOYEE

    const store = useFetch<FetchResponseType<StoreType>>(
        {
            autoFetch: !isEmployee,
            url: `/api/stores/${credentials?.user?.stores[0].storeId}`
        }
    )

    const profile = useFetch<UserType>(
        {
            autoFetch: true,
            url: `/api/users/${credentials?.user?.username}`
        }
    )

    return (
        <SettingsContext.Provider
            value={{
                profile,
                store
            }}>
            { children }
        </SettingsContext.Provider>
    )
}