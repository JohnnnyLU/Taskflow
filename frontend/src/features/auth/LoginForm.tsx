"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { login } from "@/entities/user/api";
import { useAuthStore } from "@/store/auth-store";

const loginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginForm() {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const router = useRouter();
  const setAccessToken = useAuthStore((state) => state.setAccessToken);

  const loginMutation = useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      setAccessToken(data.accessToken);
      router.replace("/dashboard");
    },
    onError: () => {
      setError("root", {
        message: "Invalid email or password",
      });
    },
  });

  function onSubmit(values: LoginFormValues) {
    loginMutation.mutate(values);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-10">
      <form
        noValidate
        className="w-full max-w-md rounded-md border border-slate-200 bg-white p-6 shadow-sm"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="mb-7">
          <h1 className="text-2xl font-semibold tracking-tight text-slate-950">
            Sign in
          </h1>
          <p className="mt-2 text-sm text-slate-600">Access your TaskFlow workspace.</p>
        </div>

        <div className="space-y-5">
          <div>
            <Label className="mb-1.5" htmlFor="email">
              Email
            </Label>
            <Input
              className="h-10"
              id="email"
              {...register("email")}
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
            />

            {errors.email && (
              <p className="mt-1.5 text-sm text-red-600">{errors.email.message}</p>
            )}
          </div>

          <div>
            <Label className="mb-1.5" htmlFor="password">
              Password
            </Label>
            <Input
              className="h-10"
              id="password"
              type="password"
              autoComplete="current-password"
              {...register("password")}
              placeholder="&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;"
            />

            {errors.password && (
              <p className="mt-1.5 text-sm text-red-600">{errors.password.message}</p>
            )}
          </div>
        </div>

        {errors.root && (
          <p className="mt-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
            {errors.root.message}
          </p>
        )}

        <Button
          className="mt-4 h-10 w-full"
          type="submit"
          disabled={loginMutation.isPending}
        >
          {loginMutation.isPending ? "Signing in..." : "Sign in"}
        </Button>

        <p className="mt-5 text-sm text-slate-600">
          No account?{" "}
          <Link
            className="font-medium text-slate-950 underline underline-offset-2"
            href="/register"
          >
            Create one
          </Link>
        </p>
      </form>
    </div>
  );
}
