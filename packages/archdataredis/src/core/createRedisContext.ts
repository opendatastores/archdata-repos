import * as IORedis from "ioredis";
import { IRedisConnectOptions } from "../IRedisConnectOptions";
import { IRedisConnectorConfig } from "../IRedisConnectorConfig";
import { IRedisDataContext } from "../IRedisDataContext";

class NotSupportedFunctionError extends Error {
  constructor() {
    super("NotSupportedFunctionError - Not Supported Function Error");
  }
}

export const createRedisContext = (Config: IRedisConnectorConfig, Options: IRedisConnectOptions) => {
  const ConnectClient = (() => {
    let _DBClient: IORedis.Cluster | IORedis.Redis;

    return async () => {
      if (_DBClient === undefined) {
        const { connection } = Config;
        if (Array.isArray(connection)) {
          _DBClient = new IORedis.Cluster(connection, Options);
        } else {
          _DBClient = new IORedis(connection.port, connection.host, Options);
        }
      }

      return _DBClient;
    };
  })();

  const dataContext: IRedisDataContext = {
    client: async () =>
      ConnectClient(),
    db: async () => {
      throw new NotSupportedFunctionError();
    },
    newID: () => {
      throw new NotSupportedFunctionError();
    },
    close: async () => {
      const client = await ConnectClient();
      client.disconnect();
    },
    createItem: async (collection, item, options = {}) => {
      throw new NotSupportedFunctionError();
    },
    queryByID: async (collection, id, options = {}) => {
      throw new NotSupportedFunctionError();
    },
    removeByID: async (collection, id, options = {}) => {
      throw new NotSupportedFunctionError();
    },
    toRepository: (collection, defaultOptions = {}) => {
      throw new NotSupportedFunctionError();
    },
  };

  return dataContext;
};

Object.freeze(createRedisContext);
