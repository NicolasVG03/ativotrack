import express from "express";
import { authController } from "./container";
import { authRoutes } from "../presentation/http/routes/authRoutes";
import { errorHandler } from "../presentation/http/middlewares/errorHandler";

const app = express();
const PORT = process.env.PORT ?? 3000;

app.use(express.json());

app.get("/health", (_req, res) => {
  res.send("Hello AtivoTrack");
});

app.use("/auth", authRoutes(authController));

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
