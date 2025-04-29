import "../types";
import { NextFunction, Request, Response } from "express";
import { supabase } from "../app";

import { UnauthorizedError, ForbiddenError } from "../errors";

export const checkAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.header("Authorization").replace("Bearer ", "");

  if (token == null) {
    return next(new UnauthorizedError("Token is invalid"));
  }

  const { data, error } = await supabase.auth.getUser(token);

  if (error || !data || !data.user) {
    console.error("Auth error:", error?.message || "User not found");
    return new ForbiddenError("Token invalid or expired");
  }

  req.user = data.user;
  next();
};
