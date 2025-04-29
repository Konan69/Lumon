import { Router } from "express";

import { validateRequest } from "../middlewares/validateRequest";
import { CreateCategorySchema } from "../validators/category";
import { CategoriesController } from "../controllers";
import { checkAuth } from "../utils";

export const categoriesRouter = Router();

categoriesRouter.get(
  "/",
  checkAuth,
  CategoriesController.getCategoriesController
);

categoriesRouter.post(
  "/create",
  checkAuth,
  validateRequest(CreateCategorySchema),
  CategoriesController.createCategoryController
);
