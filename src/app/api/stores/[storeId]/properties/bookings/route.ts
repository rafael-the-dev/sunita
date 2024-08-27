import { NextRequest, NextResponse } from "next/server"

import { BookingType } from "@/types/booking"
import { URLParamsType } from "@/types/app-config-server"

import { apiHandler } from "@/middlewares/route-handler"
import { getDateFilter } from "./helpers"

import Booking from "@/models/server/db/Booking"

export const GET = (req: NextRequest, { params: { storeId } }: URLParamsType) => {
    const params = new URLSearchParams(req.url)

    const status = params.getAll("status")

    const startDate = params.get("start-date")
    const endDate = params.get("end-date")

    const checkIn = getDateFilter(endDate, startDate)

    return apiHandler(
        req,
        async ({ mongoDbConfig, user }) => {
            const rooms = await Booking.getAll(
                { 
                    filters: {
                        ...( status.length > 0 ? { status: { $in: status }}: {}),
                        checkIn,
                        owner: storeId
                    } 
                },
                { 
                    mongoDbConfig, 
                    user 
                }
            )

            return NextResponse.json(rooms)
        }
    )
}

export const POST = (req: NextRequest, { params }: URLParamsType) => {
    return apiHandler(
        req,
        async ({ mongoDbConfig, user }) => {
            const booking = await req.json() as BookingType

            await Booking.register(booking, { mongoDbConfig, user })

            return NextResponse.json(
                { message: "Booking was successfully created" }, 
                { status: 201 }
            )
        }
    )
}