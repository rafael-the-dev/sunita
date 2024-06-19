import { NextRequest, NextResponse } from "next/server";

import { URLParamsType } from "@/types/app-config-server";
import { CartResquestType } from "@/types/cart";

import { apiHandler } from "@/middlewares/route-handler";

import Sale from "@/models/server/db/Sale";


export const GET = async (req: NextRequest, { params: { storeId }}: URLParamsType) => {
    return await apiHandler(req, async ({ mongoDbConfig, user }) => {
        const products = await Sale.getAll({ storeId }, { mongoDbConfig, user });
        
        return NextResponse.json(products);
    });
};

export const POST = async (req: NextRequest, { params: { storeId }}: URLParamsType) => {
    const cart = await req.json() as CartResquestType;

    return await apiHandler(req, async ({ mongoDbConfig, user }) => {
        await Sale.register({ cart, storeId }, { mongoDbConfig, user });

        return NextResponse.json("Product was successfully registed", { status: 201});
    });
};