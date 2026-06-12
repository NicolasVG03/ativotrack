import express from 'express';
import "dotenv/config";
import { errorHandler } from "../presentation/middlewares/errorHandler";

const app = express();
const PORT = process.env.PORT ?? 3000;

app.get("/health", (_req, res) => {
  res.send("Hello AtivoTrack");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

app.use(errorHandler);