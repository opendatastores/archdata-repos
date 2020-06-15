import { IDataContext } from "archdatacore";
import { createConnect } from "./core/createConnect";
import { DataConnects } from "./DataConnects";
import { IDataConfig } from "./IDataConfig";
import { IDataConnects } from "./IDataConnects";
import { InvalidDataConnectException, UndefinedDataStoreException } from "./exceptions";
import { IStoresConnect } from "./IStoresConnect";

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
  provideCollectionConnect: <Collection>(collection: string, StoresConnect: string | IStoresConnect) => (() => {
    let COLLECTION: any;

    return {
      connect: async (): Promise<Collection> => {
        if (!COLLECTION) {
          let context: IDataContext;

          if (typeof StoresConnect === "string") {
            context = DataStores.resolve(StoresConnect);
          } else {
            context = StoresConnect.connect();
          }

          const repository = context.toRepository(collection);
          COLLECTION = await repository.collection();
        }

        return COLLECTION;
      },
    };
  })(),
  provideStoresConnect: <DataContext extends IDataContext>(name: string, dataConnects?: IDataConnects): IStoresConnect<DataContext> => ({
    connect: (options) => {
      if (options === undefined || options === false) {
        return DataStores.resolve<DataContext>(name, dataConnects);
      } else {
        const Connects = dataConnects || DataConnects;
        const { dataConnect: Connect, options: Options } = Connects.get(name);
        const OPTIONS = options === true ? Options : options;

        if (Connect === undefined) {
          throw new UndefinedDataStoreException(name);
        } else if (typeof Connect.connect !== "function") {
          throw new InvalidDataConnectException(name);
        } else {
          return Connect.connect(OPTIONS) as DataContext;
        }
      }
    },
  }),
};

Object.freeze(DataStores);
