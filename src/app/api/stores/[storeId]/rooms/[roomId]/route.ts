import { NextRequest, NextResponse } from "next/server";

import { RoomType } from "@/types/room";
import { URLParamsType } from "@/types/app-config-server";

import { apiHandler } from "@/middlewares/route-handler";

import Rooms from "@/models/server/db/Room";

export const GET = (req: NextRequest, { params: { storeId } }: URLParamsType) => {
    return apiHandler(
        req,
        async ({ mongoDbConfig, user }) => {
            const room = await Rooms.get(
                { 
                    filter: {
                        id: storeId,
                        "rooms.id": storeId
                    } 
                },
                { 
                    mongoDbConfig, 
                    user 
                }
            )

            return NextResponse.json(room)
        }
    )
}

export const PUT = (req: NextRequest) => {
    return apiHandler(
        req,
        async ({ mongoDbConfig, user }) => {
            const room = await req.json() as RoomType;

            await Rooms.upddate(
                room, 
                { 
                    mongoDbConfig, 
                    user 
                }
            );

            return NextResponse.json({ message: "Room was successfully updated" });
        }
    )
}