import { IDataContext } from "archdatacore";

export interface IStoresConnect<DataContext extends IDataContext = IDataContext> {
  connect: (options?: boolean | any) => DataContext;
}
