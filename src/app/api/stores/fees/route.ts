import { NextRequest, NextResponse } from "next/server"

import { apiHandler } from "@/middlewares/route-handler"

import FeesModel from "@/models/server/db/Fees"

export const GET = async (req: NextRequest) => {
    return apiHandler(
        req, 
        async (config) => {
            const response = await FeesModel.getAll({}, config)

            return NextResponse.json(response)
        }
    )
}