import { NextResponse, NextRequest } from "next/server";

import Product from "@/models/server/db/Product";

import { URLParamsType } from "@/types/app-config-server";

import { apiHandler } from "@/middlewares/route-handler";
import { ProductInfoType } from "@/types/product";

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

export const PUT = async (req: NextRequest, { params: { productId, storeId } }: URLParamsType) => {
    return await apiHandler(req, async ({ mongoDbConfig, user }) => {
        const product = await req.json() as ProductInfoType
        product.id = productId

        //if(product.id !== productId) return NextResponse.json({ message: "Product ID and product query param does not match" }, { status: 400 })

        await Product.update({ product, storeId }, { mongoDbConfig, user });

        return NextResponse.json({ message: "Product was successfully registered" });
    });
};