export interface IEndableClient {
  end: () => Promise<void>;
}
