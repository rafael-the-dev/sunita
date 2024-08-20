import { createContext, useCallback, useMemo, useState } from "react";
import moment from "moment";

import { ContextType, PropsType } from "./types";
import { SimpleBookingType } from "@/types/room";

import useBooking from "./hooks/useBook";
import useGuest from "./hooks/useGuest";
import usePayment from "./hooks/usePayment";
import { dateFormat } from "@/helpers/date";

export const BookingContext = createContext<ContextType>({} as ContextType)

export const BookingContextProvider = ({ children }: PropsType) => {
    const { booking, ...bookingRest } = useBooking();
    const { guest, ...guestRest } = useGuest();
    const payment = usePayment(booking.totalPrice);

    const hasBookingErrors = bookingRest.hasErrors;
    const hasGuestErrors = guestRest.hasErrors;
    const hasPaymentErrors = payment.hasErrors;
    
    const hasErrors = useMemo(
        () => hasBookingErrors  || hasPaymentErrors || hasGuestErrors,
        [ hasBookingErrors, hasGuestErrors, hasPaymentErrors ]
    )
    
    const resetBooking = bookingRest.resetBooking;
    const resetGuest = guestRest.reset;
    const resetPayment = payment.reset;

    const reset = useCallback(
        () => {
            resetBooking()
            resetGuest()
            resetPayment()
        }, 
        [ resetBooking, resetGuest, resetPayment ]
    )

    const toString = () => {
        const book: SimpleBookingType = {
            checkIn: booking.checkIn.value,
            checkOut: booking.checkOut.value,
            date: moment(booking.checkIn.value).format(dateFormat),
            guest: guestRest.toLiteralObject(),
            id: null,
            payment: payment.getPayment(),
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
                ...bookingRest,
                ...guestRest,
                ...payment,
                booking,
                guest, 
                hasErrors,
                reset,
                toString
            }}>
            { children }
        </BookingContext.Provider>
    )
}