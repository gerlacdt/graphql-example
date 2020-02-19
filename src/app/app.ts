import * as express from "express";
import * as graphqlHTTP from "express-graphql";
import { buildSchema } from "graphql";
import { foo, hello } from "./foo";

// Construct a schema, using GraphQL schema language
const schema = buildSchema(`
type FooResponse {
result: Int!
}

type RandomDie {
ip: String
numSides: Int!
rollOnce: Int!
roll(numRolls: Int!): [Int]
}

input MessageInput {
content: String
author: String
}

type Message {
id: ID!
content: String
author: String
}

type Query {
hello: String
foo(id: String!): FooResponse
getMessage(id: ID!): Message
quoteOfTheDay: String
random: Float!
rollThreeDice: [Int]
rollDice(numDice: Int!, numSides: Int): [Int]
getDie(numSides: Int): RandomDie
}

type Mutation {
createMessage(input: MessageInput): Message
updateMessage(id: ID!, input: MessageInput): Message
}
`);

const loggingMiddleware = (
  req: express.Request,
  _res: express.Response,
  next: express.NextFunction,
) => {
  console.log("ip: %s", req.ip);
  next();
};

class Message {
  constructor(
    public id: string,
    public content: string,
    public author: string,
  ) {}
}

class MessageInput {
  constructor(public content: string, public author: string) {}
}

const fakeDatabase: Record<string, { content: string; author: string }> = {};

class RandomDie {
  constructor(public numSides: number) {}

  public rollOnce(): number {
    return 1 + Math.floor(Math.random() * this.numSides);
  }

  public roll({ numRolls }: { numRolls: number }): number[] {
    const output = [];
    for (var i = 0; i < numRolls; i++) {
      output.push(this.rollOnce());
    }
    return output;
  }
}

// The root provides a resolver function for each API endpoint
const root = {
  hello,
  foo,
  quoteOfTheDay: () => {
    return Math.random() < 0.5 ? "Take it easy" : "Salvation lies within";
  },
  random: () => {
    return Math.random();
  },
  rollThreeDice: () => {
    return [1, 2, 3].map(_ => 1 + Math.floor(Math.random() * 6));
  },
  rollDice: ({
    numDice,
    numSides = 6,
  }: {
    numDice: number;
    numSides?: number;
  }) => {
    var output = [];
    for (var i = 0; i < numDice; i++) {
      output.push(1 + Math.floor(Math.random() * numSides));
    }
    return output;
  },
  getDie: ({ numSides = 6 }: { numSides?: number }) => {
    return new RandomDie(numSides);
  },

  getMessage: ({ id }: { id: string }) => {
    if (!fakeDatabase[id]) {
      throw new Error("no message exists with id " + id);
    }
    const { content, author } = fakeDatabase[id];
    return new Message(id, content, author);
  },
  createMessage: ({ input }: { input: MessageInput }) => {
    // Create a random id for our "database".
    var id = require("crypto")
      .randomBytes(10)
      .toString("hex");

    fakeDatabase[id] = input;
    const { content, author } = fakeDatabase[id];
    return new Message(id, content, author);
  },
  updateMessage: ({ id, input }: { id: string; input: MessageInput }) => {
    if (!fakeDatabase[id]) {
      throw new Error("no message exists with id " + id);
    }
    // This replaces all old data, but some apps might want partial update.
    fakeDatabase[id] = input;
    const { content, author } = fakeDatabase[id];
    return new Message(id, content, author);
  },
};

export const app = express();

app.use(loggingMiddleware);
app.use(
  "/graphql",
  graphqlHTTP({
    schema,
    rootValue: root,
    graphiql: true,
  }),
);
