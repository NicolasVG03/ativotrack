import { Request, NextFunction } from "express";
import { ZodType } from "zod";
import { AppError } from "../../../application/errors/AppError";

export function validateQuery(schema: ZodType) {
  return (req: Request, _res: unknown, next: NextFunction) => {
    const result = schema.safeParse(req.query);

    if (!result.success) {
      const message = result.error.issues.map((i) => i.message).join(", ");
      return next(new AppError(message, 400));
    }

    Object.defineProperty(req, "query", {
      value: result.data,
      writable: true,
      configurable: true,
    });
    next();
  };
}
