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
}
`);

// The root provides a resolver function for each API endpoint
const root = {
  hello,
  foo,
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
