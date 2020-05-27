import { DataConnector } from "archdatacore";
import { MongoClientOptions } from "mongodb";
import { createMongoDBContext } from "./core/createMongoDBContext";
import { IMongoDBConnectOptions } from "./IMongoDBConnectOptions";
import { IMongoDBConnectorConfig } from "./IMongoDBConnectorConfig";

const DefaultOptions: MongoClientOptions = {
  useUnifiedTopology: true,
};

export const Connector: DataConnector<IMongoDBConnectorConfig, IMongoDBConnectOptions> = (config) => ({
  connect: (options = {}) => createMongoDBContext(config, Object.assign({}, DefaultOptions, options)),
});

Object.freeze(Connector);
