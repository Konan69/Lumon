import { ArgumentValidationError, CustomError } from "../errors";
import { Logger } from "../utils";
import { NextFunction, Request, Response } from "express";

export const errorHandlerMiddleware = (
  error: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  Logger.error(JSON.stringify(error));

  if (error instanceof CustomError) {
    if (error instanceof ArgumentValidationError) {
      return res.status(error.errorCode).json({
        message: error.message,
        messages: error.messages,
      });
    }
    return res.status(error.errorCode).json({
      message: error.message,
    });
  }

  Logger.error(JSON.stringify(error));
  return res.status(500).json({
    message: "Internal server error",
  });
};
