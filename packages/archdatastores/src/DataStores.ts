import { IDataContext } from "archdatacore";
import { createConnect } from "./core/createConnect";
import { DataConnects } from "./DataConnects";
import { IDataConfig } from "./IDataConfig";
import { IDataConnects } from "./IDataConnects";

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
  resolve: <DataContext extends IDataContext>(
    name: string,
    dataConnects?: IDataConnects,
  ): DataContext => {
    if (INSTANCE[name] === undefined) {
      const Connects = dataConnects || DataConnects;
      const { dataConnect: Connect, options: Options } = Connects.get(name);

      if (Connect === undefined) {
        throw new Error(`UNDEFINED_DATASTORE - name: ${name}`);
      } else if (typeof Connect.connect !== "function") {
        throw new Error(`INVALID_DATA_CONNECT - name: ${name} - must be a function`);
      } else {
        INSTANCE[name] = Connect.connect(Options);
      }
    }

    return INSTANCE[name];
  },
  composeDataStoreConnect: <DataContext extends IDataContext>(
    name: string,
    dataConnects?: IDataConnects,
  ) => ({
    connect: (options?: boolean | any): DataContext => {
      if (options === undefined || options === false) {
        return DataStores.resolve<DataContext>(name, dataConnects);
      } else {
        const Connects = dataConnects || DataConnects;
        const { dataConnect: Connect, options: Options } = Connects.get(name);
        const OPTIONS = options === true ? Options : options;

        if (Connect === undefined) {
          throw new Error(`UNDEFINED_DATASTORE - name: ${name}`);
        } else if (typeof Connect.connect !== "function") {
          throw new Error(`INVALID_DATA_CONNECT - name: ${name} - must be a function`);
        } else {
          return Connect.connect(OPTIONS) as DataContext;
        }
      }
    },
  }),
};

Object.freeze(DataStores);
