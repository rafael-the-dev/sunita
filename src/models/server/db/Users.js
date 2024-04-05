import bcrypt from "bcrypt";

import { getId } from "@/helpers/id"

class Users {

    static async getAll({}, { mongoDbConfig }) {
        const users = await mongoDbConfig.collections.USERS.find({}).toArray();
        return users;
    }

    static async delete({ username }, { mongoDbConfig }) {
        await mongoDbConfig.collections.USERS.deleteOne({ username });
    }

    static async register({ category, firstName, lastName, password, username }, { mongoDbConfig }) {
        const hashedPassword = await bcrypt.hash(password, 10);

        await mongoDbConfig.collections.USERS
            .insertOne({ 
                category,
                firstName, 
                lastName, 
                password: hashedPassword,
                username 
            });
    }
}

export default Users;