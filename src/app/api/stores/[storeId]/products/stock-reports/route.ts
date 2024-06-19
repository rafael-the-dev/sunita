
import { NextResponse, NextRequest } from "next/server";

import { StockClientRequestBodyType } from "@/types/stock";
import { URLParamsType } from "@/types/app-config-server";

import { apiHandler } from "@/middlewares/route-handler";
import { resetDate } from "@/helpers/date";

import Stock from "@/models/server/db/Stock";


export const GET = async (req: NextRequest, { params: { storeId } }: URLParamsType) => {
    const searchParams = req.nextUrl.searchParams;

    return await apiHandler(req, async ({ mongoDbConfig, user }) => {
        const endDate = searchParams.get("end-date");
        const products = searchParams.getAll("product");
        const userId = searchParams.get("user");
        const startDate = searchParams.get("start-date");

        const filters = {
            ...( resetDate({ endDate, key: "stock-reports.createdAt", startDate }) ),
            ...( products.length > 0 ? { "stock-reports.items": { $elemMatch: { "product.id": { $in: products } } } } : {} ),
            ...( userId ? { "stock-reports.user": userId } : {} ),
        };

        const result = await Stock.getAll(
            { 
                filters,
                storeId 
            }, 
            { mongoDbConfig, user }
        );
        return NextResponse.json(result);
    });
};

export const POST = async (req: NextRequest, { params: { storeId } }: URLParamsType) => {
    return await apiHandler(req, async ({ mongoDbConfig, user }) => {
        const stockDetails = await req.json() as StockClientRequestBodyType;

        await Stock.add({ storeId, stockDetails }, { mongoDbConfig, user });

        const message = "Stock was successfully updated";

        return NextResponse.json({ message }, { status: 201 });
    });
};