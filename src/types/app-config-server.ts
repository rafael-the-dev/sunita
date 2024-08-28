import { MongoDbConfigType } from "./mongoDb"
import { UserType } from "./user"

export type ConfigType = { 
    mongoDbConfig: MongoDbConfigType,
    user: UserType
};

export type FiltersType = Record<string, any>

export type URLParamsType = {
    params: {
        bookingId?: string,
        categoryId: string,
        clientId?: string,
        expenseId: string,
        productId?: string;
        propertyId?: string;
        username?: string;
        roomId?: string;
        storeId?: string;
        saleId?: string;
        supplierId?: string;
    }
}