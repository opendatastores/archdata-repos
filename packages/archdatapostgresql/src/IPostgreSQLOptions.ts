export interface IPostgreSQLOptions {
  queryIDName?: string;
  queryParser?: (obj: object) => object;
}
