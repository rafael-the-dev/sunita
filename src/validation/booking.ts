import moment from "moment"

import { BOOKING_TYPE } from "@/types/room";
import { BOOKING_STATUS } from "@/types/booking";

type DateType = string | Date | moment.Moment

export const isValidBookingType = (bookingType: BOOKING_TYPE) => {
    return Object
        .values(BOOKING_TYPE)
        .includes(bookingType)
}

export const validateCheckIn = (checkIn: DateType, checkOut: DateType) => {
    const checkInDateTime = moment(checkIn)
    const checkOutDateTime = moment(checkOut)

    if(checkInDateTime.isBefore(moment(Date.now()))) {
        return {
            hasError: true,
            message: 'Check in must not be before current date'
        }
    } 
    else if(checkInDateTime.isAfter(checkOutDateTime)) {
        return {
            hasError: true,
            message: 'Check in must not be after check out date'
        }
    }

    return {
        hasError: false,
        message: ""
    }
}


export const validateCheckOut = (checkIn: DateType, checkOut: DateType) => {
    const checkInDateTime = moment(checkIn)
    const checkOutDateTime = moment(checkOut)

    if(checkOutDateTime.isBefore(checkInDateTime)) {
        return {
            hasError: true,
            message: 'Check out must not be before check in date'
        }
    } 

    return {
        hasError: false,
        message: ""
    }
}

export const isValidStatus = (value: BOOKING_STATUS) => {
    const list = Object
        .values(BOOKING_STATUS)
        .filter(status => status !== BOOKING_STATUS.CANCELLED)

    //@ts-ignore
    return list.includes(value)
}