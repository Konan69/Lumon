import { Router } from "express";

import { validateRequest } from "../middlewares/validateRequest";
import {
  CreateTaskSchema,
  UpdateTaskSchema,
  DeleteTaskSchema,
} from "../validators/task";
import { TaskController } from "../controllers";
import { checkAuth } from "../utils";

export const taskRouter = Router();

taskRouter.get("/", checkAuth, TaskController.getTasksController);

taskRouter.post(
  "/create",
  checkAuth,
  validateRequest(CreateTaskSchema),
  TaskController.createTaskController
);

taskRouter.patch(
  "/:taskId",
  checkAuth,
  validateRequest(UpdateTaskSchema),
  TaskController.updateTaskController
);

taskRouter.delete(
  "/:taskId",
  checkAuth,
  validateRequest(DeleteTaskSchema),
  TaskController.deleteTaskController
);
