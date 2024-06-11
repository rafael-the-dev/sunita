import { MongoClient, Collection, Db } from "mongodb";

import { MongoDbConfigType } from "@/types/mongoDb";
import { UserType } from "@/types/user";
import { GblobalProductType } from "@/types/product";
import { WarehouseType } from "@/types/warehouse";
import { CategoryType } from "@/types/category";

const initialCollections = {
    EXPENSES_CATEGORIES: null,
    PRODUCTS: null,
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
                EXPENSES_CATEGORIES: clusterDB.collection<CategoryType>("expenses-categories"),
                PRODUCTS: clusterDB.collection<GblobalProductType>("products"),
                USERS: clusterDB.collection<UserType>("users"),
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