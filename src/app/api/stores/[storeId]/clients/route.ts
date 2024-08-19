import { NextResponse, NextRequest } from "next/server";

import { CustomerType } from "@/types/guest"
import { User, UserType } from "@/types/user"

import { apiHandler } from "@/middlewares/route-handler";

import Customer from "@/models/server/db/Customer";

export const GET = async (req: NextRequest) => {
    return await apiHandler(
        req, 
        async (config) => {
            const customers = await Customer.getAll({}, config);

            return NextResponse.json(customers);
        }
    );
};

export const POST = async (req: NextRequest) => {
    const customer = await req.json() as CustomerType;
    
    return await apiHandler(
        req,
        async (config) => {
            await Customer.register(customer, config);

            return NextResponse.json({}, { status: 201 });
        }
    )
};