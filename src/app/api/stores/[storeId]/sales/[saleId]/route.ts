import { NextRequest, NextResponse } from "next/server";

import { apiHandler } from "@/middlewares/route-handler";

import { CartResquestType } from "@/types/cart";
import { URLParamsType } from "@/types/app-config-server";

import Sale from "@/models/server/db/Sale";

export const PUT = async (req: NextRequest, { params: { saleId, storeId }}: URLParamsType) => {
    const cart = await req.json() as CartResquestType; 

    return await apiHandler(req, async ({ mongoDbConfig, user }) => {
        await Sale.update({ cart: { ...(structuredClone(cart)), id: saleId }, storeId }, { mongoDbConfig, user });
        return NextResponse.json("");
    });
};