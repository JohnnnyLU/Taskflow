import express from 'express';
import cors from 'cors';
import { errorMiddleware } from "@/middlewares/error.middleware.js";
import { authRoutes } from "@/modules/auth/auth.routes.js";
import { projectsRoutes } from "@/modules/projects/projects.routes.js";
import { tasksRoutes } from "@/modules/tasks/tasks.routes.js";

export const app = express();

app.use(cors());
app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
})

app.use("/auth", authRoutes);
app.use("/projects", projectsRoutes);
app.use(tasksRoutes);

app.use(errorMiddleware);
