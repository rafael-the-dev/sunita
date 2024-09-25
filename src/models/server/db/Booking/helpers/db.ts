import moment from "moment"

import { ConfigType, FiltersType } from "@/types/app-config-server"

import { resetTime, toISOString } from "@/helpers/date"

import Bookings from '@/models/server/db/Booking'
import { BookingType, BookingInfoType } from "@/types/booking"

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
                status: { $first: "$status" },
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