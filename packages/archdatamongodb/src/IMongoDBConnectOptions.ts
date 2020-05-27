import { MongoClientOptions } from "mongodb";

export interface IMongoDBConnectOptions extends MongoClientOptions {
  [key: string]: any;
}
