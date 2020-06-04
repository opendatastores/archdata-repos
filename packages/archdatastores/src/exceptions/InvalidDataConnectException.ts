export class InvalidDataConnectException extends Error {
  constructor(connectName: string) {
    super(`INVALID_DATA_CONNECT - name: ${connectName} - must be a function`);
    this.name = "INVALID_DATA_CONNECT";
  }
}
