import { expect } from "chai";
import { IPostgreSQLConnectorConfig } from "../../IPostgreSQLConnectorConfig";
import { createDBClientPool } from "./createDBClientPool";

describe("createDBClientPool.ts tests", () => {
  describe("#createDBClientPool", () => {
    it("expect to create the database instance, #1", async () => {
      // arranges
      const config: IPostgreSQLConnectorConfig = {
        database: "test",
        host: "localhost",
        password: "postgres",
        user: "postgres",
      };

      // acts
      const proxy = createDBClientPool(config);
      const db = proxy.get();
      await proxy.end();

      // asserts
      expect(db).not.to.equal(null);
      expect(db).not.to.equal(undefined);
    });

    it("expect to create the database instance, #2", async () => {
      // arranges
      const config: IPostgreSQLConnectorConfig = {};

      // acts
      const proxy = createDBClientPool(config);
      const db = proxy.get();
      await proxy.end();

      // asserts
      expect(db).not.to.equal(null);
      expect(db).not.to.equal(undefined);
    });

    it("expect to create the database instance, #3", async () => {
      // arranges
      const config: IPostgreSQLConnectorConfig = {
        connectionString: "test",
      };

      // acts
      const proxy = createDBClientPool(config);
      const db = proxy.get();
      await proxy.end();

      // asserts
      expect(db).not.to.equal(null);
      expect(db).not.to.equal(undefined);
    });

    it("expect to create the database instance, #4", async () => {
      // arranges
      const config: IPostgreSQLConnectorConfig = {
        database: "postgres",
        host: "localhost",
        password: "postgres",
        port: 5432,
        user: "postgres",
      };
      const proxy = createDBClientPool(config);

      // acts
      const client = await proxy.connect();
      const act = () => client.release();

      // asserts
      expect(act).not.to.throw();
      await proxy.end();
    });

    it("expect not to throw an exception ", (done) => {
      // arranges

      // acts
      const proxy = createDBClientPool({});
      proxy.end()
        .then(() => {
          // asserts
          expect(true).to.equal(true);
          done();
        });
    });
  });
});
