import { IPostgreSQLOptions } from "../IPostgreSQLOptions";

type Item = { [key: string]: any; }

export const SQLParser = {
  insertItem: (collection: string, item: Item, options?: any) => {
    const { columns, orders, values } = SQLParser.parseFromItem(item);

    return {
      text: `INSERT INTO ${collection}(${columns}) VALUES(${orders}) RETURNING *`,
      values,
    };
  },
  parseFromItem: (item: Item) => {
    const keys = Object.keys(item);

    return {
      columns: keys.join(","),
      orders: keys.map((each, index) => `$${index + 1}`).join(","),
      values: keys.map((each) => item[each]),
    };
  },
  queryByID: (collection: string, id: string, options: any = {}) => {
    const { queryIDName = "_id" } = options as IPostgreSQLOptions;

    return {
      text: `SELECT * FROM ${collection} WHERE ${queryIDName} = $1`,
      values: [id],
    };
  },
  removeByID: (collection: string, id: string, options: any = {}) => {
    const { queryIDName = "_id" } = options as IPostgreSQLOptions;

    return {
      text: `DELETE FROM ${collection} WHERE ${queryIDName} = $1`,
      values: [id],
    };
  },
};
