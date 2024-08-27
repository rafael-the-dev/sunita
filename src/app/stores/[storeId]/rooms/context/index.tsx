import { createContext, useCallback, useContext } from "react"

import { BookingsResponseType } from "@/types/booking"
import { ContextType, PropsType } from "./types"
import { FetchResponseType } from "@/types"

import { LoginContext } from "@/context/LoginContext"
import { PropertyType } from "@/types/property"

import useFetch from "@/hooks/useFetch"

export const RoomsContext = createContext<ContextType>({} as ContextType)

export const RoomsContextProvider = ({ children }: PropsType) => {
    const { credentials } = useContext(LoginContext)

    const bookings = useFetch<FetchResponseType<BookingsResponseType>>(
        {
            url: `/api/stores/${credentials?.user?.stores[0]?.storeId}/properties/bookings`
        }
    );

    const { data, loading, fetchData } = useFetch<FetchResponseType<PropertyType[]>>(
        {
            url: `/api/stores/${credentials?.user?.stores[0]?.storeId}/properties`
        }
    )

    const response = data

    const getProperties = useCallback(
        () => response ? response.data :  [], 
        [ response ]
    )

    return (
        <RoomsContext.Provider
            value={{
                bookings,
                fetchRooms: fetchData,
                getProperties,
                loading,
            }}>
            { children }
        </RoomsContext.Provider>
    )
}