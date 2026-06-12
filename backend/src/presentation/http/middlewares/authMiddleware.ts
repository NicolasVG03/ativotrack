import { Request, Response, NextFunction } from "express";
import { ITokenService } from "../../../domain/services/ITokenService";

declare global {
  namespace Express {
    interface Request {
      userId: string;
    }
  }
}

export function makeAuthMiddleware(tokenService: ITokenService) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith("Bearer ")) {
      res.status(401).json({ error: "Token não fornecido" });
      return;
    }

    const token = authHeader.slice(7);

    try {
      const { sub } = tokenService.verify(token);
      req.userId = sub;
      next();
    } catch {
      res.status(401).json({ error: "Token inválido ou expirado" });
    }
  };
}
