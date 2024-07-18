import { createContext, useState } from "react";
import moment from "moment";

import { ContextType, PropsType } from "./types";
import { BOOKING_TYPE, SimpleBookingType } from "@/types/room";

import useBooking from "./hooks/useBook";
import useGuest from "./hooks/useGuest";
import usePayment from "./hooks/usePayment";
import { dateFormat } from "@/helpers/date";

export const BookingContext = createContext<ContextType>({} as ContextType)

export const BookingContextProvider = ({ children }: PropsType) => {
    const { booking, ...bookingRest } = useBooking()
    const { guest, ...guestRest } = useGuest()
    const payment = usePayment(booking.totalPrice)

    const toString = () => {
        const book: SimpleBookingType = {
            checkIn: booking.checkIn.value,
            checkOut: booking.checkOut.value,
            date: moment(booking.checkIn.value).format(dateFormat),
            guest: {
                document: {
                    expireDate: guest.document.expireDate.value,
                    issueDate: guest.document.issueDate.value,
                    number: guest.document.number.value,
                    type: guest.document.type.value
                },
                firstName: guest.firstName.value,
                lastName: guest.lastName.value
            },
            id: null,
            paymentMethods: null,
            room: booking.room,
            store: null,
            type: booking.type.value,
            totalPrice: booking.totalPrice
        }

        return JSON.stringify(book)
    }

    return (
        <BookingContext.Provider
            value={{
                booking, ...bookingRest,
                guest, ...guestRest,
                ...payment,
                toString
            }}>
            { children }
        </BookingContext.Provider>
    )
}