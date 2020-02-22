import { createApp } from "./app";
import { MessageServiceImpl } from "./services/messageService";
import { Deps } from "./model";
import { logger } from "./logger";

function defaultDeps(): Deps {
  const fakeDatabase: Record<string, { content: string; author: string }> = {};
  const msgService = new MessageServiceImpl(fakeDatabase);

  return { msgService };
}

const app = createApp(defaultDeps());

app.listen(4000);
logger.info("Running a GraphQL API server at http://localhost:4000/graphql");
