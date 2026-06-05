import { ProtectedRoute } from "@/features/auth/ProtectedRoute";
import { Header } from "@/widgets/header";

export default function ProjectsPage() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-slate-50">
        <Header />

        <main className="mx-auto grid w-full max-w-5xl gap-6 px-4 py-8 lg:grid-cols-[20rem_1fr]">
          <section className="h-fit rounded-md border border-slate-200 bg-white p-5 shadow-sm">
            <h1 className="text-xl font-semibold tracking-tight text-slate-950">
              New project
            </h1>

            <form className="mt-5 space-y-4">
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
                />
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
                />
              </div>

              <button
                className="h-10 rounded-md bg-slate-950 px-4 text-sm font-medium text-white transition hover:bg-slate-800 focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:outline-none"
                type="button"
              >
                Create project
              </button>
            </form>
          </section>

          <section>
            <h2 className="text-2xl font-semibold tracking-tight text-slate-950">
              Projects
            </h2>

            <div className="mt-4 space-y-3">
              <article className="flex items-start justify-between gap-4 rounded-md border border-slate-200 bg-white p-4 shadow-sm">
                <div>
                  <h3 className="text-lg font-semibold text-slate-950">Buy a car</h3>
                  <p className="mt-1 text-sm text-slate-600">I wanna buy a car</p>
                </div>
                <button
                  className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700 focus:ring-2 focus:ring-red-300 focus:ring-offset-2 focus:outline-none"
                  type="button"
                >
                  Delete
                </button>
              </article>

              <article className="flex items-start justify-between gap-4 rounded-md border border-slate-200 bg-white p-4 shadow-sm">
                <div>
                  <h3 className="text-lg font-semibold text-slate-950">Test project</h3>
                  <p className="mt-1 text-sm text-slate-600">
                    This is description for test project
                  </p>
                </div>
                <button
                  className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700 focus:ring-2 focus:ring-red-300 focus:ring-offset-2 focus:outline-none"
                  type="button"
                >
                  Delete
                </button>
              </article>
            </div>
          </section>
        </main>
      </div>
    </ProtectedRoute>
  );
}
