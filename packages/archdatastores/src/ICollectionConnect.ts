export interface ICollectionConnect<Collection = any> {
  connect: () => Promise<Collection>;
  use: (handler: (collection: Collection) => Promise<void>) => ICollectionConnect<Collection>;
  [key: string]: any;
}
