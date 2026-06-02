import express from 'express';
import cors from 'cors';
import {AppError, errorMiddleware} from "@/middlewares/error.middleware.js";

export const app = express();

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
})

// routes

app.use(errorMiddleware);