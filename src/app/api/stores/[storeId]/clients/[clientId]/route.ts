import { NextResponse, NextRequest } from "next/server";

import { CustomerType } from "@/types/guest"

import { apiHandler } from "@/middlewares/route-handler";

import Customer from "@/models/server/db/Customer";
import { URLParamsType } from "@/types/app-config-server";

/*export const GET = async (req: NextRequest) => {
    return await apiHandler(
        req, 
        async (config) => {
            const customers = await Customer.getAll({}, config);

            return NextResponse.json(customers);
        }
    );
};*/

export const PUT = async (req: NextRequest, { params: { clientId }}: URLParamsType) => {
    const customer = await req.json() as CustomerType;
    
    return await apiHandler(
        req,
        async (config) => {
            await Customer.update({ ...customer, id: clientId }, "CUSTOMERS", config);

            return NextResponse.json({}, { status: 201 });
        }
    )
};