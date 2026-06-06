"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { createTask } from "@/entities/task/api";

const createTaskSchema = z.object({
  title: z.string().trim().min(1, "Title is required"),
  description: z.string().trim().optional(),
  priority: z.enum(["low", "medium", "high"]),
});

type CreateTaskFormValues = z.infer<typeof createTaskSchema>;

type CreateTaskFormProps = {
  projectId: string;
};

export function CreateTaskForm({ projectId }: CreateTaskFormProps) {
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<CreateTaskFormValues>({
    resolver: zodResolver(createTaskSchema),
    defaultValues: {
      title: "",
      description: "",
      priority: "medium",
    },
  });

  const createTaskMutation = useMutation({
    mutationFn: (values: CreateTaskFormValues) => createTask(projectId, values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects", projectId, "tasks"] });
      reset();
    },
    onError: () => {
      setError("root", {
        message: "Could not create task",
      });
    },
  });

  function onSubmit(values: CreateTaskFormValues) {
    createTaskMutation.mutate(values);
  }

  return (
    <section className="rounded-md border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-xl font-semibold tracking-tight text-slate-950">New task</h2>

      <form className="mt-5 space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label
            className="mb-1.5 block text-sm font-medium text-slate-900"
            htmlFor="task-title"
          >
            Title
          </label>
          <input
            className="h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-950 transition outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
            id="task-title"
            type="text"
            {...register("title")}
          />

          {errors.title && (
            <p className="mt-1.5 text-sm text-red-600">{errors.title.message}</p>
          )}
        </div>

        <div>
          <label
            className="mb-1.5 block text-sm font-medium text-slate-900"
            htmlFor="task-description"
          >
            Description
          </label>
          <textarea
            className="min-h-24 w-full resize-y rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-950 transition outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
            id="task-description"
            {...register("description")}
          />
        </div>

        <div>
          <label
            className="mb-1.5 block text-sm font-medium text-slate-900"
            htmlFor="task-priority"
          >
            Priority
          </label>
          <select
            className="h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-950 transition outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
            id="task-priority"
            {...register("priority")}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        {errors.root && (
          <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
            {errors.root.message}
          </p>
        )}

        <button
          className="h-10 rounded-md bg-slate-950 px-4 text-sm font-medium text-white transition hover:bg-slate-800 focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-70"
          disabled={createTaskMutation.isPending}
          type="submit"
        >
          {createTaskMutation.isPending ? "Creating..." : "Create task"}
        </button>
      </form>
    </section>
  );
}
