import { expect } from "chai";
import { Connector } from "./Connector";
import { IPostgreSQLConnectorConfig } from "./IPostgreSQLConnectorConfig";

describe("Connector.ts tests", () => {
  const config: IPostgreSQLConnectorConfig = {
    database: "test",
    host: "localhost",
    password: "postgres",
    user: "postgres",
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
