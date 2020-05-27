import { expect } from "chai";
import { SQLParser } from "./SQLParser";

describe("SQLParser.ts tests", () => {
  describe("#SQLParser.parseFromItem()", () => {
    it("expect to parse from an object", () => {
      // arranges
      const obj = {
        fname: "First Name",
        lname: "Last Name",
      };
      const expected = {
        columns: "fname,lname",
        orders: "$1,$2",
        values: ["First Name", "Last Name"],
      };

      // acts
      const result = SQLParser.parseFromItem(obj);

      // asserts
      expect(result).to.deep.equal(expected);
    });
  });

  describe("#SQLParser.insertItem()", () => {
    it("expect to parse sql from an object", () => {
      // arranges
      const obj = {
        fname: "First Name",
        lname: "Last Name",
      };
      const expected = {
        text: "INSERT INTO test(fname,lname) VALUES($1,$2) RETURNING *",
        values: ["First Name", "Last Name"],
      };

      // acts
      const result = SQLParser.insertItem("test", obj);

      // asserts
      expect(result).to.deep.equal(expected);
    });
  });

  describe("#SQLParser.queryByID()", () => {
    it("expect to parse sql for querying an object", () => {
      // arranges
      const expected = {
        text: "SELECT * FROM test WHERE _id = $1",
        values: ["11111"],
      };

      // acts
      const result = SQLParser.queryByID("test", "11111");

      // asserts
      expect(result).to.deep.equal(expected);
    });
  });

  describe("#SQLParser.removeByID()", () => {
    it("expect to parse sql for removing an object", () => {
      // arranges
      const expected = {
        text: "DELETE FROM test WHERE _id = $1",
        values: ["11111"],
      };

      // acts
      const result = SQLParser.removeByID("test", "11111");

      // asserts
      expect(result).to.deep.equal(expected);
    });
  });
});
