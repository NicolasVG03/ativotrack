import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { AppError } from "../../../application/errors/AppError";

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction,
): void {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({ error: err.message });
    return;
  }

  if (err instanceof ZodError) {
    const message = err.issues.map((i) => i.message).join(", ");
    res.status(400).json({ error: message });
    return;
  }

  console.error(err);
  res.status(500).json({ error: "Erro interno do servidor" });
}
