import {
  Pool,
  PoolClient,
  PoolConfig,
} from "pg";
import { IPostgreSQLConnectorConfig } from "../../IPostgreSQLConnectorConfig";
import { IEndableClient } from "./IEndableClient";

export interface IDBClientPool extends IEndableClient {
  connect: () => Promise<PoolClient>;
  get: () => Pool;
}

const resolveConfig = (config: IPostgreSQLConnectorConfig, options: PoolConfig): PoolConfig => {
  const Config: PoolConfig = Object.assign({}, config, options);

  return Config;
};

export const createDBClientPool = (config: IPostgreSQLConnectorConfig, options: PoolConfig = {}): IDBClientPool => ((Config, Opts): IDBClientPool => {
  let PoolInstance: Pool | undefined;

  const resolveInstance = () => {
    if (PoolInstance === undefined) {
      PoolInstance = new Pool(resolveConfig(Config, Opts));
    }

    return PoolInstance;
  };

  const ClientPool = {
    connect: async () => resolveInstance().connect(),
    end: async () => {
      if (PoolInstance !== undefined) {
        await PoolInstance.end();

        PoolInstance = undefined;
      }
    },
    get: () => resolveInstance(),
  };

  Object.freeze(ClientPool);

  return ClientPool;
})(config, options);
