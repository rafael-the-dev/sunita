import * as React from "react"

import { FetchResponseType } from "@/types"
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

    return (
        <StoresContext.Provider
            value={{
                stores
            }}>
            { children }
        </StoresContext.Provider>
    )
}

