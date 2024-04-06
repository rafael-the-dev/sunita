import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { verifyToken } from "@/helpers/auth";

import AuthError from "@/errors/server/AuthenticationError";
import Users  from "./Users";

class Auth {

    static async login({ password, username }, { mongoDbConfig }) {
        const user = await Users.get({ username }, { mongoDbConfig });
        const match = await bcrypt.compare(password, user.password);

        if(match) {
            const privateKey = "53a0d1a4174d2e1b8de701437fe06c08891035ed4fd945aef843a75bed2ade0657b3c4ff7ecd8474cb5180b2666c0688bbe640c9eb3d39bb9f2b724a10f343c6";
            const token = jwt.sign(user, privateKey, { expiresIn: 30 });

            const { _id, exp, iat, password, ...userDetails } =verifyToken(token);

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
}

export default Auth;