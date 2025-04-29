import { Router } from "express";
import { taskRouter } from "./taskRouter";
import { categoriesRouter } from "./categoryRouter";

export const appRouter = Router();

appRouter.use("/tasks", taskRouter);
appRouter.use("/categories", categoriesRouter);
