import { NextResponse } from "next/server";

import Users from "@/models/server/db/Users";

import { apiHandler } from "@/middlewares/route-handler";

export const GET = async () => {
    return await apiHandler(async ({ mongoDbConfig, user }) => {
        const users = await Users.getAll({}, { mongoDbConfig, user });
        return NextResponse.json(users);
    });
};


export const POST = async (req) => {
    const { category, firstName, lastName, password, username } = await req.json();

    return await apiHandler(
        async ({ mongoDbConfig, user }) => {
            await Users.register({  category, firstName, lastName, password, username }, { mongoDbConfig, user });
            return NextResponse.json({}, { status: 201 });
        }
    )
};