import { NextRequest, NextResponse } from "next/server";

import { apiHandler } from "@/middlewares/route-handler";

import Sale from "@/models/server/db/Sale";
import { CartResquestType } from "@/types/cart";

type URLParamsType = {
    params: {
        saleId: string;
        username: string;
        warehouseId: string;
    }
};

export const PUT = async (req: NextRequest, { params: { saleId, warehouseId }}: URLParamsType) => {
    const cart = await req.json() as CartResquestType;

    return await apiHandler(async ({ mongoDbConfig, user }) => {
        await Sale.update({ cart: { ...(structuredClone(cart)), id: saleId }, storeId: warehouseId }, { mongoDbConfig, user });
        return NextResponse.json("");
    });
};