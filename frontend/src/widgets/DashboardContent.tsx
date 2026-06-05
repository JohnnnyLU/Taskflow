"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { getMe } from "@/entities/user/api";

export function DashboardContent() {
  const { data: user, isLoading } = useQuery({
    queryKey: ["auth", "me"],
    queryFn: getMe,
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <div>User not found</div>;
  }

  return (
    <>
      <h1>Dashboard</h1>
      <p>Welcome, {user.name}</p>
      {user.email}
      <Link href="/projects">Projects</Link>
    </>
  );
}
