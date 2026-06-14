import userEvent from "@testing-library/user-event";
import { screen, waitFor } from "@testing-library/react";
import { useAuthStore } from "@/store/auth-store";

import { register } from "@/entities/user/api";
import { renderWithQueryClient } from "@/test/render-with-query-client";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/entities/user/api", () => ({
  register: vi.fn(),
}));

const routerMock = vi.hoisted(() => ({
  replace: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  useRouter: () => routerMock,
}));

import { RegisterForm } from "./RegisterForm";

function renderRegisterForm() {
  return renderWithQueryClient(<RegisterForm />);
}

describe("RegisterForm", () => {
  beforeEach(() => {
    useAuthStore.setState({
      accessToken: null,
      hasHydrated: false,
    });
  });

  it("shows password validation error when password is too short", async () => {
    // Arrange
    renderRegisterForm();

    const user = userEvent.setup({ document });

    // Act
    await user.type(screen.getByLabelText(/name/i), "Steve");
    await user.type(screen.getByLabelText(/email/i), "steve@example.com");
    await user.type(screen.getByLabelText(/password/i), "short");
    await user.click(screen.getByRole("button", { name: /create account/i }));

    // Assert
    expect(
      await screen.findByText(/password must be at least 8 characters/i),
    ).toBeInTheDocument();
  });

  it("shows root error when registration fails", async () => {
    // Arrange
    vi.mocked(register).mockRejectedValue(new Error("Registration failed"));

    renderRegisterForm();

    const user = userEvent.setup({ document });

    // Act
    await user.type(screen.getByLabelText(/name/i), "Steve");
    await user.type(screen.getByLabelText(/email/i), "steve@example.com");
    await user.type(screen.getByLabelText(/password/i), "Validpass1");
    await user.click(screen.getByRole("button", { name: /create account/i }));

    // Assert
    expect(await screen.findByText(/could not create account/i)).toBeInTheDocument();
  });

  it("stores access token and redirects when registration succeeds", async () => {
    // Arrange
    vi.mocked(register).mockResolvedValue({
      accessToken: "test-access-token",
      user: {
        id: "user-1",
        name: "Steve",
        email: "steve@example.com",
        createdAt: "2026-06-14T00:00:00.000Z",
      },
    });

    renderRegisterForm();

    const user = userEvent.setup({ document });

    // Act
    await user.type(screen.getByLabelText(/name/i), "Steve");
    await user.type(screen.getByLabelText(/email/i), "steve@example.com");
    await user.type(screen.getByLabelText(/password/i), "Validpass1");
    await user.click(screen.getByRole("button", { name: /create account/i }));

    // Assert
    await waitFor(() => {
      expect(routerMock.replace).toHaveBeenCalledWith("/dashboard");
    });

    expect(useAuthStore.getState().accessToken).toBe("test-access-token");
  });
});
