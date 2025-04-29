
import { Router } from "express";
import { taskRouter } from "./taskRouter";

export const appRouter = Router();

appRouter.use("/tasks", taskRouter);

