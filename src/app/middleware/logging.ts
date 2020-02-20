import * as express from "express";

const loggingMiddleware = (
  req: express.Request,
  _res: express.Response,
  next: express.NextFunction,
): void => {
  console.log("ip: %s", req.ip);
  next();
};

export { loggingMiddleware };
