import { DataConnector } from "archdatacore";
import { PoolConfig } from "pg";
import { createDataContext } from "./core/createDataContext";
import { IPostgreSQLConnectorConfig } from "./IPostgreSQLConnectorConfig";

export const Connector: DataConnector<IPostgreSQLConnectorConfig, PoolConfig> = (config) => ({
  connect: (options) => createDataContext(config, options),
});

Object.freeze(Connector);
