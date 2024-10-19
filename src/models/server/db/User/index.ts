
import { FiltersType } from "@/types/app-config-server";
import { SettingsType } from "@/types/route";
import { UserType, User } from "@/types/user";

import { getUsers } from "./connections/db";
import { getUserProxy } from "../../proxy/user";
import { getCategories } from "@/helpers/user";

import Error404 from "@/errors/server/404Error";
import InvalidArgumentError from "@/errors/server/InvalidArgumentError";

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

    static async update({ address, document, category, contact, firstName, lastName, username }: User, { mongoDbConfig, user }: SettingsType) {
        if(!getCategories(user.category).includes(category)) throw new InvalidArgumentError("You don't have access to set this category")
        
        let userDetails: UserType = await this.get({ username }, { mongoDbConfig })

        try {
            const userUpdates: User = {
                address: null,
                contact: null,
                category: null,
                document: null,
                firstName: "",
                id: "",
                lastName: "",
                password: null,
                stores: [],
                username: "",
            };

            const userProxy = getUserProxy(userUpdates);

            userProxy.address = address;
            userProxy.contact = contact
            userProxy.document = document;
            userProxy.category = category;
            userProxy.firstName = firstName;
            userProxy.lastName = lastName;
            userProxy.username = username;

            await mongoDbConfig
                .collections
                .USERS
                .updateOne(
                    { username },
                    {
                        $set: {
                            address,
                            contact, category,
                            document,
                            firstName,
                            lastName
                        }
                    }
                );
        } catch(e) {
            await mongoDbConfig
                .collections
                .USERS
                .updateOne(
                    { username },
                    {
                        $set: {
                            address: userDetails.address,
                            contact: userDetails.contact, 
                            category: userDetails.category,
                            document: userDetails.document,
                            firstName: firstName,
                            lastName: userDetails.lastName
                        }
                    }
                );
        }
        
        
    }
}

export default Users