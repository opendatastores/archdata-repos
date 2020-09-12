import { IDataContext } from "archdatacore";
import * as IORedis from "ioredis";

export interface IRedisDataContext extends IDataContext<IORedis.Redis | IORedis.Cluster> {
}
