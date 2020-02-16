import { app } from "../app/app";

import * as supertest from "supertest";

describe("graphql client", () => {
  test("foo hello query", async () => {
    const response = await supertest(app)
      .post("/graphql")
      .set("Accept", "application/json")
      .set("Content-Type", "application/json")
      .send(JSON.stringify({ query: "{ hello }" }))
      .expect(200);

    const body = response.body;
    expect(body).toEqual({ data: { hello: "Hello world!" } });
  });
});
