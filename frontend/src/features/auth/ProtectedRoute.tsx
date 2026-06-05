"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

import { getMe } from "@/entities/user/api";
import { useAuthStore } from "@/store/auth-store";

type ProtectedRouteProps = {
  children: React.ReactNode;
};

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const router = useRouter();

  const accessToken = useAuthStore((state) => state.accessToken);
  const hasHydrated = useAuthStore((state) => state.hasHydrated);
  const logout = useAuthStore((state) => state.logout);

  const meQuery = useQuery({
    queryKey: ["auth", "me"],
    queryFn: getMe,
    enabled: hasHydrated && Boolean(accessToken),
  });

  useEffect(() => {
    if (!hasHydrated) return;

    if (!accessToken) {
      router.replace("/login");
      return;
    }

    if (meQuery.isError) {
      logout();
      router.replace("/login");
    }
  }, [hasHydrated, accessToken, meQuery.isError, logout, router]);

  if (!hasHydrated || meQuery.isLoading) {
    return <div>Loading...</div>;
  }

  if (!accessToken || meQuery.isError) {
    return null;
  }

  return <>{children}</>;
}
