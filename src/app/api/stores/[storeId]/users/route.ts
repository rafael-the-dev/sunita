import { NextResponse, NextRequest } from "next/server";

import { apiHandler } from "@/middlewares/route-handler";
import { User } from "@/types/user"

import Users from "@/models/server/db/Users";

export const GET = async (req: NextRequest) => {
    return await apiHandler(
        req, 
        async ({ mongoDbConfig, user }) => {
            const users = await Users.getAll({}, { mongoDbConfig });
            return NextResponse.json(users);
        }
    );
};


export const POST = async (req: NextRequest) => {
    const newUser = (await req.json()) as User;

    return await apiHandler(
        req,
        async ({ mongoDbConfig, user }) => {
            await Users.register({  ...newUser, id: user.username, stores: [] }, { mongoDbConfig, user });

            return NextResponse.json({}, { status: 201 });
        }
    )
};