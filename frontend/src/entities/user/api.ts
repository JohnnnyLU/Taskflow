import { api } from "@/shared/api/axios-instance";
import type { AuthResponse, LoginInput, RegisterInput, User } from "./types";

export async function login(input: LoginInput): Promise<AuthResponse> {
  const response = await api.post<AuthResponse>("/auth/login", input);

  return response.data;
}

export async function register(input: RegisterInput): Promise<AuthResponse> {
  const response = await api.post<AuthResponse>("/auth/register", input);

  return response.data;
}

export async function getMe(): Promise<User> {
  const response = await api.get<User>("/auth/me");

  return response.data;
}
