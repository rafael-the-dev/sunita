import { NextRequest, NextResponse } from "next/server";

import { AnalyticsType } from "@/types/analytics";

import { apiHandler } from "@/middlewares/route-handler";
import { getExpensesTotalPrice, getFilters, getSalesStats } from "@/helpers/analytics";

import Expenses from "@/models/server/db/Expenses";
import Sales from "@/models/server/db/Sale";
import currency from "currency.js";

type URLParamsType = {
    params: {
        username: string;
        warehouseId: string;
    }
}

export const GET = async (req: NextRequest, { params: { username, warehouseId }}: URLParamsType) => {
    const searchParams = req.nextUrl.searchParams;

    return await apiHandler(req, async ({ mongoDbConfig, user }) => {
        const [ expenses, sales ] = await Promise.all([
            Expenses.getAll({ filters: getFilters("expenses.createdAt", searchParams), storeId: warehouseId }, { mongoDbConfig, user }),
            Sales.getAll({ filters: getFilters("sales.createAt", searchParams), warehouseId }, { mongoDbConfig, user })
        ])

        const salesStats = getSalesStats(sales);
        const totalExpenses = getExpensesTotalPrice(expenses);

        const analytics: AnalyticsType = {
            expenses: {
                list: expenses,
                total: totalExpenses
            },
            profit: currency(salesStats.profit).subtract(totalExpenses).value,
            sales: {
                list: sales,
                profit: salesStats.profit,
                total: salesStats.total
            }
        };

        return NextResponse.json(analytics);
    });
};