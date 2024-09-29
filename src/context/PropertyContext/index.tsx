"use client"

import * as React from "react"

import { BookingsResponseType } from "@/types/booking"
import { FetchDataFuncType } from "@/hooks/useFetch/types"
import { PropertyType } from "@/types/property"

import useFetch from "@/hooks/useFetch"

type PropertyResponseType = {
    property: PropertyType,
    error: Error
};

type PropertyBookingsResponseType = {
    bookings: BookingsResponseType
};

type PropertyContextType = PropertyResponseType & PropertyBookingsResponseType & {
    fetchBookings: FetchDataFuncType,
    getBookings: () => BookingsResponseType
};

type PropsType = PropertyResponseType & PropertyBookingsResponseType & {
    children: React.ReactNode
};

export const PropertyContext = React.createContext<PropertyContextType>({} as PropertyContextType);

export const PropertyContextProvider = ({ children, ...rest }: PropsType) => {
    const isInitialBookings = React.useRef(true)

    const bookingsResponse = useFetch<BookingsResponseType>({
        autoFetch: false,
        url: `/api/stores/${rest?.property?.owner}/properties/bookings?property=${rest?.property?.id}`
    })

    const bookings = rest.bookings
    const clientRequestBookings = bookingsResponse?.data

    const getBookings = React.useCallback(
        () => isInitialBookings.current ? bookings : clientRequestBookings,
        [ bookings, clientRequestBookings ]
    )

    React.useEffect(
        () => {
            if(clientRequestBookings) {
                isInitialBookings.current = false
            }
        },
        [ clientRequestBookings ]
    )

    return (
        <PropertyContext.Provider
            value={
                {
                    ...rest,
                    fetchBookings: bookingsResponse.fetchData,
                    getBookings
                }
            }>
            { children }
        </PropertyContext.Provider>
    )
}