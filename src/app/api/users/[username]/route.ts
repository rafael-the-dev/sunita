import { NextResponse, NextRequest } from "next/server";

import { URLParamsType } from "@/types/app-config-server"

import { apiHandler } from "@/middlewares/route-handler";

import Users from "@/models/server/db/User";

export const GET = async (req: NextRequest, { params: { username } }: URLParamsType) => {
    return await apiHandler(
        req, 
        async (config) => {
            const requestedUser = await Users.get({ username }, config);
            
            return NextResponse.json(requestedUser);
        }
    );
};

export const PUT = async (req: NextRequest, { params: { username } }: URLParamsType) => {
    return await apiHandler(
        req, 
        async (config) => {
            const user = await req.json()

            await Users.update(user, config);
            
            return NextResponse.json({ message: "User was successfully updated" });
        }
    );
};