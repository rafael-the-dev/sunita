import { NextRequest, NextResponse } from "next/server";
import currency from "currency.js";

import { AnalyticsType } from "@/types/analytics";
import { URLParamsType } from "@/types/app-config-server";

import { apiHandler } from "@/middlewares/route-handler";
import { getExpensesTotalPrice, getFilters, getSalesStats } from "@/helpers/analytics";

import Expenses from "@/models/server/db/Expenses";
import Sales from "@/models/server/db/Sale";


export const GET = async (req: NextRequest, { params: { username, storeId }}: URLParamsType) => {
    const searchParams = req.nextUrl.searchParams;

    return await apiHandler(req, async ({ mongoDbConfig, user }) => {
        const [ expenses, sales ] = await Promise.all([
            Expenses.getAll({ filters: getFilters("expenses.createdAt", searchParams), storeId }, { mongoDbConfig, user }),
            Sales.getAll({ filters: getFilters("sales.createdAt", searchParams), storeId }, { mongoDbConfig, user })
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