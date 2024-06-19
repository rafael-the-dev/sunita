import { NextResponse, NextRequest } from "next/server";

import Product from "@/models/server/db/Product";

import { URLParamsType } from "@/types/app-config-server";

import { apiHandler } from "@/middlewares/route-handler";

export const DELETE = async (req: NextRequest, { params: { productId, storeId } }: URLParamsType) => {
    return await apiHandler(req, async ({ mongoDbConfig, user }) => {
        await Product.delete({ id: productId, storeId }, { mongoDbConfig, user });

        return NextResponse.json("Product was successfully deleted");
    });
};

export const GET = async (req: NextRequest, { params: { productId, storeId } }: URLParamsType) => {
    return await apiHandler(req, async ({ mongoDbConfig, user }) => {
        const product = await Product.get({ productId, storeId }, { mongoDbConfig, user });

        return NextResponse.json(product);
    });
};