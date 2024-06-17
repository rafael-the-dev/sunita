import { NextResponse, NextRequest } from "next/server";

import { apiHandler } from "@/middlewares/route-handler";

import Users from "@/models/server/db/Users";

type GetMethodParamsType = {
    params: {
        storeId: string
    }
}

export const GET = async (req: NextRequest,  { params: { storeId } }: GetMethodParamsType) => {
    return await apiHandler(req, async ({ mongoDbConfig, user }) => {
        const filters = {
            stores:{ $in: [ storeId ] }
        }

        const users = await Users.getAll({ filters }, { mongoDbConfig });

        return NextResponse.json(users);
    });
};