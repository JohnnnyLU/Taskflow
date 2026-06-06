import { NextFunction, Request, Response } from "express";
import { AuthenticatedRequest } from "@/middlewares/auth.middleware.js";
import { AppError } from "@/middlewares/error.middleware.js";
import * as tasksService from "./tasks.service.js";

export async function getTasksController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { userId } = req as AuthenticatedRequest;
    const { projectId } = req.params;

    if (typeof projectId !== "string") {
      return next(new AppError("Project not found", 404));
    }

    const tasks = await tasksService.getTasks(userId, projectId);

    return res.status(200).json(tasks);
  } catch (error) {
    return next(error);
  }
}

export async function createTaskController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { userId } = req as AuthenticatedRequest;
    const { projectId } = req.params;

    if (typeof projectId !== "string") {
      return next(new AppError("Project not found", 404));
    }

    const task = await tasksService.createTask(userId, projectId, req.body);

    return res.status(201).json(task);
  } catch (error) {
    return next(error);
  }
}

export async function updateTaskStatusController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { userId } = req as AuthenticatedRequest;
    const { taskId } = req.params;

    if (typeof taskId !== "string") {
      return next(new AppError("Task not found", 404));
    }

    const task = await tasksService.updateTaskStatus(userId, taskId, req.body);

    return res.status(200).json(task);
  } catch (error) {
    return next(error);
  }
}

export async function deleteTaskController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { userId } = req as AuthenticatedRequest;
    const { taskId } = req.params;

    if (typeof taskId !== "string") {
      return next(new AppError("Task not found", 404));
    }

    await tasksService.deleteTask(userId, taskId);

    return res.status(204).send();
  } catch (error) {
    return next(error);
  }
}
