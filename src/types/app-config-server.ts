import { MongoDbConfigType } from "./mongoDb"
import { UserType } from "./user"

export type ConfigType = { 
    mongoDbConfig: MongoDbConfigType,
    user: UserType
};

export type URLParamsType = {
    params: {
        categoryId: string,
        expenseId: string,
        productId?: string;
        username?: string;
        storeId?: string;
        saleId?: string;
    }
}