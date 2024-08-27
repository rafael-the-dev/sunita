import moment from "moment"
import currency from "currency.js"

import { BOOKING_TYPE, BaseBookingType, BookingRoomType, RoomType } from "@/types/room"
import { ConfigType, FiltersType } from "@/types/app-config-server"
import { PaymentType } from "@/types/payment-method"

import { dateTimeFormat, resetTime, toISOString } from "./date"

import Bookings from '@/models/server/db/Booking'
import { PropertyType } from "@/types/property"
import { BookingType, BookingInfoType } from "@/types/booking"

type DateType = string | Date

export const getMinCheckOutTime = (bookingType: BOOKING_TYPE, checkIn: string) => {
    const checkInTime = moment(checkIn)
    console.log(bookingType)
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


export const getBookings = async ({ filters }: { filters?: FiltersType }, { mongoDbConfig, user }: ConfigType) => {
    const pipeline = [
        {
            $match: {
                ...(filters ?? {}),
            }
        },
        {
            $lookup: {
                from: "properties",
                foreignField: "id",
                localField: "property",
                as: "properties",
            }
        },
        {
            $lookup: {
                from: "guests",
                foreignField: "id",
                localField: "guest",
                as: "guests",
            }
        },
        {
            $unwind: "$guests"
        },
        {
            $unwind: "$properties"
        },
        {
            $group: {
                _id: "$id",
                checkIn: { $first: "$checkIn" },
                checkOut: { $first: "$checkOut" },
                date: { $first: "$date" },
                guest: { $first: "$guests" },
                id: { $first: "$id" },
                property: { $first: "$properties" },
                payment: { $first: "$payment" },
                type: { $first: "$type" },
                totalPrice: { $first: "$totalPrice" }
            }
        }
    ];

    const bookings = await mongoDbConfig
        .collections
        .BOOKINGS
        .aggregate(pipeline)
        .toArray() as BookingInfoType[];

    return bookings;
}


export const isBookingAvailable = async ({ checkIn, checkOut, property }: BookingType, config: ConfigType) => {
    const date = moment(checkIn);
    resetTime(date);

    const endDateTime = moment(checkOut)
    endDateTime.hours(23)
    endDateTime.minutes(59)
    endDateTime.seconds(59)

    const bookings = await Bookings.getAll(
        {
            filters: {
                property,
                date: {
                    $gte: toISOString(date),
                    $lte: toISOString(endDateTime),
                },
                $or: [
                    {
                        checkIn: { $lt: checkOut },
                        checkOut: { $gt: checkIn }
                    }
                ]
            }
        },
        config
    )

    return bookings.data.list.length === 0
}