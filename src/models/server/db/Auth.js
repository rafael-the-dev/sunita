import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { decode, verifyToken } from "@/helpers/auth";

import AuthError from "@/errors/server/AuthenticationError";
import Users  from "./Users";

class Auth {

    static async login({ password, username }, { mongoDbConfig }) {
        const user = await Users.get({ username }, { mongoDbConfig });
        const match = await bcrypt.compare(password, user.password);

        if(match) {
            const token = decode(user);

            const { _id, exp, iat, password, ...userDetails } = verifyToken(token);

            return { 
                access: {
                    expiresIn: exp,
                    token 
                },
                data: userDetails
            };
        }

        throw new AuthError("Username or password invalid.");
    }

    static async refreshToken({ token }) {
        try {
            const { _id, exp, iat, password, ...userDetails } = verifyToken(token);

            const newToken = decode(userDetails);
    
            const decodedToken = verifyToken(newToken);
    
            return { 
                access: {
                    expiresIn: decodedToken.exp,
                    token: newToken
                }
            };
        } catch(err) {
            if(err instanceof jwt.TokenExpiredError) throw new AuthError("Expired token");
            throw err;
        }
    }
}

export default Auth;