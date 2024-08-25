import { MongoClient, Collection, Db } from "mongodb";

import { BookingDBType } from "@/types/booking"
import { CategoryType } from "@/types/category"
import { CustomerType, GuestType } from "@/types/guest"
import { SupplierDBType } from "./Supplier";
import { User } from "./user";
import { StoreProductType } from "./product";
import { WarehouseType } from "./warehouse";
import { PropertyType } from "./property";

export type CollectionType = {
    BOOKINGS: Collection<BookingDBType>,
    CUSTOMERS: Collection<CustomerType>,
    EXPENSES_CATEGORIES: Collection<CategoryType>,
    GUESTS: Collection<GuestType>,
    PRODUCTS: Collection<StoreProductType>;
    PROPERTIES: Collection<PropertyType>,
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