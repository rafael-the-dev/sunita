import moment from "moment"
import currency from "currency.js"

import { BOOKING_TYPE, RoomType } from "@/types/room"
import { PaymentType } from "@/types/payment-method"

import { dateTimeFormat } from "./date"

import { PropertyType } from "@/types/property"

type DateType = string | Date

export const getMinCheckOutTime = (bookingType: BOOKING_TYPE, checkIn: string) => {
    const checkInTime = moment(checkIn)
    
    if(bookingType === BOOKING_TYPE.HOURLY) {
        console.log(checkInTime.format(dateTimeFormat), checkInTime.add(1, "hour").format(dateTimeFormat))
        return checkInTime.add(1, "hour").toISOString()
    }

    return checkInTime.add("1", "day").toISOString()
}

const calculateHourlyPrice = (checkIn: DateType, checkOut: DateType, property: PropertyType) => {
    const checkInTime = moment(checkIn);
    const checkOutTime = moment(checkOut);
    const { price } = property;

    const totalMinutes = checkOutTime.diff(checkInTime, "minutes");

    const minutes = totalMinutes >= 60 ? totalMinutes : 60

    const pricePerMinute = currency(price.hourly, { increment: .05 }).divide(60);
    const totalPrice = currency(pricePerMinute, { increment: .05 }).multiply(minutes).value;

    return totalPrice;
}

const calculateDailylyPrice = (checkIn: DateType, checkOut: DateType, room: RoomType) => {
    const checkInTime = moment(checkIn);
    const checkOutTime = moment(checkOut);
    const { hourlyPrice } = room;

    const totalDays = checkOutTime.diff(checkInTime, "days")
    const totalMinutes = checkOutTime.diff(checkInTime, "minutes");

    const minutes = totalMinutes >= 60 ? totalMinutes : 60

    const pricePerMinute = currency(hourlyPrice, { increment: .05 }).divide(60);
    const totalPrice = currency(pricePerMinute, { increment: .05 }).multiply(minutes).value;

    return totalPrice;
}


export const getTotalPrice = (bookingType:BOOKING_TYPE, checkIn: DateType, checkOut: DateType, property: PropertyType) => {
    if(bookingType === BOOKING_TYPE.HOURLY) return calculateHourlyPrice(checkIn, checkOut, property);

    return 0;
}

export const calculatePayment = (payment: PaymentType, total: number) => {
    const totalReceived = payment
        .paymentMethods
        .reduce(
            (prevValue, currentPM) => {
                return currency(prevValue).add(currentPM.amount).value
            }, 
            0
        );
    
    const difference = currency(total).subtract(totalReceived).value

    payment.changes = totalReceived > total ? Math.abs(difference) : 0;
    payment.remainingAmount = totalReceived <= total ? difference : 0;
    payment.totalReceived = totalReceived;
}
