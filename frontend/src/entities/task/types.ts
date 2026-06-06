export type TaskStatus = "todo" | "in_progress" | "done";
export type TaskPriority = "low" | "medium" | "high";

export type Task = {
  id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  projectId: string;
  userId: string;
  createdAt: string;
};

export type CreateTaskInput = {
  title: string;
  description?: string;
  priority: TaskPriority;
};

export type UpdateTaskStatusInput = {
  status: TaskStatus;
};
