import { NextResponse } from "next/server";

import { apiHandler } from "@/middlewares/route-handler"

export const GET = async () => {
    return await apiHandler(async ({ mongoDbConfig, user }) => {
        const users = await mongoDbConfig.collections.USERS.find({}).toArray();
        return NextResponse.json(users);
    });
};