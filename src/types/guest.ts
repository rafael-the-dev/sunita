import { Document } from "./user";

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