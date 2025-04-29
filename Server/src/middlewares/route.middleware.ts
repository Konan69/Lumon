import { Env } from "../env";
import { Request, Response, NextFunction } from "express";
import { Logger } from "../utils";

export const routeMiddleware = async (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  Logger.info(
    {
      url: `${req.protocol}://${req.hostname}:${Env.port}${req.url}`,
      method: req.method,
      params: req.params,
      query: req.query,
      body: req.body,
      clientInfo: req.ip,
    },
    "Incoming Request"
  );
  next();
};
