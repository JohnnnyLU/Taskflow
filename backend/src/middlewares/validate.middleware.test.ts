import { describe, expect, it, vi } from "vitest";
import { z } from "zod";
import type { NextFunction, Request, Response } from "express";
import { AppError } from "./error.middleware.js";
import { validate } from "./validate.middleware.js";

describe("validate", () => {
  const schema = z.object({
    title: z.string().min(1, "Title is required"),
  });

  it("replaces request body with parsed data and calls next without an error", () => {
    const request = {
      body: {
        title: "Project",
        extra: "ignored",
      },
    } as Request;
    const response = {} as Response;
    const next = vi.fn<NextFunction>();

    validate(schema)(request, response, next as unknown as NextFunction);

    expect(request.body).toEqual({ title: "Project" });
    expect(next).toHaveBeenCalledWith();
  });

  it("passes AppError to next when request body is invalid", () => {
    const request = {
      body: {
        title: "",
      },
    } as Request;
    const response = {} as Response;
    const next = vi.fn<NextFunction>();

    validate(schema)(request, response, next as unknown as NextFunction);

    const error = next.mock.calls[0]?.[0];

    expect(error).toBeInstanceOf(AppError);
    expect(error).toMatchObject({
      message: "Title is required",
      statusCode: 400,
    });
  });
});
