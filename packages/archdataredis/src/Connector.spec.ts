import { expect } from "chai";
import { Connector } from "./Connector";
import { IRedisConnectorConfig } from "./IRedisConnectorConfig";

describe("Connector.ts tests", () => {
  const config: IRedisConnectorConfig = {
    connection: {},
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
