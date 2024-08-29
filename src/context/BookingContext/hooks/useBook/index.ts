import { useCallback, useContext, useMemo, useState } from "react"
import moment from "moment"

import { BOOKING_TYPE } from "@/types/room"
import { BOOKING_STATUS, BookingInfoType } from "@/types/booking"

import { RoomsContext } from "@/app/stores/[storeId]/rooms/context"
import { FixedTabsContext } from "@/context/FixedTabsContext"

import { isValidBookingType, validateCheckIn, validateCheckOut, isValidStatus } from "@/validation/booking"
import { getTotalPrice } from "@/helpers/booking"
import { defaultInputField } from "@/config/input"

import usePayload from "@/hooks/usePayload"

const initial = {
    checkIn: structuredClone({ ...defaultInputField, value: moment(new Date(Date.now())).add(20, 'minutes').toISOString() }),
    checkOut: structuredClone({ ...defaultInputField, value: moment(new Date(Date.now())).add(2, "hour").toISOString() }),
    property: null,
    store: null,
    status: BOOKING_STATUS.PENDING,
    type: structuredClone({ ...defaultInputField, value: BOOKING_TYPE.HOURLY }),
    totalPrice: 0
}

const useBooking = () => {
    const { getDialog } = useContext(FixedTabsContext);

    const bookingInfo = getDialog().current?.payload as BookingInfoType
    const hasPayload = Boolean(bookingInfo)

    const { getProperties } = useContext(RoomsContext);

    const [ booking, setBooking ] = useState(
        () => {
            if(!hasPayload) return initial;

            return {
                checkIn: structuredClone({ ...defaultInputField, value: bookingInfo.checkIn as string }),
                checkOut: structuredClone({ ...defaultInputField, value: bookingInfo.checkOut as string }),
                property: bookingInfo.property,
                store: bookingInfo.owner,
                status: bookingInfo.status,
                type: structuredClone({ ...defaultInputField, value: BOOKING_TYPE.HOURLY }),
                totalPrice: bookingInfo.totalPrice
            }
        }
    )

    const hasErrors = useMemo(
        () => {
           return !Boolean(booking.property) || booking.totalPrice <= 0 || booking.checkIn.error || booking.checkOut.error
        },
        [ booking ]
    )

    const changeRoom = useCallback(
        (id: string) => {
            const property = getProperties().find(room => room.id === id)

            setBooking(
                booking => ({
                    ...booking,
                    property,
                    totalPrice: getTotalPrice(booking.type.value, booking.checkIn.value, booking.checkOut.value, property)
                })
            )
        },
        [ getProperties ]
    )

    const changeType = useCallback(
        (bookingType: BOOKING_TYPE) => {
            const isValid = isValidBookingType(bookingType)

            setBooking(
                booking => ({
                    ...booking,
                    totalPrice: getTotalPrice(bookingType, booking.checkIn.value, booking.checkOut.value, booking.property),
                    type: {
                        error: !isValid,
                        helperText: isValid ? "" : "Invalid type",
                        value: bookingType
                    }
                })
            )
        }, 
        []
    )

    const changeStatus = useCallback(
        (value: BOOKING_STATUS) => {
            setBooking(
                booking => ({
                    ...booking,
                    status: value
                })
            )
        }, 
        []
    )

    const changeTime = useCallback(
        (prop: "checkIn" | "checkOut" ) => 
            (newTime: string) => {
                setBooking(
                    booking => {
                        let error = false;
                        let helperText = "";
                        let totalPrice = 0;

                        const bookingClone = { ...booking };

                        if(prop === "checkIn") {
                            const { hasError, message } = validateCheckIn(newTime, booking.checkOut.value);

                            error = hasError;
                            helperText = message;
    
                            bookingClone.totalPrice = getTotalPrice(booking.type.value, newTime, booking.checkOut.value, booking.property);
                        } else {
                            const { hasError, message } = validateCheckOut(booking.checkIn.value, newTime);

                            error = hasError;
                            helperText = message;
                            bookingClone.totalPrice = getTotalPrice(booking.type.value, booking.checkIn.value, newTime, booking.property);
                            
                            const checkInValidation = validateCheckIn(bookingClone.checkIn.value, newTime);

                            bookingClone["checkIn"].error = checkInValidation.hasError;
                            bookingClone['checkIn'].helperText = checkInValidation.message;
                        }

                        bookingClone[prop] = {
                            error,
                            helperText,
                            value: newTime
                        };



                        return bookingClone;
                    }
                )
            },
        []
    )

    const resetBooking = useCallback(
        () => setBooking(structuredClone(initial)),
        []
    )

    return {
        booking,
        hasErrors,

        changeRoom,
        changeStatus,
        changeType,
        changeTime,

        resetBooking
    }
}

export default useBooking