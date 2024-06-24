import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { decode, verifyToken } from "@/helpers/auth";

import AuthError from "@/errors/server/AuthenticationError";
import Error404 from "@/errors/server/404Error";

import { CredentialsType, LoginCredentialsType } from "@/types/login";
import { DecodedUserType, USER_CATEGORY } from "@/types/user";
import { SettingsType } from "@/types/route";

import Users  from "./Users";
import { STATUS } from "@/types";
import { toISOString } from "@/helpers/date";
import { WarehouseType } from "@/types/warehouse";

class Auth {

    static decode(token: string) {
        const { _id, exp, iat, password, ...userDetails } = verifyToken<DecodedUserType>(token);
        return userDetails
    }

    static async login({ password, username }: LoginCredentialsType, { mongoDbConfig }: SettingsType): Promise<CredentialsType> {
        try {
            const user = await Users.get({ username }, { mongoDbConfig });

            const match = await bcrypt.compare(password, user.password);

            if(!match) throw new AuthError("Username or password invalid.");

            const stores = await mongoDbConfig
                .collections
                .WAREHOUSES
                .aggregate(
                    [
                        {
                            $match: {
                                "users.username": username 
                            }
                        },
                        {
                            $project: {
                                _id: "$_id",
                                users: "$users",
                            }
                        }
                    ]
                )
                .toArray() as WarehouseType[]
                
            if(stores.length === 0) throw new AuthError("Username or password invalid");

            user.stores = stores.map((store: WarehouseType) => {
                const { category, status } = store.users.find(user => user.username === username)

                return {
                    category,
                    status,
                    storeId: store.id ?? "12345"
                }
            })
            
            //Get new token
            const token = decode(user);

            // vefify new token to get its expiration time
            const tokenResult = verifyToken<DecodedUserType>(token);
            const { _id, exp, iat, ...userDetails } = tokenResult;
            delete userDetails.password

            return { 
                access: {
                    expiresIn: exp,
                    token 
                },
                user: userDetails
            };

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