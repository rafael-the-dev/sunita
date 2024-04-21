import { MongoDbConfigType } from "./mongoDb"
import { UserType } from "./user"

export type ConfigType = { 
    mongoDbConfig: MongoDbConfigType,
    user: UserType
};