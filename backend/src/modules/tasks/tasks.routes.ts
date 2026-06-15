import { Router } from "express";
import { authMiddleware } from "@/middlewares/auth.middleware.js";
import { validate } from "@/middlewares/validate.middleware.js";
import {
  createTaskSchema,
  updateTaskStatusSchema,
} from "@/modules/tasks/tasks.schemas.js";
import {
  createTaskController,
  deleteTaskController,
  getTasksController,
  updateTaskStatusController,
} from "@/modules/tasks/tasks.controller.js";

export const tasksRoutes = Router();

tasksRoutes.use(authMiddleware);

tasksRoutes.get("/projects/:projectId/tasks", getTasksController);
tasksRoutes.post(
  "/projects/:projectId/tasks",
  validate(createTaskSchema),
  createTaskController,
);
tasksRoutes.patch(
  "/tasks/:taskId/status",
  validate(updateTaskStatusSchema),
  updateTaskStatusController,
);
tasksRoutes.delete("/tasks/:taskId", deleteTaskController);
