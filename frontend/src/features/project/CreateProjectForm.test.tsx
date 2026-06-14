import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { createProject } from "@/entities/project/api";
import { renderWithQueryClient } from "@/test/render-with-query-client";
import { CreateProjectForm } from "./CreateProjectForm";

vi.mock("@/entities/project/api", () => ({
  createProject: vi.fn(),
}));

function renderCreateProjectForm() {
  return renderWithQueryClient(<CreateProjectForm />);
}

describe("CreateProjectForm", () => {
  it("shows title validation error when title is empty", async () => {
    // Arrange
    renderCreateProjectForm();

    const user = userEvent.setup({ document });

    // Act
    await user.click(screen.getByRole("button", { name: /create project/i }));

    // Assert
    expect(await screen.findByText(/title is required/i)).toBeInTheDocument();
  });

  it("shows root error when project creation fails", async () => {
    // Arrange
    vi.mocked(createProject).mockRejectedValue(new Error("Create project failed"));

    renderCreateProjectForm();

    const user = userEvent.setup({ document });

    // Act
    await user.type(screen.getByLabelText(/title/i), "New project");
    await user.type(screen.getByLabelText(/description/i), "Project details");
    await user.click(screen.getByRole("button", { name: /create project/i }));

    // Assert
    expect(await screen.findByText(/could not create project/i)).toBeInTheDocument();
  });

  it("creates project and resets form when submission succeeds", async () => {
    // Arrange
    vi.mocked(createProject).mockResolvedValue({
      id: "project-1",
      title: "New project",
      description: "Project details",
      ownerId: "user-1",
      createdAt: "2026-06-14T00:00:00.000Z",
    });

    renderCreateProjectForm();

    const user = userEvent.setup({ document });

    // Act
    await user.type(screen.getByLabelText(/title/i), "New project");
    await user.type(screen.getByLabelText(/description/i), "Project details");
    await user.click(screen.getByRole("button", { name: /create project/i }));

    // Assert
    expect(createProject).toHaveBeenCalledWith(
      {
        title: "New project",
        description: "Project details",
      },
      expect.anything(),
    );

    expect(await screen.findByLabelText(/title/i)).toHaveValue("");
    expect(screen.getByLabelText(/description/i)).toHaveValue("");
  });
});
