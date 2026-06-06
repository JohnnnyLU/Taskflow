"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { createProject } from "@/entities/project/api";

const projectSchema = z.object({
  title: z.string().trim().min(1, "Title is required"),
  description: z.string().trim().optional(),
});

type ProjectFormValues = z.infer<typeof projectSchema>;

export function CreateProjectForm() {
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      title: "",
      description: "",
    },
  });

  const createProjectMutation = useMutation({
    mutationFn: createProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      reset();
    },
    onError: () => {
      setError("root", {
        message: "Could not create project",
      });
    },
  });

  function onSubmit(values: ProjectFormValues) {
    createProjectMutation.mutate(values);
  }

  return (
    <section className="h-fit rounded-md border border-slate-200 bg-white p-5 shadow-sm">
      <h1 className="text-xl font-semibold tracking-tight text-slate-950">New project</h1>

      <form className="mt-5 space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label
            className="mb-1.5 block text-sm font-medium text-slate-900"
            htmlFor="project-title"
          >
            Title
          </label>
          <input
            className="h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-950 transition outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
            id="project-title"
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
            htmlFor="project-description"
          >
            Description
          </label>
          <textarea
            className="min-h-24 w-full resize-y rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-950 transition outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
            id="project-description"
            {...register("description")}
          />
        </div>

        {errors.root && (
          <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
            {errors.root.message}
          </p>
        )}

        <button
          className="h-10 rounded-md bg-slate-950 px-4 text-sm font-medium text-white transition hover:bg-slate-800 focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-70"
          type="submit"
          disabled={createProjectMutation.isPending}
        >
          {createProjectMutation.isPending ? "Creating..." : "Create project"}
        </button>
      </form>
    </section>
  );
}
