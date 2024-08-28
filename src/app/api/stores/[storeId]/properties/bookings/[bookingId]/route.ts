
import { NextRequest, NextResponse } from "next/server"

import { BookingType } from "@/types/booking"
import { URLParamsType } from "@/types/app-config-server"

import { apiHandler } from "@/middlewares/route-handler"

import Booking from "@/models/server/db/Booking"

export const PUT = (req: NextRequest, { params: { bookingId } }: URLParamsType) => {
    return apiHandler(
        req,
        async ({ mongoDbConfig, user }) => {
            const booking = await req.json() as BookingType

            await Booking.update({ ...booking, id: bookingId }, { mongoDbConfig, user })

            return NextResponse.json(
                { message: "Booking was successfully updated" }
            )
        }
    )
}