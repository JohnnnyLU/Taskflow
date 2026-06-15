import { prisma } from "@/lib/prisma.js";
import { AppError } from "@/middlewares/error.middleware.js";
import type {
  CreateTaskInput,
  UpdateTaskStatusInput,
} from "@/modules/tasks/tasks.schemas.js";

async function ensureProjectOwner(userId: string, projectId: string) {
  const project = await prisma.project.findFirst({
    where: {
      id: projectId,
      ownerId: userId,
    },
  });

  if (!project) {
    throw new AppError("Project not found", 404);
  }

  return project;
}

async function getUserTask(userId: string, taskId: string) {
  const task = await prisma.task.findFirst({
    where: {
      id: taskId,
      userId,
    },
  });

  if (!task) {
    throw new AppError("Task not found", 404);
  }

  return task;
}

export async function getTasks(userId: string, projectId: string) {
  await ensureProjectOwner(userId, projectId);

  return prisma.task.findMany({
    where: {
      projectId,
      userId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function createTask(
  userId: string,
  projectId: string,
  input: CreateTaskInput,
) {
  await ensureProjectOwner(userId, projectId);

  return prisma.task.create({
    data: {
      title: input.title,
      description: input.description,
      priority: input.priority,
      projectId,
      userId,
    },
  });
}

export async function updateTaskStatus(
  userId: string,
  taskId: string,
  input: UpdateTaskStatusInput,
) {
  const task = await getUserTask(userId, taskId);

  return prisma.task.update({
    where: {
      id: task.id,
    },
    data: {
      status: input.status,
    },
  });
}

export async function deleteTask(userId: string, taskId: string) {
  const task = await getUserTask(userId, taskId);

  await prisma.task.delete({
    where: {
      id: task.id,
    },
  });
}
