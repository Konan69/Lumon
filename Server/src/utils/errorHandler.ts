import { ArgumentValidationError } from "../errors";
import { NextFunction, Response, Request } from "express";

export const errorHandlerWrapper = (
  func: (
    req: Request,
    res: Response,
    next: NextFunction
  ) => Promise<void> | void
) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await func(req, res, next);
    } catch (err: unknown) {
      next(err);
    }
  };
};
