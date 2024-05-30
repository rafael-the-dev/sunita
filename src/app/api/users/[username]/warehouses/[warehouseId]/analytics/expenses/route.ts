import { NextRequest, NextResponse } from "next/server";

import { apiHandler } from "@/middlewares/route-handler";
import { getExpensesTotalPrice, getFilters } from "@/helpers/analytics";
import { AnalyticsExpenseType } from "@/types/analytics";

import Expenses from "@/models/server/db/Expenses";

type URLParamsType = {
    params: {
        username: string;
        warehouseId: string;
    }
}

export const GET = async (req: NextRequest, { params: { username, warehouseId }}: URLParamsType) => {
    const searchParams = req.nextUrl.searchParams;

    return await apiHandler(req, async ({ mongoDbConfig, user }) => {
        const expenses = await Expenses.getAll({ filters: getFilters("expenses.createdAt", searchParams), storeId: warehouseId }, { mongoDbConfig, user })

        const analytics:AnalyticsExpenseType = {
            list: expenses,
            total: getExpensesTotalPrice(expenses)
        };

        return NextResponse.json(analytics);
    });
};