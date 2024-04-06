import { NextResponse } from "next/server";

import { apiHandler } from "@/middlewares/route-handler";

import Auth from "@/models/server/db/Auth";


export const POST = async (req) => {
    return apiHandler(async ({ mongoDbConfig, user }) => {
        const { password, username } = await req.json();
        const credentials = await Auth.login({ password, username }, { mongoDbConfig, user });
        return NextResponse.json(credentials)
    });
};