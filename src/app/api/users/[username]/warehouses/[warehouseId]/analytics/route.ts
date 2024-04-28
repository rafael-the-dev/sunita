import { NextRequest, NextResponse } from "next/server";
import currency from "currency.js";

import { CartResquestType } from "@/types/cart";
import { AnalyticsType } from "@/types/analytics";

import { apiHandler } from "@/middlewares/route-handler";

import ProductModel from "@/models/server/db/Product";
import Sales from "@/models/server/db/Sale";
import { getSalesStats } from "@/helpers/analytics";

type URLParamsType = {
    params: {
        username: string;
        warehouseId: string;
    }
}

export const GET = async (req: NextRequest, { params: { username, warehouseId }}: URLParamsType) => {
    return await apiHandler(async ({ mongoDbConfig, user }) => {
        const [ sales ] = await Promise.all([
            Sales.getAll({ warehouseId }, { mongoDbConfig, user })
        ])

        const salesStats = getSalesStats(sales);

        const analytics: AnalyticsType = {
            sales: {
                list: sales,
                profit: salesStats.profit,
                total: salesStats.total
            }
        };

        return NextResponse.json(analytics);
    });
};