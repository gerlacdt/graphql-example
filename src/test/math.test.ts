import { sum } from "../app/math";

import * as chai from "chai";

const expect = chai.expect;

describe("math", () => {
  describe("sum", () => {
    it("simple a + b", () => {
      const actual = sum(3, 4);
      expect(actual).equal(7);
    });
  });
});
