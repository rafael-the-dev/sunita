import { MongoClient, Collection, Db } from "mongodb";
import { UserType } from "./user";

export type CollectionType = {
    USERS: Collection<UserType>
}

export type MongoDbConfigType = {
    collections: CollectionType;
    isConnected: boolean;
    connection: MongoClient | null
};