import { NextRequest, NextResponse } from "next/server"

import { RoomType } from "@/types/room"
import { URLParamsType } from "@/types/app-config-server"

import { apiHandler } from "@/middlewares/route-handler"

import Rooms from "@/models/server/db/Room"

export const GET = (req: NextRequest, { params: { storeId } }: URLParamsType) => {
    return apiHandler(
        req,
        async ({ mongoDbConfig, user }) => {
            const rooms = await Rooms.getAll(
                { 
                    filter: {
                        id: storeId
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
            const room = await req.json() as RoomType

            await Rooms.register(room, { mongoDbConfig, user })

            return NextResponse.json(
                { message: "Room was successfully created" }, 
                { status: 201 }
            )
        }
    )
}