import { screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { useAuthStore } from "@/store/auth-store";
import { renderWithQueryClient } from "@/test/render-with-query-client";
import { PublicOnlyRoute } from "./PublicOnlyRoute";

const routerMock = vi.hoisted(() => ({
  replace: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  useRouter: () => routerMock,
}));

describe("PublicOnlyRoute", () => {
  beforeEach(() => {
    useAuthStore.setState({
      accessToken: null,
      hasHydrated: false,
    });
  });

  it("renders children when access token is missing", () => {
    useAuthStore.setState({
      accessToken: null,
      hasHydrated: true,
    });

    renderWithQueryClient(
      <PublicOnlyRoute>
        <div>Public content</div>
      </PublicOnlyRoute>,
    );

    expect(screen.getByText(/public content/i)).toBeInTheDocument();
    expect(routerMock.replace).not.toHaveBeenCalled();
  });

  it("redirects to dashboard when access token exists", async () => {
    useAuthStore.setState({
      accessToken: "test-access-token",
      hasHydrated: true,
    });

    renderWithQueryClient(
      <PublicOnlyRoute>
        <div>Public content</div>
      </PublicOnlyRoute>,
    );

    await waitFor(() => {
      expect(routerMock.replace).toHaveBeenCalledWith("/dashboard");
    });

    expect(screen.queryByText(/public content/i)).not.toBeInTheDocument();
  });
});
