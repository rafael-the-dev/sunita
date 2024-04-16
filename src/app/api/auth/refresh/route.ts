import { NextResponse, NextRequest } from "next/server";

import { apiHandler } from "@/middlewares/route-handler";

import Auth from "@/models/server/db/Auth";

export const GET = async (req: NextRequest) => {
    const { searchParams } = req.nextUrl
    const token = searchParams.get('token');

    return apiHandler(async ({ mongoDbConfig, user }) => {
        const credentials = await Auth.refreshToken({ token });
        return NextResponse.json(credentials);
    });
};