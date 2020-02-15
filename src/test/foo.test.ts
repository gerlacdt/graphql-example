import { foo } from "../app/foo";

import * as chai from "chai";

const expect = chai.expect;

describe("foo", () => {
  describe("foo", () => {
    it("simple test", () => {
      const actual = foo({ id: "a" });
      expect(actual).equal(42);
    });
  });
});
