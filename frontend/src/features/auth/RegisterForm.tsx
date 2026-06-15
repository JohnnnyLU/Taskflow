"use client";

import { z } from "zod";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthStore } from "@/store/auth-store";
import { register as registerUser } from "@/entities/user/api";

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/\d/, "Password must contain at least one number"),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export function RegisterForm() {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  const router = useRouter();
  const setAccessToken = useAuthStore((state) => state.setAccessToken);

  const registerMutation = useMutation({
    mutationFn: registerUser,
    onSuccess: (data) => {
      setAccessToken(data.accessToken);
      router.replace("/dashboard");
    },
    onError: () => {
      setError("root", {
        message: "Could not create account",
      });
    },
  });

  function onSubmit(values: RegisterFormValues) {
    registerMutation.mutate(values);
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
            Create account
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Start managing projects and tasks.
          </p>
        </div>

        <div className="space-y-5">
          <div>
            <Label className="mb-1.5" htmlFor="name">
              Name
            </Label>
            <Input
              className="h-10"
              id="name"
              {...register("name")}
              type="text"
              autoComplete="name"
              placeholder="Your name"
            />

            {errors.name && (
              <p className="mt-1.5 text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>

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
              autoComplete="new-password"
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
          disabled={registerMutation.isPending}
        >
          {registerMutation.isPending ? "Creating account..." : "Create account"}
        </Button>

        <p className="mt-5 text-sm text-slate-600">
          Already registered?{" "}
          <Link
            className="font-medium text-slate-950 underline underline-offset-2"
            href="/login"
          >
            Sign in
          </Link>
        </p>
      </form>
    </div>
  );
}
