import * as express from "express";
import { logger } from "../logger";

const loggingMiddleware = (
  req: express.Request,
  _res: express.Response,
  next: express.NextFunction,
): void => {
  logger.debug("request logging", req.body);
  next();
};

export { loggingMiddleware };
