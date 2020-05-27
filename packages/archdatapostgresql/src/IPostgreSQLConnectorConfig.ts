export interface IPostgreSQLConnectorConfig {
  connectionString?: string;
  host?: string;
  port?: number;
  database?: string;
  user?: string;
  password?: string;
  admin?: {
    user: string;
    password: string;
  };
  newIDFunc?: () => any;
  [key: string]: any;
}
