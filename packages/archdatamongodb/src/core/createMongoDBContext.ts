import { MongoClient, ObjectID } from "mongodb";
import { IMongoDBConnectOptions } from "../IMongoDBConnectOptions";
import { IMongoDBConnectorConfig } from "../IMongoDBConnectorConfig";
import { IMongoDBDataContext } from "../IMongoDBDataContext";

export const createMongoDBContext = (config: IMongoDBConnectorConfig, Options: IMongoDBConnectOptions) => {
  const ConnectClient = (() => {
    let _DBClient: MongoClient;

    return async () => {
      if (_DBClient === undefined) {
        const URI = config.connection;
        _DBClient = new MongoClient(URI, Options);
        await _DBClient.connect();
      }

      return _DBClient;
    };
  })();

  const ConnectDB = async () => {
    const client = await ConnectClient();
    const { dbName } = config;
    const DBInstance = client.db(dbName);

    return DBInstance;
  };

  const ConnectCollection = async (collection: string) => {
    const DBInstance = await ConnectDB();

    return DBInstance.collection(collection);
  };

  const dataContext: IMongoDBDataContext = {
    client: async () =>
      ConnectClient(),
    db: async () =>
      ConnectDB(),
    newID: () =>
      new ObjectID(),
    close: async () => {
      const client = await ConnectClient();
      client.close(true);
    },
    createItem: async (collection, item, options = {}) => {
      const Collection = await ConnectCollection(collection);
      const { result } = await Collection.insertOne(item, options) as any;

      return { affected: result.n };
    },
    queryByID: async (collection, id, options = {}) => {
      const Collection = await ConnectCollection(collection);
      const filter = { _id: id };
      const item: any = await Collection.findOne(filter, options);

      if (item === undefined || item === null) {
        return undefined;
      } else {
        return item;
      }
    },
    removeByID: async (collection, id, options = {}) => {
      const Collection = await ConnectCollection(collection);
      const filter = { _id: id };
      const { result } = await Collection.deleteOne(filter, options) as any;

      return { affected: result.n };
    },
    toRepository: (collection, defaultOptions = {}) => ({
      collection: async () =>
        ConnectCollection(collection),
      createItem: (item, options = {}) =>
        dataContext.createItem(collection, item, Object.assign({}, defaultOptions, options)),
      newID: () =>
        dataContext.newID(),
      queryByID: (id, options = {}) =>
        dataContext.queryByID(collection, id, Object.assign({}, defaultOptions, options)),
      removeByID: (id, options = {}) =>
        dataContext.removeByID(collection, id, Object.assign({}, defaultOptions, options)),
    }),
  };

  return dataContext;
};

Object.freeze(createMongoDBContext);
