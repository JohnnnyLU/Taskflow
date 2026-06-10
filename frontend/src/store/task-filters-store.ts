"use client";

import { create } from "zustand";

import type { TaskStatus } from "@/entities/task/types";

export type TaskStatusFilter = "all" | TaskStatus;

type TaskFiltersState = {
  status: TaskStatusFilter;
  setStatus: (status: TaskStatusFilter) => void;
};

export const useTaskFiltersStore = create<TaskFiltersState>((set) => ({
  status: "all",
  setStatus: (status) => set({ status }),
}));
