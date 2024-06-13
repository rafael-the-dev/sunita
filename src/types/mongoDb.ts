import { MongoClient, Collection, Db } from "mongodb";

import { CategoryType } from "@/types/category"
import { UserType } from "./user";
import { ProductType, GblobalProductType } from "./product";
import { WarehouseType } from "./warehouse";

export type CollectionType = {
    EXPENSES_CATEGORIES: Collection<CategoryType>,
    PRODUCTS: Collection<GblobalProductType>;
    PRODUCTS_CATEGORIES: Collection<CategoryType>,
    USERS: Collection<UserType>;
    WAREHOUSES: Collection<WarehouseType>;
}

export type MongoDbConfigType = {
    collections: CollectionType;
    isConnected: boolean;
    connection: MongoClient | null
};