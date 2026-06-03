import express from 'express';
import cors from 'cors';
import { errorMiddleware } from "@/middlewares/error.middleware.js";
import { authRoutes } from "@/modules/auth/auth.routes.js";

export const app = express();

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
})

app.use("/auth", authRoutes);

app.use(errorMiddleware);