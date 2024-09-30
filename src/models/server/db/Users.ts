import bcrypt from "bcrypt";

import Error404 from "@/errors/server/404Error";

import { ConfigType, FiltersType } from "@/types/app-config-server"
import { SettingsType, UsernameFilterType } from "@/types/route";
import { UserType, User, USER_CATEGORY, DOCUMENT_TYPE, StoreUserType } from "@/types/user";
import { getId } from "@/helpers/id";
import { getUserProxy } from "../proxy/user";
import { getUsers } from "./User/helpers/db";
import InvalidArgumentError from "@/errors/server/InvalidArgumentError";
import { STATUS } from "@/types";
import { isValidPassword } from "@/validation/user";

class Users {

    static async get(filters: UsernameFilterType | FiltersType, { mongoDbConfig, user }: SettingsType): Promise<User> {
        const users = await getUsers(filters, { mongoDbConfig, user }) as User[];

        if(users.length === 0) throw new Error404("User not found");
        
        return users[0];
    }

    static async getAll({ filters }: { filters?: Object }, { mongoDbConfig, user }: SettingsType): Promise<UserType[]> {
        try {
            const result = await getUsers(filters, { mongoDbConfig, user }) as UserType[];
        
            const users = result.map(user => {
                const userClone = structuredClone(user)

                userClone.stores = userClone.stores.filter(store => {
                    //@ts-ignore 
                    return store.username === userClone.username
                })

                return userClone
            })
      
            return users
        } catch(e) {
            console.error(e)
        }
    }

    static async delete({ username }: UsernameFilterType, { mongoDbConfig }: SettingsType) {
        await mongoDbConfig
            .collections
            .USERS
            .deleteOne({ username });
    }

    static async register({ address, document, category, contact, firstName, lastName, username }: User, { mongoDbConfig, user }: SettingsType) {
        try {
            await this.get({ username }, { mongoDbConfig })

            throw new InvalidArgumentError("Username not available")
        } catch(e) {
            if(e instanceof InvalidArgumentError) throw e
        }

        try {
            /*if(!isValidPassword(password)) {
                throw new InvalidArgumentError("Invalid password")
            }*/
            
            const hashedPassword = await bcrypt.hash("123456", 10);

            const newUser: User = {
                address: null,
                contact: null,
                category: USER_CATEGORY.EMPLOYEE,
                document: null,
                firstName: "",
                id: getId(),
                lastName: "",
                password: hashedPassword,
                stores: [ user.stores[0].storeId ],
                username: "",
            };

            const userProxy = getUserProxy(newUser);

            userProxy.address = address;
            userProxy.contact = contact
            userProxy.document = document;
            userProxy.category = category;
            userProxy.firstName = firstName;
            userProxy.lastName = lastName;
            userProxy.username = username;

            const storeUser: StoreUserType = {
                createdAt: new Date(Date.now()).toISOString(),
                category,
                logs: [],
                status: STATUS.ACTIVE,
                username,
            }

            await mongoDbConfig
                .collections
                .USERS
                .insertOne(newUser);

            await mongoDbConfig
                .collections
                .WAREHOUSES
                .updateOne(
                    { id: user.stores[0].storeId },
                    {
                        $push: {
                            users: storeUser
                        }
                    }
                )
        } catch(e) {
            await Promise.all(
                [
                    mongoDbConfig
                        .collections
                        .USERS
                        .deleteOne(
                            { username }
                        ),
                    mongoDbConfig
                        .collections
                        .WAREHOUSES
                        .updateOne(
                            { id: user.stores[0].storeId },
                            {
                                $pull: {
                                    users: {
                                        username
                                    }
                                }
                            }
                        )
                        
                ]
            )

            throw e
        }
        
        
    }
}

export default Users;