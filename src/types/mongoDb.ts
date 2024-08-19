import { MongoClient, Collection, Db } from "mongodb";

import { CategoryType } from "@/types/category"
import { CustomerType, GuestDBType } from "@/types/guest"
import { SupplierDBType } from "./Supplier";
import { User } from "./user";
import { StoreProductType } from "./product";
import { WarehouseType } from "./warehouse";

export type CollectionType = {
    CUSTOMERS: Collection<CustomerType>,
    EXPENSES_CATEGORIES: Collection<CategoryType>,
    GUESTS: Collection<GuestDBType>,
    PRODUCTS: Collection<StoreProductType>;
    PRODUCTS_CATEGORIES: Collection<CategoryType>,
    SUPPLIERS: Collection<SupplierDBType>;
    USERS: Collection<User>;
    WAREHOUSES: Collection<WarehouseType>;
}

export type MongoDbConfigType = {
    collections: CollectionType;
    isConnected: boolean;
    connection: MongoClient | null
};