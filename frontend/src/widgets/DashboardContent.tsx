"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";

import { getMe } from "@/entities/user/api";
import { Header } from "@/widgets/header";

export function DashboardContent() {
  const { data: user, isLoading } = useQuery({
    queryKey: ["auth", "me"],
    queryFn: getMe,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Header />
        <main className="mx-auto w-full max-w-5xl px-4 py-8">
          <div className="rounded-md border border-slate-200 bg-white p-6 text-slate-600 shadow-sm">
            Loading dashboard...
          </div>
        </main>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />

      <main className="mx-auto w-full max-w-5xl px-4 py-8">
        <section className="rounded-md border border-slate-200 bg-white p-6 shadow-sm">
          <h1 className="text-2xl font-semibold tracking-tight text-slate-950">
            Hello, {user.name}
          </h1>
          <p className="mt-2 text-slate-600">Projects: 0</p>

          <Link
            className="mt-5 inline-flex h-10 items-center rounded-md bg-slate-950 px-4 text-sm font-medium text-white transition hover:bg-slate-800 focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:outline-none"
            href="/projects"
          >
            Open projects
          </Link>
        </section>
      </main>
    </div>
  );
}
