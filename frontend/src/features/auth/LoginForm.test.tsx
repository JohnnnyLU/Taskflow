import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { describe, expect, it, vi } from "vitest";
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    replace: vi.fn(),
  }),
}));

import { LoginForm } from "./LoginForm";

function renderLoginForm() {
  const queryClient = new QueryClient();

  return render(
    <QueryClientProvider client={queryClient}>
      <LoginForm />
    </QueryClientProvider>,
  );
}

describe("LoginForm", () => {
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
});
