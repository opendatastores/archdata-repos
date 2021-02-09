import { IRedisConnectOptions } from "./IRedisConnectOptions";

export interface IRedisConnectorConfig {
  connection: {
    host?: string;
    port: number;
  }[] | {
    host?: string;
    port?: number;
  };
  options?: IRedisConnectOptions;
}
