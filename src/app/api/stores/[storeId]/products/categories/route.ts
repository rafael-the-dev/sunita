import { NextResponse, NextRequest } from "next/server"

import { CATEGORY_STATUS, ClientCategoryRequestType } from "@/types/category";
import { URLParamsType } from "@/types/app-config-server"

import { apiHandler } from "@/middlewares/route-handler";

import Category from "@/models/server/db/Category";


export const GET = async (req: NextRequest, { params: { storeId } }: URLParamsType) => {
    const { searchParams } = req.nextUrl

    return await apiHandler(req, async ({ mongoDbConfig, user }) => {
        const status = searchParams.get("status") as CATEGORY_STATUS;

        const categories = await Category.getAll(
            { status, storeId }, 
            { collection: mongoDbConfig.collections.PRODUCTS_CATEGORIES }
        );

        return NextResponse.json(categories);
    });
};

export const POST = async (req: NextRequest, { params: { storeId } }: URLParamsType) => {
    return await apiHandler(req, async ({ mongoDbConfig, user }) => {
        const { name } = await req.json() as ClientCategoryRequestType
        
        await Category.add({ name, storeId }, { collection: mongoDbConfig.collections.PRODUCTS_CATEGORIES });

        return NextResponse.json({ message: "Category was successfully created." }, { status: 201 });
    });
};


