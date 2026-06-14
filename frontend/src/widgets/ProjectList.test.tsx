import { screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { getProjects } from "@/entities/project/api";
import { renderWithQueryClient } from "@/test/render-with-query-client";
import { ProjectList } from "./ProjectList";

vi.mock("@/entities/project/api", () => ({
  getProjects: vi.fn(),
  deleteProject: vi.fn(),
}));

function renderProjectList() {
  return renderWithQueryClient(<ProjectList />);
}

const project = {
  id: "project-1",
  title: "First project",
  description: "Project details",
  ownerId: "user-1",
  createdAt: "2026-06-14T00:00:00.000Z",
};

describe("ProjectList", () => {
  it("renders empty state when user has no projects", async () => {
    // Arrange
    vi.mocked(getProjects).mockResolvedValue([]);

    renderProjectList();

    // Assert
    expect(await screen.findByText(/no projects yet/i)).toBeInTheDocument();
    expect(getProjects).toHaveBeenCalled();
  });

  it("renders error state when projects cannot be loaded", async () => {
    // Arrange
    vi.mocked(getProjects).mockRejectedValue(new Error("Load projects failed"));

    renderProjectList();

    // Assert
    expect(await screen.findByText(/could not load projects/i)).toBeInTheDocument();
  });

  it("renders loaded projects", async () => {
    // Arrange
    vi.mocked(getProjects).mockResolvedValue([project]);

    renderProjectList();

    // Assert
    const projectLink = await screen.findByRole("link", {
      name: /first project/i,
    });

    expect(projectLink).toHaveAttribute("href", "/projects/project-1");
    expect(screen.getByText(/project details/i)).toBeInTheDocument();
  });
});
