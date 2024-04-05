import { NextResponse } from "next/server";

import Users from "@/models/server/db/Users";

import { apiHandler } from "@/middlewares/route-handler";

export const DELETE = async (req, { params: { username } }) => {

    return await apiHandler(async ({ mongoDbConfig, user }) => {
        await Users.delete({ username }, { mongoDbConfig, user });
        return NextResponse.json({});
    });
};