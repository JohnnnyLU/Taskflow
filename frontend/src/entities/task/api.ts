import { api } from "@/shared/api/axios-instance";
import type { CreateTaskInput, Task, UpdateTaskStatusInput } from "./types";

export async function getTasks(projectId: string): Promise<Task[]> {
  const response = await api.get<Task[]>(`/projects/${projectId}/tasks`);

  return response.data;
}

export async function createTask(
  projectId: string,
  input: CreateTaskInput
): Promise<Task> {
  const response = await api.post<Task>(`/projects/${projectId}/tasks`, input);

  return response.data;
}

export async function updateTaskStatus(
  taskId: string,
  input: UpdateTaskStatusInput
): Promise<Task> {
  const response = await api.patch<Task>(`/tasks/${taskId}/status`, input);

  return response.data;
}

export async function deleteTask(taskId: string): Promise<void> {
  await api.delete(`/tasks/${taskId}`);
}
