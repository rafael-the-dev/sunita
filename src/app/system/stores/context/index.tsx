import * as React from "react"

import { FetchResponseType } from "@/types"
import { FeesResponseType } from "@/types/fees"
import { PropsType, StoresContextType } from "./types"
import { Store } from "@/types/warehouse"

import useFetch from "@/hooks/useFetch"

export const StoresContext = React.createContext<StoresContextType>({} as StoresContextType)

export const StoresContextProvider = ({ children }: PropsType) => {

    const stores = useFetch<FetchResponseType<Store[]>>(
        {
            url: `/api/stores`
        }
    )

    const fees = useFetch<FetchResponseType<FeesResponseType>>(
        {
            autoFetch: false,
            url: `/api/stores/fees`
        }
    )

    const fetchFees = fees.fetchData

    React.useEffect(
        () => {
            const controller = new AbortController()

            const timeout = setTimeout(
                () => fetchFees({ signal: controller.signal }), 
                30000
            )

            return () => {
                controller.abort()
                clearTimeout(timeout)
            }
        },
        [ fetchFees ]
    )

    return (
        <StoresContext.Provider
            value={{
                fees,
                stores
            }}>
            { children }
        </StoresContext.Provider>
    )
}

