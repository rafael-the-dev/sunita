import { AddressType } from "./address"
import { STATUS } from ".";
import { ContactType } from "./contact";

export enum USER_CATEGORY {
    ADMIN = "admin",
    CLIENT = "client",
    EMPLOYEE = "employee",
    MANAGER = "manager",
    SYSTEM_ADMIN = "system-admin",
    SYSTEM_MANAGER = "system-manager"
}

export enum DOCUMENT_TYPE {
    BI = "bi",
    DRIVING_LICENCE = "driving-licence",
    PASSPORT = "passport"
}

type BaseStore = {
    category: USER_CATEGORY;
    status: STATUS;
}

type Store = BaseStore & {
    storeId: string;
}

export type StoreUserType = BaseStore & {
    createdAt: Date | string;
    logs: [];
    username: string;
}

export type BaseUserType = {
    category: USER_CATEGORY,
    firstName: string, 
    id: string,
    lastName: string,
    username: string
}

export type UserType = BaseUserType & {
    _id?: string,
    address: AddressType,
    contact: ContactType;
    document: Document;
    stores: Store[]
}

export type DecodedUserType = UserType &  {
    exp: number,
    iat: number
}

export type Document = {
    expireDate: string;
    issueDate: string;
    type: DOCUMENT_TYPE;
    number: string;
}

export type User = BaseUserType & {
    address: AddressType,
    contact: ContactType;
    document: Document;
    password: string;
    stores: string[]
}