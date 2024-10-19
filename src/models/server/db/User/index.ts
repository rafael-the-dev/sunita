
import { FiltersType } from "@/types/app-config-server";
import { SettingsType } from "@/types/route";
import { UserType } from "@/types/user";

import { getUsers } from "./connections/db";

import Error404 from "@/errors/server/404Error";

class Users {
    
    static async get(filters: FiltersType, { mongoDbConfig, user }: SettingsType) {
        const users = await getUsers(filters, { mongoDbConfig, user });

        if(users.length === 0) throw new Error404("User not found");
        
        return users[0];
    }

    static async getAll(filters: FiltersType, { mongoDbConfig, user }: SettingsType): Promise<UserType[]> {
        const users = await getUsers(filters, { mongoDbConfig, user });
    
        return users
    }
}

export default Users