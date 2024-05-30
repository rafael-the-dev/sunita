import { NextResponse, NextRequest } from "next/server";

import DefaultError from "@/errors/server/DefaultError";

import Access from "@/models/server/db/Auth";

import { MongoDbConfigType } from "@/types/mongoDb";
import { UserType } from "@/types/user";
import { getToken } from "@/helpers/auth"
import { closeDbConnections, createMongoDBConnection, mongoDBConfig } from "@/connections/mongo_db";

export type APIHandlerType = ({ user, mongoDbConfig }: { mongoDbConfig: MongoDbConfigType, user: UserType | null }) => Promise<any>;

let mongoDbConfig = {
    isConnected: false 
};

const ignorePaths = (path: string) => {
    const ignorablePaths = [
        "/auth/login",
        "/auth/refresh"
    ];
    console.log(path)
    return ignorablePaths.includes(path);
}

export const apiHandler = async (req: NextRequest, handler: APIHandlerType) => {
    try {
        let user = null;

        const replaceDomain = req.url.replace("http://localhost:3000/api", "");
        const replaceQueryParams = replaceDomain.replace( /\?[A-z0-9.+-=]*/g,"");

        if(!ignorePaths(replaceQueryParams)) {
            const token = getToken(req);
            user = Access.decode(token);
        }

        const isAuthRefreshPage = replaceQueryParams === "/auth/refresh";

        if(!mongoDBConfig.isConnected && !isAuthRefreshPage) {
            await createMongoDBConnection();
            mongoDbConfig = mongoDBConfig;
        }

        return await handler({ user, mongoDbConfig: mongoDBConfig });
    } catch(err) {
        console.error(err);

        if(err instanceof DefaultError) {
            return NextResponse.json(err.getResponse(), { status: err.status });
        }
        
        return NextResponse.json(err.message, { status: 500 });
    }
};
