import { NextRequest, NextResponse } from "next/server";

import { ProductType } from "@/types/product";
import { apiHandler } from "@/middlewares/route-handler";

import ProductModel from "@/models/server/db/Product";

type URLParamsType = {
    params: {
        username: string;
        warehouseId: string;
    }
}

export const GET = async (req: NextRequest, { params: { username, warehouseId }}: URLParamsType) => {
    return await apiHandler(async ({ mongoDbConfig, user }) => {
        const products = await ProductModel.getAll({ warehouseId }, { mongoDbConfig, user });
        return NextResponse.json(products);
    });
};

export const POST = async (req: NextRequest, { params: { username, warehouseId }}: URLParamsType) => {
    const product = await req.json() as ProductType;

    return await apiHandler(async ({ mongoDbConfig, user }) => {
        await ProductModel.register(product, { mongoDbConfig, user });
        return NextResponse.json("Product was successfully registed", { status: 201});
    });
};