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

  test("rollDice query with arguments", async () => {
    const query = `query RollDice($dice: Int!, $sides: Int) {
  rollDice(numDice: $dice, numSides: $sides)
  }`;
    const dice = 5;
    const sides = 6;
    const data = JSON.stringify({ query, variables: { dice, sides } });
    const response = await supertest(app)
      .post("/graphql")
      .set("Accept", "application/json")
      .set("Content-Type", "application/json")
      .send(data)
      .expect(200);

    // example: {"data":{"rollDice":[5,4,1,6,3]}}
    const body = response.body;

    expect(body.data).toBeDefined();
    expect(body.data.rollDice.length).toBe(5);
  });

  test("getDie", async () => {
    const nrolls = 5;
    const nsides = 100;
    const query = `query Foobar($nsides: Int!, $nrolls: Int!) {
getDie(numSides: $nsides) {
rollOnce
roll(numRolls: $nrolls)
}
}`;
    const data = JSON.stringify({ query, variables: { nrolls, nsides } });
    const response = await supertest(app)
      .post("/graphql")
      .set("Accept", "application/json")
      .set("Content-Type", "application/json")
      .send(data)
      .expect(200);

    // example: {"data":{"getDie":{"rollOnce":61,"roll":[45,1,52,38,21]}}}
    const body = response.body;

    expect(body.data).toBeDefined();
    expect(body.data.getDie.roll.length).toBe(nrolls);
    expect(body.data.getDie.rollOnce).toBeLessThan(nsides);
  });
});
