import { prisma } from "@/lib/prisma.js";
import { AppError } from "@/middlewares/error.middleware.js";
import type { CreateProjectInput } from "@/modules/projects/projects.schemas.js";

export async function getProjects(userId: string) {
  return prisma.project.findMany({
    where: {
      ownerId: userId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function createProject(userId: string, input: CreateProjectInput) {
  return prisma.project.create({
    data: {
      title: input.title,
      description: input.description,
      ownerId: userId,
    },
  });
}

export async function getProject(userId: string, projectId: string) {
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

export async function deleteProject(userId: string, projectId: string) {
  const project = await getProject(userId, projectId);

  await prisma.project.delete({
    where: {
      id: project.id,
    },
  });
}