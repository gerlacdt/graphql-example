import * as winston from "winston";

const logger = winston.createLogger({
  level: "debug",
  format: winston.format.json(),
  defaultMeta: { name: "graphql-example" },
  transports: [new winston.transports.Console()],
});

export { logger };
