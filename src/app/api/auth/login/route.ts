import { NextResponse, NextRequest } from "next/server";

import { apiHandler } from "@/middlewares/route-handler";

import Auth from "@/models/server/db/Auth";

import { CredentialsType, LoginCredentialsType } from "@/types/login";

export const POST = async (req: NextRequest): Promise<CredentialsType> => {
    return apiHandler(req, async ({ mongoDbConfig }) => {
        const { password, username } = await req.json() as LoginCredentialsType;
        const credentials = await Auth.login({ password, username }, { mongoDbConfig });
        return NextResponse.json(credentials);
    });
};