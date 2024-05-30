import { NextRequest } from "next/server";

import { verifyToken } from "@/helpers/auth"

import { DecodedUserType } from "@/types/user";

import AuthenticationError from "@/errors/server/AuthenticationError";

const ignorePaths = (path: string) => {
    const ignorablePaths = [
        "/auth/login",
        "/auth/refresh"
    ];
    
    return ignorablePaths.includes(path);
}

export const getUserEncodedDetails = (req: NextRequest) => {
    let user = null;

    const replaceDomain = req.url.replace("http://localhost:3000/api", "");
    const replaceQueryParams = replaceDomain.replace( /\?[A-z0-9.+-=]*/g,"");

    if(!ignorePaths(replaceQueryParams)) {
        const authorization = req.headers.get("authorization");

        if(!authorization) throw new AuthenticationError()

        const token = authorization.split(" ")[1]
        user = verifyToken<DecodedUserType>(token)
    }

    return user
}