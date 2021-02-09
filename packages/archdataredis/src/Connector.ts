import { DataConnector } from "archdatacore";
import { createRedisContext } from "./core/createRedisContext";
import { IRedisConnectOptions } from "./IRedisConnectOptions";
import { IRedisConnectorConfig } from "./IRedisConnectorConfig";

export const Connector: DataConnector<IRedisConnectorConfig, IRedisConnectOptions> = (config) => ({
  connect: (options = {}) => createRedisContext(config, Object.assign({}, config.options || {}, options)),
});

Object.freeze(Connector);
