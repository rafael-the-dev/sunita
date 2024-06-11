import { MongoClient, Collection, Db } from "mongodb";

import { CategoryType as ExpenseCategory } from "@/types/category"
import { UserType } from "./user";
import { ProductType, GblobalProductType } from "./product";
import { WarehouseType } from "./warehouse";

export type CollectionType = {
    EXPENSES_CATEGORIES: Collection<ExpenseCategory>,
    PRODUCTS: Collection<GblobalProductType>;
    USERS: Collection<UserType>;
    WAREHOUSES: Collection<WarehouseType>;
}

export type MongoDbConfigType = {
    collections: CollectionType;
    isConnected: boolean;
    connection: MongoClient | null
};