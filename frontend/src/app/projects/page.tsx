import { CreateProjectForm } from "@/features/project/CreateProjectForm";
import { ProtectedRoute } from "@/features/auth/ProtectedRoute";
import { Header } from "@/widgets/Header";
import { ProjectList } from "@/widgets/ProjectList";

export default function ProjectsPage() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-slate-50">
        <Header />

        <main className="mx-auto grid w-full max-w-5xl gap-6 px-4 py-8 lg:grid-cols-[20rem_1fr]">
          <CreateProjectForm />
          <ProjectList />
        </main>
      </div>
    </ProtectedRoute>
  );
}
