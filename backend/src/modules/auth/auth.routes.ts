import { Router } from "express";
import { validate } from "@/middlewares/validate.middleware.js";
import { authMiddleware } from "@/middlewares/auth.middleware.js";
import { loginSchema, registerSchema } from "./auth.schemas.js";
import {
  loginController,
  meController,
  registerController,
} from "./auth.controller.js";

export const authRoutes = Router();

authRoutes.post("/register", validate(registerSchema), registerController);
authRoutes.post("/login", validate(loginSchema), loginController);
authRoutes.get("/me", authMiddleware, meController);
