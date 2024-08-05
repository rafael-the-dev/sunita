import { NextRequest, NextResponse } from "next/server"

import { SupplierType } from "@/types/Supplier"
import { URLParamsType } from "@/types/app-config-server"

import { apiHandler } from "@/middlewares/route-handler"

import SupplierModel from "@/models/server/db/Supplier"

export const PUT = async (req: NextRequest, { params: { supplierId }}: URLParamsType) => {
    const supplier = await req.json() as SupplierType
    
    if(supplier.id !== supplierId) {
        return NextResponse.json(
            { message: "Invalid supplier's ID" },
            { status: 400 }
        )
    }

    return await apiHandler(
        req,
        async ({ mongoDbConfig, user }) => {
            await SupplierModel.update(
                supplier,
                { mongoDbConfig, user }
            )

            return NextResponse.json({ message: "Supplier was successfully updated" })
        } 
    )
}