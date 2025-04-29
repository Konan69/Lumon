import e, { Request } from "express";
import { Response, NextFunction } from "express";
import { categoryService, profileService } from "../../services";
import { errorHandlerWrapper } from "../../utils";

import httpStatus from "http-status";

const getCategories = async (req: Request, res: Response) => {
  const categories = await categoryService.getCategories(req.user.id);
  res.status(httpStatus.ACCEPTED).json(categories);
};

const createCategory = async (req: Request, res: Response) => {
  const user = req.user;
  const { name } = req.body;
  const category = await categoryService.createCategory(user.id, name);
  res.status(httpStatus.CREATED).json({ category });
};

export const getCategoriesController = errorHandlerWrapper(getCategories);
export const createCategoryController = errorHandlerWrapper(createCategory);
