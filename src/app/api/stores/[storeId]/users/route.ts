import { NextResponse, NextRequest } from "next/server";

import { apiHandler } from "@/middlewares/route-handler";
import { User, UserType } from "@/types/user"

import Users from "@/models/server/db/Users";

export const GET = async (req: NextRequest) => {
    return await apiHandler(req, async ({ mongoDbConfig, user }) => {
        const users = await Users.getAll({}, { mongoDbConfig });
        return NextResponse.json(users);
    });
};


export const POST = async (req: NextRequest) => {
    const { address, document, category, firstName, lastName, password, username } = await req.json() as User;

    return await apiHandler(req,
        async ({ mongoDbConfig, user }) => {
            await Users.register({  address, document, category, firstName, id: username, lastName, password, stores: [], username }, { mongoDbConfig, user });
            return NextResponse.json({}, { status: 201 });
        }
    )
};