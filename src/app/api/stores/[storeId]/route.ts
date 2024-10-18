import { NextRequest, NextResponse } from "next/server"

import { URLParamsType } from "@/types/app-config-server";
import { Store } from "@/types/warehouse"

import { apiHandler } from "@/middlewares/route-handler"

import StoreModel from "@/models/server/db/Store"

export const GET = async (req: NextRequest, { params: { storeId }}: URLParamsType) => {

    return apiHandler(
        req, 
        async (config) => {
            const store = await StoreModel.get(storeId, config)

            return NextResponse.json(store)
        }
    )
}

export const PUT = async (req: NextRequest) => {
    const store = await req.json() as Store

    return apiHandler(
        req, 
        async (config) => {
            await StoreModel.update(store, config)

            return NextResponse.json({ message: "Store was successfully updated." })
        }
    )
}
