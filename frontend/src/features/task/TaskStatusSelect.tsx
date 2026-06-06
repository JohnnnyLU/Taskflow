"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { updateTaskStatus } from "@/entities/task/api";
import type { TaskStatus } from "@/entities/task/types";

const taskStatuses: TaskStatus[] = ["todo", "in_progress", "done"];

type TaskStatusSelectProps = {
  projectId: string;
  taskId: string;
  status: TaskStatus;
};

export function TaskStatusSelect({
  projectId,
  taskId,
  status,
}: TaskStatusSelectProps) {
  const queryClient = useQueryClient();

  const updateStatusMutation = useMutation({
    mutationFn: (nextStatus: TaskStatus) =>
      updateTaskStatus(taskId, { status: nextStatus }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects", projectId, "tasks"] });
    },
  });

  return (
    <select
      className="h-9 rounded-md border border-slate-300 bg-white px-2 text-sm text-slate-950 transition outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200 disabled:cursor-not-allowed disabled:opacity-70"
      disabled={updateStatusMutation.isPending}
      onChange={(event) => updateStatusMutation.mutate(event.target.value as TaskStatus)}
      value={status}
    >
      {taskStatuses.map((taskStatus) => (
        <option key={taskStatus} value={taskStatus}>
          {taskStatus}
        </option>
      ))}
    </select>
  );
}
