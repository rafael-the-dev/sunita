import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";
import * as jose from "jose"

import { DecodedUserType } from "@/types/user"

import AuthenticationError from "@/errors/server/AuthenticationError";

const privateKey = "53a0d1a4174d2e1b8de701437fe06c08891035ed4fd945aef843a75bed2ade0657b3c4ff7ecd8474cb5180b2666c0688bbe640c9eb3d39bb9f2b724a10f343c6";

export const decode = <T>(data: T): string => jwt.sign(data, privateKey, { expiresIn: "30m" });

export const verifyToken = <T>(token: string): T => jwt.verify(token, privateKey);

export const isAuthenticated = async (token: string) => {
    try {
        const result = await jose.jwtVerify(token, new TextEncoder().encode(privateKey))
        
        const { _id, exp, ...rest} = result.payload as DecodedUserType
        
        return  {
            access: {
                expiresIn: exp,
                token 
            },
            user: rest
        }
    } catch(e) {
        return false
    }
    
}

export const getToken = (req: NextRequest) => {
    const authorization = req.headers.get("authorization");

    if(!authorization) throw new AuthenticationError();

    const token = authorization.split(" ")[1];

    return token
}