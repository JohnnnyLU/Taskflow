import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { beforeEach, describe, expect, it, vi } from "vitest";
const routerMock = vi.hoisted(() => ({
  replace: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  useRouter: () => routerMock,
}));

vi.mock("@/entities/user/api", () => ({
  login: vi.fn(),
}));

import { login } from "@/entities/user/api";
import { LoginForm } from "./LoginForm";
import { useAuthStore } from "@/store/auth-store";

function renderLoginForm() {
  const queryClient = new QueryClient();

  return render(
    <QueryClientProvider client={queryClient}>
      <LoginForm />
    </QueryClientProvider>,
  );
}

describe("LoginForm", () => {
  beforeEach(() => {
    useAuthStore.setState({
      accessToken: null,
      hasHydrated: false,
    });
  });

  it("shows email validation error when email is invalid", async () => {
    // Arrange
    renderLoginForm();

    const user = userEvent.setup({ document });

    // Act
    await user.type(screen.getByLabelText(/email/i), "invalid-email");
    await user.type(screen.getByLabelText(/password/i), "validpassword");
    await user.click(screen.getByRole("button", { name: /sign in/i }));

    // Assert
    expect(await screen.findByText(/invalid email/i)).toBeInTheDocument();
  });

  it("shows root error when login fails", async () => {
    // Arrange
    vi.mocked(login).mockRejectedValue(new Error("Invalid credentials"));

    renderLoginForm();

    const user = userEvent.setup({ document });

    // Act
    await user.type(screen.getByLabelText(/email/i), "john@example.com");
    await user.type(screen.getByLabelText(/password/i), "validpassword");
    await user.click(screen.getByRole("button", { name: /sign in/i }));

    // Assert
    expect(await screen.findByText(/invalid email or password/i)).toBeInTheDocument();
  });

  it("stores access token and redirects when login succeeds", async () => {
    // Arrange
    vi.mocked(login).mockResolvedValue({
      accessToken: "test-access-token",
      user: {
        id: "user-1",
        name: "John",
        email: "john@example.com",
        createdAt: "2026-06-13T00:00:00.000Z",
      },
    });

    renderLoginForm();

    const user = userEvent.setup({ document });

    // Act
    await user.type(screen.getByLabelText(/email/i), "john@example.com");
    await user.type(screen.getByLabelText(/password/i), "validpassword");
    await user.click(screen.getByRole("button", { name: /sign in/i }));

    // Assert
    await waitFor(() => {
      expect(routerMock.replace).toHaveBeenCalledWith("/dashboard");
    });

    expect(useAuthStore.getState().accessToken).toBe("test-access-token");
  });
});
