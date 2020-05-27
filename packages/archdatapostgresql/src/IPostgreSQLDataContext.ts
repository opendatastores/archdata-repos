import { IDataContext } from "archdatacore";
import { Client, Pool } from "pg";

export interface IPostgreSQLDataContext extends IDataContext<Pool> {
  admin: () => Promise<Client>;
  adminQueries: {
    createDB: (dbName: string) => Promise<void>;
    dropDB: (dbName: string) => Promise<void>;
  };
  close: (mode?: "all" | "client" | "admin") => Promise<void>;
}
