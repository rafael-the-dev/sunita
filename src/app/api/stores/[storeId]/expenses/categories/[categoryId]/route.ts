import { NextResponse, NextRequest } from "next/server"

import { CategoryType } from "@/types/category";
import { URLParamsType } from "@/types/app-config-server";

import { apiHandler } from "@/middlewares/route-handler";

import ExpenseCategory from "@/models/server/db/Category";


export const PUT = async (req: NextRequest, { params: { categoryId, storeId } }: URLParamsType) => {
    return await apiHandler(req, async ({ mongoDbConfig, user }) => {
        const { name, status } = await req.json() as CategoryType;

        const collection = mongoDbConfig.collections.EXPENSES_CATEGORIES
        
        await ExpenseCategory.update({ id: categoryId, name, status, storeId }, { collection });

        return NextResponse.json({ message: "Category was successfully updated." });
    });
};

