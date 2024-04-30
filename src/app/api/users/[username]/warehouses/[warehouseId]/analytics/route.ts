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
    const searchParams = req.nextUrl.searchParams;

    const products = searchParams.getAll("product");
    const users = searchParams.getAll("user")

    const getFilters = () => {

        return {
           ...( products.length > 0 ? { "product_info.id": { $in: products } } : {}),
            ...(users.length > 0 ? { "user_info.username": { $in: users } } : {}),
        }
    }

    return await apiHandler(async ({ mongoDbConfig, user }) => {
        const [ sales ] = await Promise.all([
            Sales.getAll({ filters: getFilters(), warehouseId }, { mongoDbConfig, user })
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