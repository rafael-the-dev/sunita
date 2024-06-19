import { NextRequest, NextResponse } from "next/server";

import { apiHandler } from "@/middlewares/route-handler";

import { ExpenseClientType } from "@/types/expense";
import { URLParamsType } from "@/types/app-config-server";

import ExpenseModel from "@/models/server/db/Expenses";

export const DELETE = async (req: NextRequest, { params: { expenseId, storeId }}: URLParamsType) => {

    return await apiHandler(req, async ({ mongoDbConfig, user }) => {
        await ExpenseModel.delete({ expenseId, storeId }, { mongoDbConfig, user });
        
        return NextResponse.json("");
    });
};

export const GET = async (req: NextRequest, { params: { expenseId, username, storeId }}: URLParamsType) => {
    return await apiHandler(req, async ({ mongoDbConfig, user }) => {
        // const products = await ProductModel.getAll({ storeId }, { mongoDbConfig, user });
        // return NextResponse.json(products);
    });
};

export const PUT = async (req: NextRequest, { params: { expenseId, storeId }}: URLParamsType) => {
    const expense = await req.json() as ExpenseClientType;

    return await apiHandler(req, async ({ mongoDbConfig, user }) => {
        await ExpenseModel.update({ expense, expenseId, storeId }, { mongoDbConfig, user });

        return NextResponse.json("Expense was successfully updated");
    });
};