import * as express from "express";
import * as graphqlHTTP from "express-graphql";
import { buildSchema } from "graphql";
import * as fs from "fs";
import * as path from "path";

import { Deps } from "./model";

import { loggingMiddleware } from "./middleware/logging";
import { createRoot } from "./resolvers";

export function createApp(deps: Deps): express.Application {
  const root = createRoot(deps);

  // Construct a schema, using GraphQL schema language
  const schema = buildSchema(
    fs
      .readFileSync(path.join(__dirname, "../../files/schema.gql"))
      .toString("utf8"),
  );

  const app = express();

  app.use(loggingMiddleware);
  app.use(
    "/graphql",
    graphqlHTTP({
      schema,
      rootValue: root,
      graphiql: true,
    }),
  );

  return app;
}
