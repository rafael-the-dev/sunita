import { NextResponse, NextRequest } from "next/server"

import { CategoryType } from "@/types/category";

import { apiHandler } from "@/middlewares/route-handler";

import Category from "@/models/server/db/Category";

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
        
        await Category.update(
            { id: categoryId, name, status, storeId: warehouseId }, 
            { collection: mongoDbConfig.collections.PRODUCTS_CATEGORIES }
        );

        return NextResponse.json({ message: "Category was successfully updated." });
    });
};

