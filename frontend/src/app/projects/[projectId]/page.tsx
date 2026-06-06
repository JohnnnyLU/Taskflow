"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

import { getProject } from "@/entities/project/api";
import { ProtectedRoute } from "@/features/auth/ProtectedRoute";
import { Header } from "@/widgets/Header";
import { TaskList } from "@/widgets/TaskList";

export default function ProjectPage() {
  const params = useParams<{ projectId: string }>();
  const projectId = params.projectId;

  const projectQuery = useQuery({
    queryKey: ["projects", projectId],
    queryFn: () => getProject(projectId),
    enabled: Boolean(projectId),
  });

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-slate-50">
        <Header />

        <main className="mx-auto w-full max-w-5xl px-4 py-8">
          <Link
            className="text-sm font-medium text-slate-600 transition hover:text-slate-950"
            href="/projects"
          >
            Back to projects
          </Link>

          {projectQuery.isLoading && (
            <div className="mt-6 rounded-md border border-slate-200 bg-white p-6 text-sm text-slate-600 shadow-sm">
              Loading project...
            </div>
          )}

          {projectQuery.isError && (
            <div className="mt-6 rounded-md border border-red-200 bg-red-50 p-6 text-sm text-red-700">
              Could not load project.
            </div>
          )}

          {projectQuery.data && (
            <div className="mt-6 space-y-6">
              <section className="rounded-md border border-slate-200 bg-white p-6 shadow-sm">
                <h1 className="text-2xl font-semibold tracking-tight text-slate-950">
                  {projectQuery.data.title}
                </h1>

                {projectQuery.data.description && (
                  <p className="mt-2 text-slate-600">{projectQuery.data.description}</p>
                )}
              </section>

              <TaskList projectId={projectId} />
            </div>
          )}
        </main>
      </div>
    </ProtectedRoute>
  );
}
