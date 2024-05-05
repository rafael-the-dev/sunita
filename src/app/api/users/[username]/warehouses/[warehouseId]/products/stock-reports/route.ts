
import { NextResponse, NextRequest } from "next/server";

import Product from "@/models/server/db/Product";

import { apiHandler } from "@/middlewares/route-handler";
import Stock from "@/models/server/db/Stock";
import { StockClientRequestBodyType } from "@/types/stock";

type URLParamsType = {
    params: {
        productId: string;
        warehouseId: string
    }
}

export const DELETE = async (_, { params: { productId, warehouseId } }: URLParamsType) => {
    return await apiHandler(async ({ mongoDbConfig, user }) => {
        await Product.delete({ id: productId, warehouseId }, { mongoDbConfig, user });
        return NextResponse.json("Product was successfully deleted");
    });
};

export const POST = async (req: NextRequest, { params: { productId, warehouseId } }: URLParamsType) => {
    return await apiHandler(async ({ mongoDbConfig, user }) => {
        const stockDetails = await req.json() as StockClientRequestBodyType;

        const product = await Stock.add({ storeId: warehouseId, stockDetails }, { mongoDbConfig, user });
        return NextResponse.json("");
    });
};