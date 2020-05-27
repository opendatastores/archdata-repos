import { expect } from "chai";
import { IPostgreSQLConnectorConfig } from "../../IPostgreSQLConnectorConfig";
import { createDBAdmin } from "./createDBAdmin";

describe("createDBAdmin.ts tests", () => {
  describe("#createDBAdmin", () => {
    it("expect to create the database instance as admin, #1", async () => {
      // arranges
      const config: IPostgreSQLConnectorConfig = {
        admin: {
          password: "postgres",
          user: "postgres",
        },
        database: "test",
        host: "localhost",
      };

      // acts
      const proxy = createDBAdmin(config);
      const db = await proxy.get();
      await proxy.end();

      // asserts
      expect(db).not.to.equal(null);
      expect(db).not.to.equal(undefined);
    });

    it("expect to throw an error as missing config", async () => {
      // arranges
      const config: IPostgreSQLConnectorConfig = {};

      // acts
      const proxy = createDBAdmin(config);

      let expected;
      try {
        await proxy.get();
      } catch (error) {
        expected = error;
      }
      await proxy.end();

      // asserts
      expect(expected).not.to.equal(undefined);
    });
  });
});
