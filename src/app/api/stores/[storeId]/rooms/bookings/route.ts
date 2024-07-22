import { NextRequest, NextResponse } from "next/server"

import { RoomType, SimpleBookingType } from "@/types/room"
import { URLParamsType } from "@/types/app-config-server"

import { apiHandler } from "@/middlewares/route-handler"

import Booking from "@/models/server/db/Booking"

export const GET = (req: NextRequest, { params: { storeId } }: URLParamsType) => {
    return apiHandler(
        req,
        async ({ mongoDbConfig, user }) => {
            const rooms = await Booking.getAll(
                { 
                    filter: {
                        //id: storeId
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
            const booking = await req.json() as SimpleBookingType

            await Booking.register(booking, { mongoDbConfig, user })

            return NextResponse.json(
                { message: "Booking was successfully created" }, 
                { status: 201 }
            )
        }
    )
}