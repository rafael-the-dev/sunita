import { NextResponse } from "next/server";

import DefaultError from "@/errors/server/DefaultError";

//const Access = require("src/models/server/Acess");

import { closeDbConnections, createMongoDBConnection, mongoDBConfig } from "@/connections/mongo_db";
import { MongoDbConfigType } from "@/types/mongoDb";
import { UserType } from "@/types/user";
//const RtComercial = require("src/connections/import-data");

export type APIHandlerType = ({ user, mongoDbConfig }: { mongoDbConfig: MongoDbConfigType, user: UserType | null }) => Promise<any>;

let mongoDbConfig = {
    isConnected: false 
};


export const apiHandler = async (handler: APIHandlerType) => {
    if(!mongoDBConfig.isConnected) {
        await createMongoDBConnection();
        mongoDbConfig = mongoDBConfig
    }
    //const { authorization } = req.headers;
    
    //const { token } = cookie.parse(req.headers.cookie ?? "");

    try {
        /*res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader(
            "Access-Control-Allow-Headers",
            "Origin, X-Requested-With, Content-Type, Accept, Authorization"
        );

        if (req.method === "OPTIONS") {
            res.setHeader("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
            return res.status(200).json({});
        }*/

        let user = null;
        
        /*if(!hasFreeAccess(req)) {
            user = Access.getUser(authorization ?? token);
        } */ 

        return await handler({ user, mongoDbConfig: mongoDBConfig });
    } catch(err) {
        console.error(err);

        if(err instanceof DefaultError) {
            return NextResponse.json(err.getResponse(), { status: err.status });
        }
        
        return NextResponse.json(err.message, { status: 500 });
    }
};
