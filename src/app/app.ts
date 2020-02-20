import * as express from "express";
import * as graphqlHTTP from "express-graphql";
import { buildSchema } from "graphql";
import * as fs from "fs";
import * as path from "path";

import { loggingMiddleware } from "./middleware/logging";
import { root } from "./resolvers";

// Construct a schema, using GraphQL schema language
const schema = buildSchema(
  fs.readFileSync(path.join(__dirname, "./schema.gql")).toString("utf8"),
);

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
