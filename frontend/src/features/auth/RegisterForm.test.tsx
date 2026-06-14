import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { renderWithQueryClient } from "@/test/render-with-query-client";
import { describe, expect, it, vi } from "vitest";

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    replace: vi.fn(),
  }),
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
});
