import { NextRequest, NextResponse } from "next/server";

import { URLParamsType } from "@/types/app-config-server";
import { SaleDebtType } from "@/types/sale";

import { apiHandler } from "@/middlewares/route-handler";

import SaleDebt from "@/models/server/db/SaleDebt";


export const PUT = async (req: NextRequest, { params: { debtId }}: URLParamsType) => {
    const debt = await req.json() as SaleDebtType;

    return await apiHandler(req, async ({ mongoDbConfig, user }) => {
        await SaleDebt.update({ ...debt, id: debtId }, { mongoDbConfig, user });

        return NextResponse.json("Unpaid sale was successfully updated", { status: 201});
    });
};