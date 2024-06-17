import bcrypt from "bcrypt";

import Error404 from "@/errors/server/404Error";

import { SettingsType, UsernameFilterType } from "@/types/route";
import { UserType } from "@/types/user";
import { getId } from "@/helpers/id";

class Users {

    static async get({ username }: UsernameFilterType, { mongoDbConfig }: SettingsType): Promise<UserType> {
        const user = await mongoDbConfig
            .collections
            .USERS
            .findOne({ username }) as UserType;

        if(!user) throw new Error404("User not found");
        
        return user;
    }

    static async getAll({ filters }: { filters?: Object }, { mongoDbConfig }: SettingsType): Promise<UserType[]> {
        const users = await mongoDbConfig
            .collections
            .USERS
            .find(filters)
            .toArray() as UserType[];

        return users;
    }

    static async delete({ username }: UsernameFilterType, { mongoDbConfig }: SettingsType) {
        await mongoDbConfig.collections.USERS.deleteOne({ username });
    }

    static async register({ category, firstName, lastName, password, username }: UserType, { mongoDbConfig }: SettingsType) {
        const hashedPassword = await bcrypt.hash(password, 10);

        await mongoDbConfig.collections.USERS
            .insertOne({ 
                category,
                firstName, 
                id: getId(),
                lastName, 
                password: hashedPassword,
                username 
            });
    }
}

export default Users;