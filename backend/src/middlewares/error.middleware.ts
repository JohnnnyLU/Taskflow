import { Request, Response, NextFunction } from 'express';

export class AppError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: 500) {
    super(message);
    this.statusCode = statusCode;
  }
}

export function errorMiddleware(
  error: Error,
  request: Request,
  response: Response,
  next: NextFunction
) {
  if (error instanceof AppError) {
    return response.status(error.statusCode).json({
      message: error.message,
    });
  }

  console.log(error);

  return response.status(500).json({
    message: "Internal server error",
  });
}