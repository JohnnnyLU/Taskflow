import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { renderWithQueryClient } from "@/test/render-with-query-client";
import { CreateTaskForm } from "./CreateTaskForm";

vi.mock("@/entities/task/api", () => ({
  createTask: vi.fn(),
}));

import { createTask } from "@/entities/task/api";

function renderCreateTaskForm() {
  return renderWithQueryClient(<CreateTaskForm projectId="project-1" />);
}

describe("CreateTaskForm", () => {
  it("shows title validation error when title is empty", async () => {
    // Arrange
    renderCreateTaskForm();

    const user = userEvent.setup({ document });

    // Act
    await user.click(screen.getByRole("button", { name: /create task/i }));

    // Assert
    expect(await screen.findByText(/title is required/i)).toBeInTheDocument();
  });

  it("shows root error when task creation fails", async () => {
    // Arrange
    vi.mocked(createTask).mockRejectedValue(new Error("Create task failed"));

    renderCreateTaskForm();

    const user = userEvent.setup({ document });

    // Act
    await user.type(screen.getByLabelText(/title/i), "New task");
    await user.type(screen.getByLabelText(/description/i), "Task details");
    await user.selectOptions(screen.getByLabelText(/priority/i), "high");
    await user.click(screen.getByRole("button", { name: /create task/i }));

    // Assert
    expect(await screen.findByText(/could not create task/i)).toBeInTheDocument();
  });

  it("creates task and resets form when submission succeeds", async () => {
    // Arrange
    vi.mocked(createTask).mockResolvedValue({
      id: "task-1",
      title: "New task",
      description: "Task details",
      status: "todo",
      priority: "high",
      projectId: "project-1",
      userId: "user-1",
      createdAt: "2026-06-14T00:00:00.000Z",
    });

    renderCreateTaskForm();

    const user = userEvent.setup({ document });

    // Act
    await user.type(screen.getByLabelText(/title/i), "New task");
    await user.type(screen.getByLabelText(/description/i), "Task details");
    await user.selectOptions(screen.getByLabelText(/priority/i), "high");
    await user.click(screen.getByRole("button", { name: /create task/i }));

    // Assert
    expect(createTask).toHaveBeenCalledWith("project-1", {
      title: "New task",
      description: "Task details",
      priority: "high",
    });

    expect(await screen.findByLabelText(/title/i)).toHaveValue("");
    expect(screen.getByLabelText(/description/i)).toHaveValue("");
    expect(screen.getByLabelText(/priority/i)).toHaveValue("medium");
  });
});
