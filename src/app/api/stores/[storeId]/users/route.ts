import { NextResponse, NextRequest } from "next/server";

import { apiHandler } from "@/middlewares/route-handler";
import { UserType } from "@/types/user"

import Users from "@/models/server/db/Users";

export const GET = async (req: NextRequest) => {
    return await apiHandler(req, async ({ mongoDbConfig, user }) => {
        const users = await Users.getAll({}, { mongoDbConfig });
        return NextResponse.json(users);
    });
};


export const POST = async (req: NextRequest) => {
    const { category, firstName, lastName, password, username } = await req.json() as UserType;

    return await apiHandler(req,
        async ({ mongoDbConfig, user }) => {
            await Users.register({  category, firstName, id: username, lastName, password, username }, { mongoDbConfig });
            return NextResponse.json({}, { status: 201 });
        }
    )
};