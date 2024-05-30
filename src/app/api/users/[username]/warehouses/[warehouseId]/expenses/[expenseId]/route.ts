import { NextRequest, NextResponse } from "next/server";

import { apiHandler } from "@/middlewares/route-handler";

import ExpenseModel from "@/models/server/db/Expenses";
import { ExpenseClientType } from "@/types/expense";

type URLParamsType = {
    params: {
        expenseId: string;
        username: string;
        warehouseId: string;
    }
}

export const DELETE = async (req: NextRequest, { params: { expenseId, warehouseId }}: URLParamsType) => {

    return await apiHandler(req, async ({ mongoDbConfig, user }) => {
        await ExpenseModel.delete({ expenseId, storeId: warehouseId }, { mongoDbConfig, user });
        return NextResponse.json("");
    });
};

export const GET = async (req: NextRequest, { params: { expenseId, username, warehouseId }}: URLParamsType) => {
    return await apiHandler(req, async ({ mongoDbConfig, user }) => {
        // const products = await ProductModel.getAll({ warehouseId }, { mongoDbConfig, user });
        // return NextResponse.json(products);
    });
};

export const PUT = async (req: NextRequest, { params: { expenseId, warehouseId }}: URLParamsType) => {
    const expense = await req.json() as ExpenseClientType;

    return await apiHandler(req, async ({ mongoDbConfig, user }) => {
        await ExpenseModel.update({ expense, expenseId, storeId: warehouseId }, { mongoDbConfig, user });
        return NextResponse.json("Expense was successfully updated");
    });
};