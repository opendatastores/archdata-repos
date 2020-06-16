import { IDataContext } from "archdatacore";

export interface IStoresConnect<DataContext extends IDataContext = IDataContext> {
  connect: (options?: boolean | any) => Promise<DataContext>;
  use: (handler: (context: DataContext) => Promise<void>) => IStoresConnect;
  [key: string]: any;
}
