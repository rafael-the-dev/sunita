import { NextResponse } from "next/server";

import { apiHandler } from "@/middlewares/route-handler";

import Auth from "@/models/server/db/Auth";

export const GET = async (req) => {
    const { searchParams } = req.nextUrl
    const token = searchParams.get('token');

    return apiHandler(async ({ mongoDbConfig, user }) => {
        const credentials = await Auth.refreshToken({ token }, { mongoDbConfig, user });
        return NextResponse.json(credentials);
    });
};