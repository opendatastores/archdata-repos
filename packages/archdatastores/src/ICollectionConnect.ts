export interface ICollectionConnect<Collection = any> {
  connect: () => Promise<Collection>;
  use: (Func: (collection: Collection) => Promise<void>) => ICollectionConnect<Collection>;
}
