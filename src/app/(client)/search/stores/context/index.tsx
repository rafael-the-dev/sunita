import { createContext, useCallback, useState } from "react";

import { ContextType, PropsType } from "./types"
import { BaseStore, StoresResponse } from "@/types/warehouse";

import useFetch from "@/hooks/useFetch";

export const StoresContext = createContext<ContextType>({} as ContextType)

export const StoresContextProvider = ({ children }: PropsType) => {
    const { data, loading } = useFetch<StoresResponse<BaseStore[]>>(
        {
            url: `/api/stores`
        }
    )

    const getStores = useCallback(
        () => !data ? { list: [] } : structuredClone(data),
        [ data ]
    )

    return (
        <StoresContext.Provider
            value={{
                getStores
            }}>
            { children }
        </StoresContext.Provider>
    )
}