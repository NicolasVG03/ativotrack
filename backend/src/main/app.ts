import express from "express";
import cors from "cors";
import { authController, authMiddleware, expenseController } from "./container";
import { authRoutes } from "../presentation/http/routes/authRoutes";
import { expenseRoutes } from "../presentation/http/routes/expenseRoutes";
import { errorHandler } from "../presentation/http/middlewares/errorHandler";

export const app = express();

app.use(cors({
  origin: process.env.CORS_ORIGIN ?? "http://localhost:5173",
  credentials: true,
}));

app.use(express.json());

app.get("/health", (_req, res) => {
  res.send("Hello AtivoTrack");
});

app.use("/auth", authRoutes(authController));
app.use("/expenses", expenseRoutes(expenseController, authMiddleware));

app.use(errorHandler);