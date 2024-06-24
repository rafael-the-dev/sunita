import { STATUS } from ".";

export const enum USER_CATEGORY {
    ADMIN = "admin",
    EMPLOYEE = "employee",
    MANAGER = "manager"
}

type Store = {
    category: USER_CATEGORY;
    storeId: string;
    status: STATUS;
}

export type UserType = {
    _id?: string,
    category: string,
    firstName: string, 
    id: string,
    lastName: string,
    username: string,
    password?: string,
    stores?: Store[]
}

export type DecodedUserType = UserType &  {
    exp: number,
    iat: number
}