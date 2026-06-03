import { NextFunction, Request, Response } from "express";
import { verifyToken } from "@/lib/jwt.js";
import { AppError } from "./error.middleware.js";

export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return next(new AppError("Unauthorized", 401));
  }

  const [type, token] = authHeader.split(" ");

  if (type !== "Bearer" || !token) {
    return next(new AppError("Unauthorized", 401));
  }

  try {
    const payload = verifyToken(token);

    (req as Request & { userId: string }).userId = payload.userId;

    next();
  } catch {
    next(new AppError("Unauthorized", 401));
  }
}
