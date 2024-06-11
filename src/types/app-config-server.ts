import { MongoDbConfigType } from "./mongoDb"
import { UserType } from "./user"

export type ConfigType = { 
    mongoDbConfig: MongoDbConfigType,
    user: UserType
};

export type URLParamsType = {
    params: {
        username: string;
        warehouseId: string;
    }
}