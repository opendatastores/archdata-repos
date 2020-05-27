import { expect } from "chai";
import { Connector } from "./Connector";
import { IMongoDBConnectorConfig } from "./IMongoDBConnectorConfig";

describe("Connector.ts tests", () => {
  const config: IMongoDBConnectorConfig = {
    connection: "mongodb://localhost:27017",
    dbName: "test",
  };

  describe("#Connector()", () => {
    it("expect to build the data context without throwing exceptions", () => {
      // arranges

      // acts
      const connector = Connector(config);
      const result = connector.connect();

      // asserts
      expect(result).not.to.equal(null);
      expect(result).not.to.equal(undefined);
    });
  });
});
