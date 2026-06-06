"use client";

import Link from "next/link";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { deleteProject, getProjects } from "@/entities/project/api";

export function ProjectList() {
  const queryClient = useQueryClient();

  const {
    data: projects,
    isError,
    isLoading,
  } = useQuery({
    queryKey: ["projects"],
    queryFn: getProjects,
  });

  const deleteProjectMutation = useMutation({
    mutationFn: deleteProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });

  return (
    <section>
      <h2 className="text-2xl font-semibold tracking-tight text-slate-950">Projects</h2>

      {isLoading && (
        <div className="mt-4 rounded-md border border-slate-200 bg-white p-4 text-sm text-slate-600 shadow-sm">
          Loading projects...
        </div>
      )}

      {isError && (
        <div className="mt-4 rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          Could not load projects.
        </div>
      )}

      {!isLoading && !isError && projects?.length === 0 && (
        <div className="mt-4 rounded-md border border-slate-200 bg-white p-4 text-sm text-slate-600 shadow-sm">
          No projects yet. Create your first project.
        </div>
      )}

      {!isLoading && !isError && projects && projects.length > 0 && (
        <div className="mt-4 space-y-3">
          {projects.map((project) => (
            <article
              className="flex items-start justify-between gap-4 rounded-md border border-slate-200 bg-white p-4 shadow-sm"
              key={project.id}
            >
              <div>
                <Link
                  className="text-lg font-semibold text-slate-950 transition hover:text-slate-700"
                  href={`/projects/${project.id}`}
                >
                  {project.title}
                </Link>

                {project.description && (
                  <p className="mt-1 text-sm text-slate-600">{project.description}</p>
                )}
              </div>

              <button
                className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700 focus:ring-2 focus:ring-red-300 focus:ring-offset-2 focus:outline-none"
                disabled={deleteProjectMutation.isPending}
                onClick={() => deleteProjectMutation.mutate(project.id)}
                type="button"
              >
                {deleteProjectMutation.isPending ? "Deleting..." : "Delete"}
              </button>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
