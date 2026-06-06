import { api } from "@/shared/api/axios-instance";
import type { Project, CreateProjectInput } from "./types";

export async function getProjects(): Promise<Project[]> {
  const response = await api.get<Project[]>("/projects");

  return response.data;
}

export async function getProject(projectId: string): Promise<Project> {
  const response = await api.get<Project>(`/projects/${projectId}`);

  return response.data;
}

export async function createProject(input: CreateProjectInput): Promise<Project> {
  const response = await api.post<Project>("/projects", input);

  return response.data;
}

export async function deleteProject(projectId: string): Promise<void> {
  await api.delete(`/projects/${projectId}`);
}
