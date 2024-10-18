import { NextResponse, NextRequest } from "next/server";

import { URLParamsType } from "@/types/app-config-server"

import { apiHandler } from "@/middlewares/route-handler";

import Users from "@/models/server/db/Users";

export const DELETE = async (req: NextRequest, { params: { username } }: URLParamsType) => {
    return await apiHandler(req, async ({ mongoDbConfig }) => {
        await Users.delete({ username }, { mongoDbConfig });
        return NextResponse.json({});
    });
};

export const GET = async (req: NextRequest, { params: { username } }: URLParamsType) => {
    return await apiHandler(req, async ({ mongoDbConfig }) => {
        const requestedUser = await Users.get({ username }, { mongoDbConfig });
        return NextResponse.json(requestedUser);
    });
};