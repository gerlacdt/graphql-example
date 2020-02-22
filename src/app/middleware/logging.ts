import * as express from "express";

const loggingMiddleware = (
  req: express.Request,
  _res: express.Response,
  next: express.NextFunction,
): void => {
  console.log("body: %s", req.body);
  next();
};

export { loggingMiddleware };
