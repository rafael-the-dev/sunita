import { NextResponse, NextRequest } from "next/server"

import { CATEGORY_STATUS, ClientCategoryRequestType } from "@/types/category";
import { URLParamsType } from "@/types/app-config-server"

import { apiHandler } from "@/middlewares/route-handler";

import ExpenseCategory from "@/models/server/db/ExpenseCategory";


export const GET = async (req: NextRequest, { params: { username, warehouseId } }: URLParamsType) => {
    const { searchParams } = req.nextUrl

    return await apiHandler(req, async ({ mongoDbConfig, user }) => {
        const status = searchParams.get("status") as CATEGORY_STATUS;

        const categories = await ExpenseCategory.getAll({ status, storeId: warehouseId }, { mongoDbConfig, user });

        return NextResponse.json(categories);
    });
};

export const POST = async (req: NextRequest, { params: { username, warehouseId } }: URLParamsType) => {
    return await apiHandler(req, async ({ mongoDbConfig, user }) => {
        const { name } = await req.json() as ClientCategoryRequestType
        
        await ExpenseCategory.add({ name, storeId: warehouseId }, { mongoDbConfig, user });

        return NextResponse.json({ message: "Category was successfully created." }, { status: 201 });
    });
};


