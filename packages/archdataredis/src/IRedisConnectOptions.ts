import { RedisOptions } from "ioredis";

export interface IRedisConnectOptions extends RedisOptions {
  [key: string]: any;
}
