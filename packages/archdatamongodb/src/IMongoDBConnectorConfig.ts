import { MongoClientOptions } from "mongodb";

export interface IMongoDBConnectorConfig {
  connection: string;
  dbName: string;
  options?: MongoClientOptions;
}
