import { Router } from "express";
import { authMiddleware } from "@/middlewares/auth.middleware.js";
import { validate } from "@/middlewares/validate.middleware.js";
import { createProjectSchema } from "@/modules/projects/projects.schemas.js";
import {
  createProjectController,
  deleteProjectController,
  getProjectController,
  getProjectsController,
} from "@/modules/projects/projects.controller.js";

export const projectsRoutes = Router();

projectsRoutes.use(authMiddleware);

projectsRoutes.get("/", getProjectsController);
projectsRoutes.post("/", validate(createProjectSchema), createProjectController);
projectsRoutes.get("/:projectId", getProjectController);
projectsRoutes.delete("/:projectId", deleteProjectController);
