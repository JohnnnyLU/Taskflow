import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { register } from "@/entities/user/api";
import { renderWithQueryClient } from "@/test/render-with-query-client";
import { describe, expect, it, vi } from "vitest";

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    replace: vi.fn(),
  }),
}));

vi.mock("@/entities/user/api", () => ({
  register: vi.fn(),
}));

import { RegisterForm } from "./RegisterForm";

function renderRegisterForm() {
  return renderWithQueryClient(<RegisterForm />);
}

describe("RegisterForm", () => {
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
});
