import { NextRequest, NextResponse } from "next/server"

import { SupplierType } from "@/types/Supplier"

import { apiHandler } from "@/middlewares/route-handler"

import SupplierModel from "@/models/server/db/Supplier"

export const POST = async (req: NextRequest) => {
    return await apiHandler(
        req,
        async ({ mongoDbConfig, user }) => {
            const supplier = await req.json() as SupplierType

            await SupplierModel.register(
                supplier,
                { mongoDbConfig, user }
            )

            return NextResponse.json(
                { message: "Supplier was successfully registered" },
                { status: 201 }
            )
        } 
    )
}