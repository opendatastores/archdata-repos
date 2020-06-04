export class UndefinedDataStoreException extends Error {
  constructor(storeName: string) {
    super(`UNDEFINED_DATASTORE - name: ${storeName}`);
    this.name = "UNDEFINED_DATASTORE";
  }
}
