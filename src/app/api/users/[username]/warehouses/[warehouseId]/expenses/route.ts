import { NextRequest, NextResponse } from "next/server";

import { ProductType } from "@/types/product";
import { apiHandler } from "@/middlewares/route-handler";

import ExpenseModel from "@/models/server/db/";
import { ExpenseClientType } from "@/types/expense";

type URLParamsType = {
    params: {
        username: string;
        warehouseId: string;
    }
}

export const GET = async (req: NextRequest, { params: { username, warehouseId }}: URLParamsType) => {
    return await apiHandler(async ({ mongoDbConfig, user }) => {
        // const products = await ProductModel.getAll({ warehouseId }, { mongoDbConfig, user });
        // return NextResponse.json(products);
    });
};

export const POST = async (req: NextRequest, { params: { username, warehouseId }}: URLParamsType) => {
    const expense = await req.json() as ExpenseClientType;

    return await apiHandler(async ({ mongoDbConfig, user }) => {
        await ExpenseModel.register({ expense, storeId: warehouseId }, { mongoDbConfig, user });
        return NextResponse.json("Expense was successfully registed", { status: 201});
    });
};