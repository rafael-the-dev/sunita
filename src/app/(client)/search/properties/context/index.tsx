import { createContext, useCallback, useEffect, useState } from "react";

import { ContextType, PropsType } from "./types"
import { FetchResponseType } from "@/types";
import { PropertyType } from "@/types/property";

import useFetch from "@/hooks/useFetch";

export const StoresContext = createContext<ContextType>({} as ContextType)

export const StoresContextProvider = ({ children }: PropsType) => {
    const { data, fetchData, loading } = useFetch<FetchResponseType<PropertyType[]>>(
        {
            autoFetch: false,
            url: `/api/stores/properties`
        }
    )

    const getProperties = useCallback(
        () => data?.data ?? [],
        [ data ]
    )

    useEffect(
        () => {
            const params = new URLSearchParams(window.location.search);
            
            const controller = new AbortController();

            fetchData(
                {
                    path: `/api/stores/properties?${params.toString()}`,
                    signal: controller.signal
                }
            )

            return () => controller.abort()
        },
        [ fetchData ]
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