import { foo } from "../app/foo";

describe("foo", () => {
  test("simple test", () => {
    const actual = foo({ id: "a" });
    expect(actual).toEqual({ result: 42 });
  });
});
