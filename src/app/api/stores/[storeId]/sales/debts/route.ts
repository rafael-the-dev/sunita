import { NextRequest, NextResponse } from "next/server";

import { URLParamsType } from "@/types/app-config-server";
import { CartResquestType } from "@/types/cart";
import { SaleDebtType } from "@/types/sale";

import { apiHandler } from "@/middlewares/route-handler";

import SaleDebt from "@/models/server/db/SaleDebt";


export const GET = async (req: NextRequest, { params: { storeId }}: URLParamsType) => {
    return await apiHandler(req, async ({ mongoDbConfig, user }) => {
        //const products = await Sale.getAll({ storeId }, { mongoDbConfig, user });
        
        return NextResponse.json([]);
    });
};

export const POST = async (req: NextRequest) => {
    const debt = await req.json() as SaleDebtType;

    return await apiHandler(req, async ({ mongoDbConfig, user }) => {
        await SaleDebt.register(debt, { mongoDbConfig, user });

        return NextResponse.json("Product was successfully registed", { status: 201});
    });
};