import { NextRequest, NextResponse } from "next/server";

import { ProductType } from "@/types/product";
import { URLParamsType } from "@/types/app-config-server";

import { apiHandler } from "@/middlewares/route-handler";

import ProductModel from "@/models/server/db/Product";


export const GET = async (req: NextRequest, { params: { storeId }}: URLParamsType) => {
    return await apiHandler(req, async ({ mongoDbConfig, user }) => {
        const products = await ProductModel.getAll({ storeId }, { mongoDbConfig, user });
        return NextResponse.json(products);
    });
};

export const POST = async (req: NextRequest, { params: { storeId }}: URLParamsType) => {
    const product = await req.json() as ProductType;

    return await apiHandler(req, async ({ mongoDbConfig, user }) => {
        await ProductModel.register({ product, storeId }, { mongoDbConfig, user });
        return NextResponse.json("Product was successfully registed", { status: 201});
    });
};