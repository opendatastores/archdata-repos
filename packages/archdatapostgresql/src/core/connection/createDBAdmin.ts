import { Client, ClientConfig } from "pg";
import { IPostgreSQLConnectorConfig } from "../../IPostgreSQLConnectorConfig";
import { IEndableClient } from "./IEndableClient";

export interface IDBAdmin extends IEndableClient {
  get: () => Promise<Client>;
}

const adminConfig = (config: IPostgreSQLConnectorConfig): ClientConfig => {
  const result: ClientConfig = {};
  const { admin } = config;

  if (admin === undefined) {
    throw new Error("MISSING ADMIN CONFIG");
  } else {
    const { host, port } = config;

    result.database = "postgres";
    result.host = host;
    result.port = port || 5432;
    result.password = admin.password;
    result.user = admin.user;
  }

  return result;
};

export const createDBAdmin = (config: IPostgreSQLConnectorConfig): IDBAdmin => ((
  Config,
): IDBAdmin => {
  let ClientInstance: Client | undefined;

  const resolveInstance = async () => {
    try {
      if (ClientInstance === undefined) {
        const instance = new Client(adminConfig(Config));
        await instance.connect();
        ClientInstance = instance;
      }

      return ClientInstance;
    } catch (error) {
      throw error;
    }
  };

  const end = async () => {
    if (ClientInstance !== undefined) {
      await ClientInstance.end();

      ClientInstance = undefined;
    }
  };
  const get = () => resolveInstance();

  return {
    end,
    get,
  };
})(config);
