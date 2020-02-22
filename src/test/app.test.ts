import { createApp } from "../app/app";
import { Message, MessageServiceImpl } from "../app/services/messageService";

import * as supertest from "supertest";

const fakeDatabase: Record<string, { content: string; author: string }> = {};
const msgService = new MessageServiceImpl(fakeDatabase);
const app = createApp({ msgService });

async function createMessage({
  author,
  content,
}: {
  author: string;
  content: string;
}): Promise<Message> {
  const query = `mutation CreateMessage($author: String, $content: String) {
messages {
createMessage(input: {author: $author, content: $content}) {
id
author
content
}
}
}
`;
  const data = JSON.stringify({
    query,
    variables: { author, content },
  });
  const response = await supertest(app)
    .post("/graphql")
    .set("Accept", "application/json")
    .set("Content-Type", "application/json")
    .send(data)
    .expect(200);

  return response.body.data.messages.createMessage;
}

describe("graphql client", () => {
  beforeEach(() => {
    msgService.deleteAll();
  });

  test("hello query", async () => {
    const response = await supertest(app)
      .post("/graphql")
      .set("Accept", "application/json")
      .set("Content-Type", "application/json")
      .send(JSON.stringify({ query: "{ hello }" }))
      .expect(200);
    const body = response.body;
    expect(body).toEqual({ data: { hello: "Hello world!" } });
  });

  test("add query", async () => {
    const response = await supertest(app)
      .post("/graphql")
      .set("Accept", "application/json")
      .set("Content-Type", "application/json")
      .send(JSON.stringify({ query: "{ add(a: 1, b: 2) { result }}" }))
      .expect(200);
    const body = response.body;
    expect(body).toEqual({ data: { add: { result: 3 } } });
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

  test("insert message", async () => {
    const query = `mutation CreateMessage($author: String, $content: String) {
messages {
createMessage(input: {author: $author, content: $content}) {
id
author
content
}
}
}`;
    const data = JSON.stringify({
      query,
      variables: { author: "danger", content: "foobar" },
    });
    const response = await supertest(app)
      .post("/graphql")
      .set("Accept", "application/json")
      .set("Content-Type", "application/json")
      .send(data)
      .expect(200);
    const body = response.body;
    const { id, ...actual } = body.data.messages.createMessage;

    expect(id).toBeDefined();
    expect(actual).toEqual({ author: "danger", content: "foobar" });
  });

  test("get message", async () => {
    const msg = await createMessage({ author: "danger", content: "foobar" });

    const query = `query GetMessage($id: ID!) {
messages {
getMessage(id: $id) {
id
author
content
}
}
}
`;
    const data = JSON.stringify({
      query,
      variables: { id: msg.id },
    });
    const response = await supertest(app)
      .post("/graphql")
      .set("Accept", "application/json")
      .set("Content-Type", "application/json")
      .send(data)
      .expect(200);

    // {"data":{"getMessage":{"id":"51b42fe91835f25b1b68","author":"danger","content":"foobar"}}}
    const body = response.body;
    const { id, ...actual } = body.data.messages.getMessage;
    expect(id).toBeDefined();
    expect(actual).toEqual({ author: "danger", content: "foobar" });
  });

  test("get all messages", async () => {
    await createMessage({ author: "danger", content: "foobar" });
    await createMessage({
      author: "danger2",
      content: "foobar2",
    });

    const query = `query {
messages {
getAll {
id
author
content
}
}
}
`;
    const data = JSON.stringify({
      query,
    });
    const response = await supertest(app)
      .post("/graphql")
      .set("Accept", "application/json")
      .set("Content-Type", "application/json")
      .send(data)
      .expect(200);

    const body = response.body;
    const actual = body.data.messages.getAll;
    expect(actual.length).toEqual(2);
  });
});
