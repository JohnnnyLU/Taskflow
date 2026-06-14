import { screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { getMe } from "@/entities/user/api";
import { useAuthStore } from "@/store/auth-store";
import { renderWithQueryClient } from "@/test/render-with-query-client";
import { ProtectedRoute } from "./ProtectedRoute";

const routerMock = vi.hoisted(() => ({
  replace: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  useRouter: () => routerMock,
}));

vi.mock("@/entities/user/api", () => ({
  getMe: vi.fn(),
}));

describe("ProtectedRoute", () => {
  beforeEach(() => {
    useAuthStore.setState({
      accessToken: null,
      hasHydrated: false,
    });
  });

  it("redirects to login when access token is missing", async () => {
    // Arrange
    useAuthStore.setState({
      accessToken: null,
      hasHydrated: true,
    });

    renderWithQueryClient(
      <ProtectedRoute>
        <div>Protected content</div>
      </ProtectedRoute>,
    );

    // Assert
    await waitFor(() => {
      expect(routerMock.replace).toHaveBeenCalledWith("/login");
    });

    expect(screen.queryByText(/protected content/i)).not.toBeInTheDocument();
  });

  it("renders children when access token is valid", async () => {
    // Arrange
    useAuthStore.setState({
      accessToken: "test-access-token",
      hasHydrated: true,
    });

    vi.mocked(getMe).mockResolvedValue({
      id: "user-1",
      name: "John",
      email: "john@example.com",
      createdAt: "2026-06-14T00:00:00.000Z",
    });

    renderWithQueryClient(
      <ProtectedRoute>
        <div>Protected content</div>
      </ProtectedRoute>,
    );

    // Assert
    expect(await screen.findByText(/protected content/i)).toBeInTheDocument();
    expect(routerMock.replace).not.toHaveBeenCalled();
  });

  it("logs out and redirects to login when current user request fails", async () => {
    // Arrange
    useAuthStore.setState({
      accessToken: "test-access-token",
      hasHydrated: true,
    });

    vi.mocked(getMe).mockRejectedValue(new Error("Unauthorized"));

    renderWithQueryClient(
      <ProtectedRoute>
        <div>Protected content</div>
      </ProtectedRoute>,
    );

    // Assert
    await waitFor(() => {
      expect(routerMock.replace).toHaveBeenCalledWith("/login");
    });

    expect(useAuthStore.getState().accessToken).toBeNull();
    expect(screen.queryByText(/protected content/i)).not.toBeInTheDocument();
  });
});
