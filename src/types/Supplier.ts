import { ContactType } from "./contact";
import { STATUS } from ".";

export type SupplierAddressType = {
    country: string,
    city: string,
    number: number;
    province: string,
    street: string
}

export type SupplierType = {
    address: SupplierAddressType,
    contact: ContactType;
    id: string,
    name: string;
    nuit: number;
    status: STATUS
}

export type SupplierDBType = SupplierType & {
    stores: string[]
}