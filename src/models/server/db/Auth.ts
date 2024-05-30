import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { decode, verifyToken } from "@/helpers/auth";

import AuthError from "@/errors/server/AuthenticationError";
import Error404 from "@/errors/server/404Error";

import { CredentialsType, LoginCredentialsType } from "@/types/login";
import { DecodedUserType } from "@/types/user";
import { SettingsType } from "@/types/route";

import Users  from "./Users";

class Auth {

    static decode(token: string) {
        const { _id, exp, iat, password, ...userDetails } = verifyToken<DecodedUserType>(token);
        return userDetails
    }

    static async login({ password, username }: LoginCredentialsType, { mongoDbConfig }: SettingsType): Promise<CredentialsType> {
        try {
            const user = await Users.get({ username }, { mongoDbConfig });
        
            const match = await bcrypt.compare(password, user.password);

            if(match) {
                //Get new token
                const token = decode(user);

                // vefify new token to get its expiration time
                const tokenResult = verifyToken<DecodedUserType>(token);
                const { _id, exp, iat, password, ...userDetails } = tokenResult;

                return { 
                    access: {
                        expiresIn: exp,
                        token 
                    },
                    user: userDetails
                };
            }

            throw new AuthError("Username or password invalid.");   
        } catch(e) {
            if(e instanceof Error404) throw new AuthError("Username or password invalid.");   

            throw e;
        }
    }

    /** 
     * Refresh current token 5 min before it expires
     * 
     */
    static async refreshToken({ token }: { token: string }): Promise<CredentialsType> {
        try {
            const { _id, exp, iat, password, ...userDetails } = verifyToken<DecodedUserType>(token);

            //Get new token
            const newToken = decode(userDetails);
    
            // vefify new token to get its expiration time
            const decodedToken = verifyToken<DecodedUserType>(newToken);
    
            return { 
                access: {
                    expiresIn: decodedToken.exp,
                    token: newToken
                },
                user: userDetails
            };
        } catch(err) {
            if(err instanceof jwt.TokenExpiredError) throw new AuthError("Expired token");
            throw err;
        }
    }
}

export default Auth;