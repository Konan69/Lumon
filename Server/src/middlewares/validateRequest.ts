import { Request, Response, NextFunction } from "express";
import { AnyZodObject, ZodError } from "zod";
import { ArgumentValidationError } from "../errors";
export const validateRequest =
  (schema: AnyZodObject) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      return next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errorMessages = error.errors.map((issue) => issue.message);
        return next(
          new ArgumentValidationError("Validation failed", errorMessages)
        );
      }
      return next(error);
    }
  };
