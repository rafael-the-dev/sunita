import moment from "moment"
import currency from "currency.js"

import { BOOKING_TYPE, BaseBookingType, BookingRoomType, RoomType } from "@/types/room"
import { ConfigType } from "@/types/app-config-server"
import { PaymentType } from "@/types/payment-method"

import { dateTimeFormat, resetTime, toISOString } from "./date"

import Bookings from '@/models/server/db/Booking'

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

const calculateHourlyPrice = (checkIn: DateType, checkOut: DateType, room: RoomType) => {
    const checkInTime = moment(checkIn);
    const checkOutTime = moment(checkOut);
    const { hourlyPrice } = room;

    const totalMinutes = checkOutTime.diff(checkInTime, "minutes");

    const minutes = totalMinutes >= 60 ? totalMinutes : 60

    const pricePerMinute = currency(hourlyPrice, { increment: .05 }).divide(60);
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


export const getTotalPrice = (bookingType:BOOKING_TYPE, checkIn: DateType, checkOut: DateType, room: RoomType) => {
    if(bookingType === BOOKING_TYPE.HOURLY) return calculateHourlyPrice(checkIn, checkOut, room);

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


export const getBookings = async ({ filters }: { filters?: { $match: {[key: string]: string | Object } }[] }, { mongoDbConfig, user }: ConfigType) => {
    const  { storeId }  = user.stores[0];

        const pipeline = [
            {
                $match: {
                    id: storeId
                }
            },
            {
                $unwind: "$rooms-booking"
            },
            ...(filters ?? []),
            {
                $group: {
                    _id: "$rooms-booking.id",
                    checkIn: { $first: "$rooms-booking.checkIn" },
                    checkOut: { $first: "$rooms-booking.checkOut" },
                    date: { $first: "$rooms-booking.date" },
                    id: { $first: "$rooms-booking.id" },
                    payment: { $first: "$rooms-booking.payment" },
                    room: { $first: "$rooms-booking.room" },
                    type: { $first: "$rooms-booking.type" },
                    totalPrice: { $first: "$rooms-booking.totalPrice" }
                }
            }
        ];

        const bookings = await mongoDbConfig
            .collections
            .WAREHOUSES
            .aggregate(pipeline)
            .toArray() as BookingRoomType[];

        return bookings;
}


export const isBookingAvailable = async ({ checkIn, checkOut, room }: BaseBookingType, config: ConfigType) => {
    const date = moment(checkIn);
    resetTime(date);

    const endDateTime = moment(checkOut)
    endDateTime.hours(23)
    endDateTime.minutes(59)
    endDateTime.seconds(59)

    const bookings = await Bookings.getAll(
        {
            filters: [
                {
                    $match: {
                        "rooms-booking.room.id": room.id,
                        "rooms-booking.date": {
                            $gte: toISOString(date),
                            $lte: toISOString(endDateTime),
                        },
                        $or: [
                            {
                                "rooms-booking.checkIn": { $lt: checkOut },
                                "rooms-booking.checkOut": { $gt: checkIn }
                            }
                        ]
                    }
                }
            ]
        },
        config
    )

    return bookings.length === 0
}