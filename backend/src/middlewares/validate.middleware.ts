import { NextFunction, Request, Response } from "express";
import { ZodSchema } from "zod";
import { AppError } from "./error.middleware.js";

export function validate(schema: ZodSchema) {
  return (request: Request, _response: Response, next: NextFunction) => {
    const result = schema.safeParse(request.body);

    if (!result.success) {
      const message = result.error.issues[0]?.message || "Validation error";
      return next(new AppError(message, 400));
    }

    request.body = result.data;
    next();
  };
}
