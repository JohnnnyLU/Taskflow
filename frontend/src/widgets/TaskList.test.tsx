import { screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import userEvent from "@testing-library/user-event";

import { getTasks } from "@/entities/task/api";
import { useTaskFiltersStore } from "@/store/task-filters-store";
import { renderWithQueryClient } from "@/test/render-with-query-client";
import { TaskList } from "./TaskList";

vi.mock("@/entities/task/api", () => ({
  getTasks: vi.fn(),
  deleteTask: vi.fn(),
  updateTaskStatus: vi.fn(),
}));

function renderTaskList() {
  return renderWithQueryClient(<TaskList projectId="project-1" />);
}

const task = {
  id: "task-1",
  title: "First task",
  description: "Task details",
  status: "todo" as const,
  priority: "high" as const,
  projectId: "project-1",
  userId: "user-1",
  createdAt: "2026-06-14T00:00:00.000Z",
};

const doneTask = {
  ...task,
  id: "task-2",
  title: "Done task",
  description: "Completed details",
  status: "done" as const,
  priority: "low" as const,
};

describe("TaskList", () => {
  beforeEach(() => {
    useTaskFiltersStore.setState({
      status: "all",
    });
  });

  it("renders empty state when project has no tasks", async () => {
    // Arrange
    vi.mocked(getTasks).mockResolvedValue([]);

    renderTaskList();

    // Assert
    expect(await screen.findByText(/no tasks yet/i)).toBeInTheDocument();
    expect(getTasks).toHaveBeenCalledWith("project-1");
  });

  it("renders error state when tasks cannot be loaded", async () => {
    // Arrange
    vi.mocked(getTasks).mockRejectedValue(new Error("Load tasks failed"));

    renderTaskList();

    // Assert
    expect(await screen.findByText(/could not load tasks/i)).toBeInTheDocument();
  });

  it("renders loaded tasks", async () => {
    // Arrange
    vi.mocked(getTasks).mockResolvedValue([task]);

    renderTaskList();

    // Assert
    expect(await screen.findByText(/first task/i)).toBeInTheDocument();
    expect(screen.getByText(/task details/i)).toBeInTheDocument();
    expect(screen.getByText(/high/i)).toBeInTheDocument();
  });

  it("filters tasks by selected status", async () => {
    // Arrange
    vi.mocked(getTasks).mockResolvedValue([task, doneTask]);

    renderTaskList();

    const user = userEvent.setup({ document });

    expect(await screen.findByText(/first task/i)).toBeInTheDocument();
    expect(screen.getByText(/done task/i)).toBeInTheDocument();

    // Act
    await user.selectOptions(screen.getByLabelText(/status/i), "done");

    // Assert
    expect(screen.queryByText(/first task/i)).not.toBeInTheDocument();
    expect(screen.getByText(/done task/i)).toBeInTheDocument();
  });
});
