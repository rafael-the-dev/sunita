import { NextRequest, NextResponse } from "next/server"

import { apiHandler } from "@/middlewares/route-handler"

import Properties from "@/models/server/db/Property"

export const GET = (req: NextRequest) => {
    return apiHandler(
        req,
        async ({ mongoDbConfig, user }) => {
            const properties = await Properties.getAll(
                { 
                    filter: {
                       // owner: storeId
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