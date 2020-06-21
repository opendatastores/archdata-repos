import { IDataContext } from "archdatacore";
import { createConnect } from "./core/createConnect";
import { DataConnects } from "./DataConnects";
import { IDataConfig } from "./IDataConfig";
import { IDataConnects } from "./IDataConnects";
import { InvalidDataConnectException, UndefinedDataStoreException } from "./exceptions";
import { IStoresConnect } from "./IStoresConnect";
import { ICollectionConnect } from "./ICollectionConnect";

let INSTANCE: { [name: string]: any; } = {};

export const DataStores = {
  initialize: <Config = any, Options = any>(
    name: string,
    dataConfig: IDataConfig<Config, Options>,
    dataConnects?: IDataConnects,
  ) => {
    const Connects = dataConnects || DataConnects;
    const { config, connector, options } = dataConfig;
    const dataConnect = createConnect(connector, config);
    Connects.set(name, { dataConnect, options });
  },
  reset: (name?: string) => {
    if (name) {
      delete INSTANCE[name];
    } else {
      INSTANCE = {};
    }
  },
  resolve: <DataContext extends IDataContext>(name: string, dataConnects?: IDataConnects): DataContext => {
    if (INSTANCE[name] === undefined) {
      const Connects = dataConnects || DataConnects;
      const { dataConnect: Connect, options: Options } = Connects.get(name);

      if (Connect === undefined) {
        throw new UndefinedDataStoreException(name);
      } else if (typeof Connect.connect !== "function") {
        throw new InvalidDataConnectException(name);
      } else {
        INSTANCE[name] = Connect.connect(Options);
      }
    }

    return INSTANCE[name];
  },
  provideCollectionConnect: <Collection = any>(StoresConnect: string | IStoresConnect, collection: string) => ((): ICollectionConnect<Collection> => {
    type THandler = (collection: Collection) => Promise<void>;
    let COLLECTION: Collection;
    const Handlers: THandler[] = [];

    const CollectionConnect: ICollectionConnect<Collection> = {
      connect: async (): Promise<Collection> => {
        if (!COLLECTION) {
          let context: IDataContext;

          if (typeof StoresConnect === "string") {
            context = DataStores.resolve(StoresConnect);
          } else {
            context = await StoresConnect.connect();
          }

          const repository = context.toRepository(collection);
          COLLECTION = await repository.collection();

          for await (const handler of Handlers) {
            await handler(COLLECTION);
          }
        }

        return COLLECTION;
      },
      use: (handler) => {
        Handlers.push(handler);

        return CollectionConnect;
      },
    };

    return CollectionConnect;
  })(),
  provideStoresConnect: <DataContext extends IDataContext>(name: string, dataConnects?: IDataConnects) => ((): IStoresConnect<DataContext> => {
    type THandler = (context: DataContext) => Promise<void>;
    let CONTEXT: DataContext;
    const Handlers: THandler[] = [];

    const StoresConnect: IStoresConnect<DataContext> = {
      connect: async (options) => {
        if (options === undefined || options === false) {
          if (!CONTEXT) {
            CONTEXT = DataStores.resolve<DataContext>(name, dataConnects);

            for await (const handler of Handlers) {
              await handler(CONTEXT);
            }
          }

          return CONTEXT;
        } else {
          const Connects = dataConnects || DataConnects;
          const { dataConnect: Connect, options: Options } = Connects.get(name);
          const OPTIONS = options === true ? Options : options;

          if (Connect === undefined) {
            throw new UndefinedDataStoreException(name);
          } else if (typeof Connect.connect !== "function") {
            throw new InvalidDataConnectException(name);
          } else {
            const context = Connect.connect(OPTIONS) as DataContext;

            for await (const handler of Handlers) {
              await handler(context);
            }

            return context;
          }
        }
      },
      use: (handler) => {
        Handlers.push(handler);

        return StoresConnect;
      },
    };

    return StoresConnect;
  })(),
};

Object.freeze(DataStores);
