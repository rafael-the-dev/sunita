import moment from "moment"
import currency from "currency.js"

import { BOOKING_TYPE, RoomType } from "@/types/room"

import { dateTimeFormat } from "./date"

export const getMinCheckOutTime = (bookingType: BOOKING_TYPE, checkIn: string) => {
    const checkInTime = moment(checkIn)
    console.log(bookingType)
    if(bookingType === BOOKING_TYPE.HOURLY) {
        console.log(checkInTime.format(dateTimeFormat), checkInTime.add(1, "hour").format(dateTimeFormat))
        return checkInTime.add(1, "hour").toISOString()
    }

    return checkInTime.add("1", "day").toISOString()
}

const calculateHourlyPrice = (checkIn: string, checkOut: string, room: RoomType) => {
    const checkInTime = moment(checkIn);
    const checkOutTime = moment(checkOut);
    const { hourlyPrice } = room;

    const totalMinutes = checkOutTime.diff(checkInTime, "minutes");

    const minutes = totalMinutes >= 60 ? totalMinutes : 60

    const pricePerMinute = currency(hourlyPrice, { increment: .05 }).divide(60);
    const totalPrice = currency(pricePerMinute, { increment: .05 }).multiply(minutes).value;

    return totalPrice;
}

const calculateDailylyPrice = (checkIn: string, checkOut: string, room: RoomType) => {
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


export const getTotalPrice = (bookingType:BOOKING_TYPE, checkIn: string, checkOut: string, room: RoomType) => {
    if(bookingType === BOOKING_TYPE.HOURLY) return calculateHourlyPrice(checkIn, checkOut, room);

    return 0;
}