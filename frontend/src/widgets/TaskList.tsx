"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { deleteTask, getTasks } from "@/entities/task/api";
import { TaskStatusSelect } from "@/features/task/TaskStatusSelect";
import { type TaskStatusFilter, useTaskFiltersStore } from "@/store/task-filters-store";

const taskStatusFilters: TaskStatusFilter[] = ["all", "todo", "in_progress", "done"];

type TaskListProps = {
  projectId: string;
};

export function TaskList({ projectId }: TaskListProps) {
  const queryClient = useQueryClient();
  const statusFilter = useTaskFiltersStore((state) => state.status);
  const setStatusFilter = useTaskFiltersStore((state) => state.setStatus);

  const {
    data: tasks,
    isError,
    isLoading,
  } = useQuery({
    queryKey: ["projects", projectId, "tasks"],
    queryFn: () => getTasks(projectId),
    enabled: Boolean(projectId),
  });

  const deleteTaskMutation = useMutation({
    mutationFn: deleteTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects", projectId, "tasks"] });
    },
  });

  const filteredTasks =
    statusFilter === "all"
      ? tasks
      : tasks?.filter((task) => task.status === statusFilter);

  return (
    <section>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-xl font-semibold tracking-tight text-slate-950">Tasks</h2>

        <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
          Status
          <select
            className="h-9 rounded-md border border-slate-300 bg-white px-2 text-sm text-slate-950 transition outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
            onChange={(event) => setStatusFilter(event.target.value as TaskStatusFilter)}
            value={statusFilter}
          >
            {taskStatusFilters.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </label>
      </div>

      {isLoading && (
        <div className="mt-4 rounded-md border border-slate-200 bg-white p-4 text-sm text-slate-600 shadow-sm">
          Loading tasks...
        </div>
      )}

      {isError && (
        <div className="mt-4 rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          Could not load tasks.
        </div>
      )}

      {!isLoading && !isError && tasks?.length === 0 && (
        <div className="mt-4 rounded-md border border-slate-200 bg-white p-4 text-sm text-slate-600 shadow-sm">
          No tasks yet. Create your first task.
        </div>
      )}

      {!isLoading &&
        !isError &&
        tasks &&
        tasks.length > 0 &&
        filteredTasks?.length === 0 && (
          <div className="mt-4 rounded-md border border-slate-200 bg-white p-4 text-sm text-slate-600 shadow-sm">
            No tasks match selected status.
          </div>
        )}

      {!isLoading && !isError && filteredTasks && filteredTasks.length > 0 && (
        <div className="mt-4 space-y-3">
          {filteredTasks.map((task) => (
            <article
              className="rounded-md border border-slate-200 bg-white p-4 shadow-sm"
              key={task.id}
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h3 className="text-lg font-semibold text-slate-950">{task.title}</h3>

                  {task.description && (
                    <p className="mt-1 text-sm text-slate-600">{task.description}</p>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <TaskStatusSelect
                    projectId={projectId}
                    status={task.status}
                    taskId={task.id}
                  />

                  <span className="rounded-full bg-slate-100 px-2.5 py-1 text-slate-700">
                    {task.priority}
                  </span>

                  <button
                    className="rounded-md bg-red-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-red-700 focus:ring-2 focus:ring-red-300 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-70"
                    disabled={deleteTaskMutation.isPending}
                    onClick={() => deleteTaskMutation.mutate(task.id)}
                    type="button"
                  >
                    {deleteTaskMutation.isPending ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
