import { NextFunction, Request, Response } from "express";
import * as authService from "./auth.service.js";

export interface AuthenticatedRequest extends Request {
  userId: string;
}

export async function registerController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const result = await authService.register(req.body);

    return res.status(201).json(result);
  } catch (error) {
    next(error);
  }
}

export async function loginController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const result = await authService.login(req.body);

    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

export async function meController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { userId } = req as AuthenticatedRequest;

    const user = await authService.getMe(userId);

    return res.status(200).json(user);
  } catch (error) {
    next(error);
  }
}
