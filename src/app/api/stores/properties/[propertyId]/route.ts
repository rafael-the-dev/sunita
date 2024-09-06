import { NextRequest, NextResponse } from "next/server"
import currency from "currency.js"

import { URLParamsType } from "@/types/app-config-server"

import { apiHandler } from "@/middlewares/route-handler"

import Properties from "@/models/server/db/Property"

export const GET = (req: NextRequest, { params: { propertyId } }: URLParamsType) => {

    return apiHandler(
        req,
        async ({ mongoDbConfig, user }) => {
            const property = await Properties.get(
                { 
                    filter: {
                       id: propertyId
                    }
                },
                { 
                    mongoDbConfig, 
                    user 
                }
            )

            return NextResponse.json(property)
        }
    )
}