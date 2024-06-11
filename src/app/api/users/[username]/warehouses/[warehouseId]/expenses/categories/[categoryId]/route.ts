import { NextResponse, NextRequest } from "next/server"

import { CategoryType, ClientCategoryRequestType } from "@/types/category";

import { apiHandler } from "@/middlewares/route-handler";

import ExpenseCategory from "@/models/server/db/ExpenseCategory";

type PUTParamsType = {
    params: {
        categoryId: string,
        username: string,
        warehouseId: string,
    }
}

export const PUT = async (req: NextRequest, { params: { categoryId, warehouseId } }: PUTParamsType) => {
    return await apiHandler(req, async ({ mongoDbConfig, user }) => {
        const { name, status } = await req.json() as CategoryType
        
        await ExpenseCategory.update({ id: categoryId, name, status, storeId: warehouseId }, { mongoDbConfig, user });

        return NextResponse.json({ message: "Category was successfully updated." });
    });
};

