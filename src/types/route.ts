
import { MongoDbConfigType } from "@/types/mongoDb";
import { UserType } from "@/types/user";

export type SettingsType = {
    mongoDbConfig: MongoDbConfigType,
    user?: UserType
}


export type UsernameFilterType = {
    username: string
};