import { createContext, useCallback, useContext, useEffect, useRef } from "react";

import { ContextType, PropsType } from "./types"
import { FetchResponseType } from "@/types";
import { PropertyType } from "@/types/property";

import { PropertiesContext } from "@/context/PropertiesContext"

import useFetch from "@/hooks/useFetch";

export const StoresContext = createContext<ContextType>({} as ContextType)

export const StoresContextProvider = ({ children }: PropsType) => {
    const context = useContext(PropertiesContext)

    const { data, fetchData, loading } = useFetch<FetchResponseType<PropertyType[]>>(
        {
            autoFetch: false,
            url: `/api/stores/properties`
        }
    )

    const isInitial = useRef(true)

    const getProperties = useCallback(
        () => {
            const properties = ( isInitial.current ? context.data : data?.data ) ?? []

            return properties
        },
        [ context, data ]
    )

    useEffect(
        () => {
            if(data) {
                isInitial.current = false
            }
        },
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