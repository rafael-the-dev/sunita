import { MongoClient, Collection, Db } from "mongodb";

import { CategoryType } from "@/types/category"
import { GuestDBType } from "@/types/guest"
import { SupplierDBType } from "./Supplier";
import { User } from "./user";
import { GblobalProductType } from "./product";
import { WarehouseType } from "./warehouse";

export type CollectionType = {
    EXPENSES_CATEGORIES: Collection<CategoryType>,
    GUESTS: Collection<GuestDBType>,
    PRODUCTS: Collection<GblobalProductType>;
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