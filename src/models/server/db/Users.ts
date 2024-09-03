import bcrypt from "bcrypt";

import Error404 from "@/errors/server/404Error";

import { SettingsType, UsernameFilterType } from "@/types/route";
import { UserType, User, USER_CATEGORY, DOCUMENT_TYPE, StoreUserType } from "@/types/user";
import { getId } from "@/helpers/id";
import { getUserProxy } from "../proxy/user";
import InvalidArgumentError from "@/errors/server/InvalidArgumentError";
import { STATUS } from "@/types";
import { isValidPassword } from "@/validation/user";

class Users {

    static async get({ username }: UsernameFilterType, { mongoDbConfig }: SettingsType): Promise<User> {
        const user = await mongoDbConfig
            .collections
            .USERS
            .findOne({ username }) as User;

        if(!user) throw new Error404("User not found");
        
        return user;
    }

    static async getAll({ filters }: { filters?: Object }, { mongoDbConfig }: SettingsType): Promise<UserType[]> {
        try {
            const result = await mongoDbConfig
                .collections
                .WAREHOUSES
                .aggregate([
                    { 
                        $match: {
                            ...( filters ?? {} )
                        }
                    },
                    {
                        $lookup: {
                            from: "users", // Replace with the name of your external product collection
                            localField: "users.username",
                            foreignField: "username",
                            as: "user_info"
                        }
                    },
                    { $unwind: "$user_info" },
                    { $unwind: "$users" },
                    {
                        $group: {
                            _id: "$user_info.username",
                            category: { $first: "$user_info.category" },
                            firstName: { $first: "$user_info.firstName" },
                            id: { $first: "$user_info.username" },
                            lastName: { $first: "$user_info.lastName" },
                            stores: {
                                $push: {
                                    category: "$users.category",
                                    storeId: "$id",
                                    status: "$users.status",
                                    username: "$users.username"
                                }
                            },
                            username: { $first: "$user_info.username" }
                        }
                    }
                ])
                .toArray() as UserType[];
        
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

    static async register({ address, document, category, firstName, lastName, username }: User, { mongoDbConfig, user }: SettingsType) {
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
                address: {
                    block: "",
                    city: "",
                    country: "",
                    house: 0,
                    province: "",
                },
                category: USER_CATEGORY.EMPLOYEE,
                document: {
                    expireDate: "",
                    issueDate: "",
                    number: "",
                    type: DOCUMENT_TYPE.DRIVING_LICENCE,
                },
                firstName: "",
                id: getId(),
                lastName: "",
                password: hashedPassword,
                stores: [ user.stores[0].storeId ],
                username: "",
            };

            const userProxy = getUserProxy(newUser);

            userProxy.address = address;
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