import { NextRequest, NextResponse } from "next/server";

import { apiHandler } from "@/middlewares/route-handler";

import { ExpenseClientType } from "@/types/expense";
import { URLParamsType } from "@/types/app-config-server";

import ExpenseModel from "@/models/server/db/Expenses";

export const GET = async (req: NextRequest, { params: { username, storeId }}: URLParamsType) => {
    return await apiHandler(req, async ({ mongoDbConfig, user }) => {
        // const products = await ProductModel.getAll({ warehouseId }, { mongoDbConfig, user });
        // return NextResponse.json(products);
    });
};

export const POST = async (req: NextRequest, { params: { username, storeId }}: URLParamsType) => {
    const expense = await req.json() as ExpenseClientType;

    return await apiHandler(req, async ({ mongoDbConfig, user }) => {
        await ExpenseModel.register({ expense, storeId }, { mongoDbConfig, user });
        return NextResponse.json("Expense was successfully registed", { status: 201});
    });
};