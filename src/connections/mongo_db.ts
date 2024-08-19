import { MongoClient, Collection, Db } from "mongodb";

import { CustomerType, GuestDBType } from "@/types/guest";
import { MongoDbConfigType } from "@/types/mongoDb";
import { User } from "@/types/user";
import { StoreProductType } from "@/types/product";
import { WarehouseType } from "@/types/warehouse";
import { CategoryType } from "@/types/category";
import { SupplierDBType } from "@/types/Supplier";

const initialCollections = {
    CUSTOMERS: null,
    EXPENSES_CATEGORIES: null,
    GUESTS: null,
    PRODUCTS: null,
    PRODUCTS_CATEGORIES: null,
    SUPPLIERS: null,
    USERS: null,
    WAREHOUSES: null,
}

let mongoDBConfig: MongoDbConfigType = { 
    collections: initialCollections,
    connection: null,
    isConnected: false ,
};

const mongoDBConnection = new MongoClient("mongodb+srv://rafael-the-dev:iH.-qJftk8g9cgc@cluster0.z64j5.mongodb.net/luis-langa-store?authMechanism=DEFAULT");
mongoDBConfig.connection = mongoDBConnection;

const closeConfig = () => {
    mongoDBConfig.isConnected = false;
    mongoDBConfig.collections = initialCollections;
};

const closeDbConnections = async () =>  await mongoDBConnection.close();

const createMongoDBConnection = async () => {
    //const dbCollections = process.env.MONGO_DB.collections;
    let clusterDB: Db;

    try {

        mongoDBConnection.on("connectionCreated", () => {
            mongoDBConfig.isConnected = true;
            clusterDB = mongoDBConnection.db("luis-langa-store");
            
            mongoDBConfig.collections = {
                CUSTOMERS: clusterDB.collection<CustomerType>("clients"),
                EXPENSES_CATEGORIES: clusterDB.collection<CategoryType>("expenses-categories"),
                GUESTS: clusterDB.collection<GuestDBType>("guests"),
                PRODUCTS: clusterDB.collection<StoreProductType>("products"),
                PRODUCTS_CATEGORIES: clusterDB.collection<CategoryType>("products-categories"),
                SUPPLIERS: clusterDB.collection<SupplierDBType>("suppliers"),
                USERS: clusterDB.collection<User>("users"),
                WAREHOUSES: clusterDB.collection<WarehouseType>("warehouses")
            };

        });

        mongoDBConnection.on("error", () => {
            closeConfig();
        });

        mongoDBConnection.on("close", () => {
            closeConfig();
        });

        await mongoDBConnection.connect();
        console.log('Connected successfully to mongodb server');
    } catch(err) {
       closeDbConnections();
        throw err;
    }
    return clusterDB;
};

export { 
    closeDbConnections,
    createMongoDBConnection, 
    mongoDBConfig 
};