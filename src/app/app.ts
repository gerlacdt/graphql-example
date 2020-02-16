import * as express from "express";
import * as graphqlHTTP from "express-graphql";
import { buildSchema } from "graphql";
import { foo, hello } from "./foo";

// Construct a schema, using GraphQL schema language
const schema = buildSchema(`
type FooResponse {
result: Int!
}

type Query {
hello: String
foo(id: String!): FooResponse

quoteOfTheDay: String
random: Float!
rollThreeDice: [Int]
rollDice(numDice: Int!, numSides: Int): [Int]
}
`);

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
};

const app = express();
app.use(
  "/graphql",
  graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true,
  }),
);

export { app };