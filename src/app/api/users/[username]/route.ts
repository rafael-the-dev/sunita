import { NextResponse, NextRequest } from "next/server";

import Users from "@/models/server/db/Users";

import { apiHandler } from "@/middlewares/route-handler";

type URLParamsType = {
    params: {
        username: string
    }
}

export const DELETE = async (req: NextRequest, { params: { username } }: URLParamsType) => {
    return await apiHandler(async ({ mongoDbConfig }) => {
        await Users.delete({ username }, { mongoDbConfig });
        return NextResponse.json({});
    });
};

export const GET = async (req: NextRequest, { params: { username } }: URLParamsType) => {
    return await apiHandler(async ({ mongoDbConfig }) => {
        const requestedUser = await Users.get({ username }, { mongoDbConfig });
        return NextResponse.json(requestedUser);
    });
};