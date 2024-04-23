import { NextResponse, NextRequest } from "next/server";

import Product from "@/models/server/db/Product";

import { apiHandler } from "@/middlewares/route-handler";

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

export const GET = async (req: NextRequest, { params: { productId, warehouseId } }: URLParamsType) => {
    return await apiHandler(async ({ mongoDbConfig, user }) => {
        const product = await Product.get({ productId, warehouseId }, { mongoDbConfig, user });
        return NextResponse.json(product);
    });
};