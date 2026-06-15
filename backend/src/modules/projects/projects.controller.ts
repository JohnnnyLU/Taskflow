import { NextFunction, Request, Response } from "express";
import { AuthenticatedRequest } from "@/middlewares/auth.middleware.js";
import { AppError } from "@/middlewares/error.middleware.js";
import * as projectsService from "./projects.service.js";

export async function getProjectsController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { userId } = req as AuthenticatedRequest;

    const projects = await projectsService.getProjects(userId);

    return res.status(200).json(projects);
  } catch (error) {
    return next(error);
  }
}

export async function createProjectController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { userId } = req as AuthenticatedRequest;

    const project = await projectsService.createProject(userId, req.body);

    return res.status(201).json(project);
  } catch (error) {
    return next(error);
  }
}

export async function getProjectController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { userId } = req as AuthenticatedRequest;
    const { projectId } = req.params;

    if (typeof projectId !== "string") {
      return next(new AppError("Project not found", 404));
    }

    const project = await projectsService.getProject(userId, projectId);

    return res.status(200).json(project);
  } catch (error) {
    return next(error);
  }
}

export async function deleteProjectController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { userId } = req as AuthenticatedRequest;
    const { projectId } = req.params;

    if (typeof projectId !== "string") {
      return next(new AppError("Project not found", 404));
    }

    await projectsService.deleteProject(userId, projectId);

    return res.status(204).send();
  } catch (error) {
    return next(error);
  }
}
