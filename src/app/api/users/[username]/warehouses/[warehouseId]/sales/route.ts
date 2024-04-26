import { NextRequest, NextResponse } from "next/server";

import { ProductType } from "@/types/product";
import { apiHandler } from "@/middlewares/route-handler";

import ProductModel from "@/models/server/db/Product";
import Sale from "@/models/server/db/Sale";
import { CartResquestType } from "@/types/cart";

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
    const cart = await req.json() as CartResquestType;

    return await apiHandler(async ({ mongoDbConfig, user }) => {
        await Sale.register({ cart, warehouseId }, { mongoDbConfig, user });
        return NextResponse.json("Product was successfully registed", { status: 201});
    });
};