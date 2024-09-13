import { createContext, useCallback, useState } from "react";

import { ContextType, PropsType } from "./types"
import { FetchResponseType } from "@/types";
import { PropertyType } from "@/types/property";

import useFetch from "@/hooks/useFetch";

export const StoresContext = createContext<ContextType>({} as ContextType)

export const StoresContextProvider = ({ children }: PropsType) => {
    const { data, fetchData, loading } = useFetch<FetchResponseType<PropertyType[]>>(
        {
            url: `/api/stores/properties`
        }
    )

    const getProperties = useCallback(
        () => data?.data ?? [],
        [ data ]
    )

    return (
        <StoresContext.Provider
            value={{
                getProperties,
                fetchProperties: fetchData,
                loading
            }}>
            { children }
        </StoresContext.Provider>
    )
}