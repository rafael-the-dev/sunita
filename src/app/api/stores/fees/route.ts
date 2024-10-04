import { NextRequest, NextResponse } from "next/server"

import { apiHandler } from "@/middlewares/route-handler"

import FeesModel from "@/models/server/db/Fees"

export const GET = async (req: NextRequest) => {
    const params = new URLSearchParams(req.nextUrl.search)
    const feesType = params.getAll("type")
    const status = params.getAll("status")
    
    return apiHandler(
        req, 
        async (config) => {
            const response = await FeesModel.getAll(
                {
                    ...( feesType.length > 0 ? { type: { $in: feesType } } : {} ),
                    ...( status.length > 0 ? { status: { $in: status }  } : {} )
                }, 
                config
            )

            return NextResponse.json(response)
        }
    )
}