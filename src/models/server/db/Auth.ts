import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { decode, verifyToken } from "@/helpers/auth";

import AuthError from "@/errors/server/AuthenticationError";
import Error404 from "@/errors/server/404Error";

import { CredentialsType, LoginCredentialsType } from "@/types/login";
import { DecodedUserType } from "@/types/user";
import { SettingsType } from "@/types/route";
import { User } from "@/types/user";

import Users  from "./Users";
import { WarehouseType } from "@/types/warehouse";

class Auth {

    static decode(token: string) {
        const { _id, exp, iat, ...userDetails } = verifyToken<DecodedUserType>(token);

        return userDetails
    }

    static async login({ password, username }: LoginCredentialsType, { mongoDbConfig }: SettingsType): Promise<CredentialsType> {
        try {
            const users = await mongoDbConfig
                .collections
                .USERS
                .aggregate(
                    [
                        {
                            $match: { username }
                        }
                    ]
                )
                .toArray() as User[];

            if(users.length === 0) throw new AuthError("Username or password invalid.");

            const user = users[0]
            
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
                                id: "$id",
                                users: "$users",
                            }
                        }
                    ]
                )
                .toArray() as WarehouseType[]
                
            if(stores.length === 0) throw new AuthError("Username or password invalid");

           //@ts-ignore
            user.stores = stores.map((store: WarehouseType) => {
                const { category, status } = store.users.find(user => user.username === username)

                return {
                    category,
                    status,
                    storeId: store.id
                }
            })

            delete user.password;
            
            //Get new token
            const token = decode(user);

            // vefify new token to get its expiration time
            const tokenResult = verifyToken<DecodedUserType>(token);
            const { _id, exp, iat, ...userDetails } = tokenResult;

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
            const { _id, exp, iat, ...userDetails } = verifyToken<DecodedUserType>(token);

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