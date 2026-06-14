import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { updateTaskStatus } from "@/entities/task/api";
import { renderWithQueryClient } from "@/test/render-with-query-client";
import { TaskStatusSelect } from "./TaskStatusSelect";

vi.mock("@/entities/task/api", () => ({
  updateTaskStatus: vi.fn(),
}));

function renderTaskStatusSelect() {
  return renderWithQueryClient(
    <TaskStatusSelect projectId="project-1" taskId="task-1" status="todo" />,
  );
}

describe("TaskStatusSelect", () => {
  it("updates task status when selected status changes", async () => {
    // Arrange
    vi.mocked(updateTaskStatus).mockResolvedValue({
      id: "task-1",
      title: "Task",
      description: null,
      status: "done",
      priority: "medium",
      projectId: "project-1",
      userId: "user-1",
      createdAt: "2026-06-14T00:00:00.000Z",
    });

    renderTaskStatusSelect();

    const user = userEvent.setup({ document });

    // Act
    await user.selectOptions(screen.getByRole("combobox"), "done");

    // Assert
    expect(updateTaskStatus).toHaveBeenCalledWith("task-1", {
      status: "done",
    });
  });
});
