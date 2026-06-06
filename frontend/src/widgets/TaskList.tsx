"use client";

import { useQuery } from "@tanstack/react-query";

import { getTasks } from "@/entities/task/api";

type TaskListProps = {
  projectId: string;
};

export function TaskList({ projectId }: TaskListProps) {
  const {
    data: tasks,
    isError,
    isLoading,
  } = useQuery({
    queryKey: ["projects", projectId, "tasks"],
    queryFn: () => getTasks(projectId),
    enabled: Boolean(projectId),
  });

  return (
    <section>
      <h2 className="text-xl font-semibold tracking-tight text-slate-950">Tasks</h2>

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

      {!isLoading && !isError && tasks && tasks.length > 0 && (
        <div className="mt-4 space-y-3">
          {tasks.map((task) => (
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

                <div className="flex gap-2 text-xs font-medium">
                  <span className="rounded-full bg-slate-100 px-2.5 py-1 text-slate-700">
                    {task.status}
                  </span>
                  <span className="rounded-full bg-slate-100 px-2.5 py-1 text-slate-700">
                    {task.priority}
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
