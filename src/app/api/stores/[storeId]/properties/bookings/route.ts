import { NextRequest, NextResponse } from "next/server"

import { BookingType } from "@/types/booking"
import { URLParamsType } from "@/types/app-config-server"

import { apiHandler } from "@/middlewares/route-handler"
import { getDateFilter } from "./helpers"

import Booking from "@/models/server/db/Booking"

export const GET = (req: NextRequest, { params: { storeId } }: URLParamsType) => {
    const params = new URLSearchParams(req.nextUrl.search)

    const status = params.getAll("status")

    const startDate = params.get("start-date")
    const endDate = params.get("end-date")
    const property = params.get("property")
    
    const checkIn = getDateFilter(endDate, startDate)
    
    return apiHandler(
        req,
        async ({ mongoDbConfig, user }) => {
            const rooms = await Booking.getAll(
                { 
                    filters: {
                        ...( property ? {  property }: {}),
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

export const POST = (req: NextRequest, { params: { storeId } }: URLParamsType) => {
    return apiHandler(
        req,
        async (config) => {
            const booking = await req.json() as BookingType

            await Booking.register(
                booking, 
                storeId, 
                { 
                    ...config, 
                    user: {
                        ...(config.user ? config.user : {}), //@ts-ignore
                        stores: [ { storeId } ]
                    }
                }
            )

            return NextResponse.json(
                { message: "Booking was successfully created" }, 
                { status: 201 }
            )
        }
    )
}