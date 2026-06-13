import { beforeEach, describe, expect, it } from "vitest";
import { useTaskFiltersStore } from "./task-filters-store";

describe("useTaskFiltersStore", () => {
  beforeEach(() => {
    useTaskFiltersStore.setState({
      status: "all",
    });
  });

  it("uses all tasks as the default status filter", () => {
    expect(useTaskFiltersStore.getState().status).toBe("all");
  });

  it("updates status filter", () => {
    useTaskFiltersStore.getState().setStatus("done");

    expect(useTaskFiltersStore.getState().status).toBe("done");
  });
});
