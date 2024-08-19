import { ContactType } from "./contact";
import { Document } from "./user";

export type CustomerType = {
    contact: ContactType;
    document: Document,
    firstName: string;
    lastName: string;
}

export type GuestType = {
    document: Document,
    email?: string;
    firstName: string;
    lastName: string;
    phone?: string;
}

export type GuestDBType = GuestType & {
    stores: {
        createdAt: string,
        id: string
    }[]
}
