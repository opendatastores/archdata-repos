import { expect } from "chai";
import * as sinon from "sinon";
import { IPostgreSQLConnectorConfig } from "../IPostgreSQLConnectorConfig";
import { createDataContext } from "./createDataContext";

describe("createDataContext.ts tests", () => {
  const testConfig: IPostgreSQLConnectorConfig = {
    admin: {
      password: "postgres",
      user: "postgres",
    },
    database: "test",
    host: "localhost",
    password: "postgres",
    port: 5432,
    user: "postgres",
  };

  const testItem: any = {
    _id: undefined,
    date: new Date(),
  };

  const dataContext = createDataContext(testConfig);

  before(async () => {
    await dataContext.adminQueries.createDB("test");
    const db = await dataContext.db();
    const sql = `CREATE TABLE sample (
      "_id" varchar NULL,
      "date" timestamp NULL,
      CONSTRAINT sample_pk PRIMARY KEY ("_id")
    );`;

    await db.query(sql);
  });

  after(async () => {
    await dataContext.close("client");
    await dataContext.adminQueries.dropDB("test");
    await dataContext.close("admin");
  });

  describe("#DataContext", () => {
    describe("#DataContext.admin()", () => {
      it("expect to resolve the database instance as admin, #1", async () => {
        // arranges

        // acts
        const db = await dataContext.admin();

        // asserts
        expect(db).not.to.equal(null);
        expect(db).not.to.equal(undefined);
      });

      it("expect to resolve the database instance as admin, #2", async () => {
        // arranges

        // acts
        const db1 = await dataContext.admin();
        const db2 = await dataContext.admin();

        // asserts
        expect(db1).to.equal(db2);
      });
    });

    describe("#DataContext.db()", () => {
      it("expect to resolve the database instance, #1", async () => {
        // arranges

        // acts
        const db = await dataContext.db();

        // asserts
        expect(db).not.to.equal(null);
        expect(db).not.to.equal(undefined);
      });

      it("expect to resolve the database instance, #2", async () => {
        // arranges

        // acts
        const db1 = await dataContext.db();
        const db2 = await dataContext.db();

        // asserts
        expect(db1).to.equal(db2);
      });
    });

    describe("#DataContext.close()", () => {
      it("expect to close the database pool", async () => {
        // arranges
        const db = await dataContext.db();
        const total = db.totalCount;

        // acts
        await dataContext.close();
        const closedTotal = db.totalCount;

        // asserts
        expect(total).to.equal(1);
        expect(closedTotal).to.equal(0);
      });
    });

    describe("#DataContext.newID()", () => {
      it("expect to create a new ID using default function", () => {
        // arranges

        // acts
        const id = dataContext.newID();
        testItem._id = id;

        // asserts
        expect(id).not.to.equal(null);
        expect(id).not.to.equal(undefined);
      });

      it("expect to create a new ID by passing through config", () => {
        // arranges
        const newIDFunc = sinon.stub().callsFake(() => "12345");
        const config = { newIDFunc };
        const context = createDataContext(config);

        // acts
        const id = context.newID();

        // asserts
        expect(id).to.equal("12345");
      });
    });

    describe("#DataContext.createItem()", () => {
      it("expect to create a new item", async () => {
        // arranges
        const expected = {
          affected: 1,
        };

        // acts
        const result = await dataContext.createItem("sample", testItem);

        // asserts
        expect(result).to.deep.equal(expected);
      });
    });

    describe("#DataContext.queryByID()", () => {
      it("expect to query an item by id", async () => {
        // arranges

        // acts
        const result = await dataContext.queryByID("sample", testItem._id);

        // asserts
        expect(result).to.deep.equal(testItem);
      });

      it("expect to get undefined if the id not exist", async () => {
        // arranges

        // acts
        const result = await dataContext.queryByID("sample", "11111");

        // asserts
        expect(result).to.equal(undefined);
      });
    });

    describe("#DataContext.removeByID()", () => {
      it("expect to remove an item by id", async () => {
        // arranges
        const expected = {
          affected: 1,
        };

        // acts
        const result = await dataContext.removeByID("sample", testItem._id);

        // asserts
        expect(result).to.deep.equal(expected);
      });

      it("expect to remove none when the id not exist", async () => {
        // arranges
        const id = dataContext.newID();
        const expected = {
          affected: 0,
        };

        // acts
        const result = await dataContext.removeByID("sample", id);

        // asserts
        expect(result).to.deep.equal(expected);
      });
    });

    describe("#DataContext.toRepository", () => {
      it("expect to resolve a repository", () => {
        // arranges

        // acts
        const result = dataContext.toRepository("sample");

        // asserts
        expect(result).not.to.equal(null);
        expect(result).not.to.equal(undefined);
      });
    });
  });

  describe("#Repository", () => {
    const repository = dataContext.toRepository("sample");

    describe("#Repository.collection()", () => {
      it("expect to resolve the collection instance", async () => {
        // arranges

        // acts
        const collection = await repository.collection();

        // asserts
        expect(collection).not.to.equal(null);
        expect(collection).not.to.equal(undefined);
      });
    });

    describe("#Repository.newID()", () => {
      it("expect to create a new ID", () => {
        // arranges

        // acts
        const id = repository.newID();
        testItem._id = id;

        // asserts
        expect(id).not.to.equal(null);
        expect(id).not.to.equal(undefined);
      });
    });

    describe("#Repository.createItem()", () => {
      it("expect to create a new item", async () => {
        // arranges
        const expected = {
          affected: 1,
        };

        // acts
        const result = await repository.createItem(testItem);

        // asserts
        expect(result).to.deep.equal(expected);
      });
    });

    describe("#Repository.queryByID()", () => {
      it("expect to query an item by id", async () => {
        // arranges

        // acts
        const result = await repository.queryByID(testItem._id);

        // asserts
        expect(result).to.deep.equal(testItem);
      });
    });

    describe("#Repository.removeByID()", () => {
      it("expect to remove an item by id", async () => {
        // arranges
        const expected = {
          affected: 1,
        };

        // acts
        const result = await repository.removeByID(testItem._id);

        // asserts
        expect(result).to.deep.equal(expected);
      });

      it("expect to remove none when the id not exist", async () => {
        // arranges
        const id = repository.newID();
        const expected = {
          affected: 0,
        };

        // acts
        const result = await repository.removeByID(id);

        // asserts
        expect(result).to.deep.equal(expected);
      });
    });
  });
});
