import { NextRequest, NextResponse } from "next/server"

import { PropertyType } from "@/types/property"
import { URLParamsType } from "@/types/app-config-server"

import { apiHandler } from "@/middlewares/route-handler"

import Properties from "@/models/server/db/Property"

export const GET = (req: NextRequest, { params: { storeId } }: URLParamsType) => {
    return apiHandler(
        req,
        async ({ mongoDbConfig, user }) => {
            const properties = await Properties.getAll(
                { 
                    filter: {
                        owner: storeId
                    } 
                },
                { 
                    mongoDbConfig, 
                    user 
                }
            )

            return NextResponse.json(properties)
        }
    )
}

export const POST = (req: NextRequest, { params }: URLParamsType) => {
    return apiHandler(
        req,
        async ({ mongoDbConfig, user }) => {
            const property = await req.json() as PropertyType

            await Properties.register(property, { mongoDbConfig, user })

            return NextResponse.json(
                { message: "Room was successfully created" }, 
                { status: 201 }
            )
        }
    )
}