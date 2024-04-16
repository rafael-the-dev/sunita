import { MongoClient, Collection, Db } from "mongodb";

import { MongoDbConfigType } from "@/types/mongoDb";
import { UserType } from "@/types/user";

let mongoDBConfig: MongoDbConfigType = { 
    collections: {
        USERS: null
    },
    connection: null,
    isConnected: false ,
};

const mongoDBConnection = new MongoClient("mongodb+srv://rafael-the-dev:iH.-qJftk8g9cgc@cluster0.z64j5.mongodb.net/luis-langa-store?authMechanism=DEFAULT");
mongoDBConfig.connection = mongoDBConnection;

const closeConfig = () => {
    mongoDBConfig.isConnected = false;

    mongoDBConfig.collections = {
        USERS: null
    };
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
                USERS: clusterDB.collection<UserType>("users")
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