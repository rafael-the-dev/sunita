import { NextRequest, NextResponse } from "next/server"

import { BaseStore, StoresResponse } from "@/types/warehouse"
import { EnrollStoreType } from "@/types/warehouse"

import { apiHandler } from "@/middlewares/route-handler"

import StoreModel from "@/models/server/db/Store"

export const GET = (req: NextRequest) => {
    const response: StoresResponse<BaseStore[]> = {
        list: [],
    }

    return NextResponse.json(response)
}


export const POST = async (req: NextRequest) => {
    const storeEnrollment = await req.json() as EnrollStoreType

    return apiHandler(
        req,
        async (config) => {
            await StoreModel.register(storeEnrollment, config)

            return NextResponse.json({ message: "Store was successfully registered" }, { status: 201})
        }
    )
}
