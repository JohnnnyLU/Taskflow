"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import { getMe } from "@/entities/user/api";
import { useAuthStore } from "@/store/auth-store";

export function Header() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const logout = useAuthStore((state) => state.logout);

  const { data: user } = useQuery({
    queryKey: ["auth", "me"],
    queryFn: getMe,
  });

  function handleLogout() {
    logout();
    queryClient.removeQueries({ queryKey: ["auth"] });
    router.replace("/login");
  }

  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex h-16 w-full max-w-5xl items-center justify-between px-4">
        <Link className="text-lg font-semibold text-slate-950" href="/dashboard">
          TaskFlow
        </Link>

        <nav className="flex items-center gap-5 text-sm">
          <Link
            className="text-slate-800 transition hover:text-slate-950"
            href="/projects"
          >
            Projects
          </Link>

          {user?.email && <span className="text-slate-600">{user.email}</span>}

          <button
            className="rounded-md border border-slate-300 px-4 py-2 font-medium text-slate-950 transition hover:bg-slate-50 focus:ring-2 focus:ring-slate-300 focus:ring-offset-2 focus:outline-none"
            onClick={handleLogout}
            type="button"
          >
            Logout
          </button>
        </nav>
      </div>
    </header>
  );
}
