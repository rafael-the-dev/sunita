import { ContactType } from "./contact";
import { Document } from "./user";

export type CustomerType = {
    contact: ContactType;
    document: Document,
    firstName: string;
    id: string;
    lastName: string;
}

export type CustomerInfoType = CustomerType & {
    createdAt: string
}

export type GuestType = CustomerType

export type GuestDBType = GuestType & {
    stores: {
        createdAt: string,
        id: string
    }[]
}

export type StoreCustomerType = {
    createdAt: string,
    id: string
}

export type CustomersResponseType = {
    list: CustomerInfoType[]
}
