import * as express from "express";
import * as graphqlHTTP from "express-graphql";
import { buildSchema } from "graphql";
import { foo, hello } from "./foo";

// Construct a schema, using GraphQL schema language
const schema = buildSchema(`
type Query {
hello: String
foo(id: String!): Int
}
`);

// The root provides a resolver function for each API endpoint
const root = {
  hello: hello,
  foo: foo,
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
app.listen(4000);
console.log("Running a GraphQL API server at http://localhost:4000/graphql");
