import { Request } from "express";
import { Response, NextFunction } from "express";
import { profileService } from "../../services";
import { errorHandlerWrapper } from "../../utils";

import httpStatus from "http-status";

const getProfile = async (req: Request, res: Response) => {
  const user = await profileService.getProfile(req.user.id);
  res.status(httpStatus.ACCEPTED).json({ user });
};

export const getProfileController = errorHandlerWrapper(getProfile);
