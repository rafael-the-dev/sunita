import { NextRequest, NextResponse } from "next/server";

import { apiHandler } from "@/middlewares/route-handler";
import { getExpensesTotalPrice, getFilters } from "@/helpers/analytics";

import { URLParamsType } from "@/types/app-config-server"
import { AnalyticsExpenseType } from "@/types/analytics";

import Expenses from "@/models/server/db/Expenses";

export const GET = async (req: NextRequest, { params: { username, warehouseId }}: URLParamsType) => {
    const searchParams = req.nextUrl.searchParams;

    return await apiHandler(req, async ({ mongoDbConfig, user }) => {
        const category = searchParams.get("category")
        
        const filters = {
            ...getFilters("expenses.createdAt", searchParams),
            ...( category ? { "category_info.id": category } : {} )
        }
        const expenses = await Expenses.getAll(
            { 
                filters, 
                storeId: warehouseId 
            }, 
            { 
                mongoDbConfig, 
                user 
            }
        )

        const analytics:AnalyticsExpenseType = {
            list: expenses,
            total: getExpensesTotalPrice(expenses)
        };

        return NextResponse.json(analytics);
    });
};