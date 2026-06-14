import express from "express";
import cors from "cors";
import { authController, authMiddleware, expenseController } from "./container";
import { authRoutes } from "../presentation/http/routes/authRoutes";
import { expenseRoutes } from "../presentation/http/routes/expenseRoutes";
import { errorHandler } from "../presentation/http/middlewares/errorHandler";

export const app = express();

const allowedOrigins = [
  process.env.FRONTEND_URL,
  'http://localhost:5173',
].filter(Boolean) as string[];

app.use(cors({
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS bloqueado para origem: ${origin}`));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));


app.use(express.json());

app.get("/health", (_req, res) => {
  res.send("Hello AtivoTrack");
});

app.use("/auth", authRoutes(authController));
app.use("/expenses", expenseRoutes(expenseController, authMiddleware));

app.use(errorHandler);