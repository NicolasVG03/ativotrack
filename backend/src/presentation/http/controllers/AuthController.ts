import { Request, Response, NextFunction } from "express";
import { RegisterUser } from "../../../application/use-cases/auth/RegisterUser";
import { LoginUser } from "../../../application/use-cases/auth/LoginUser";
import { AuthenticateWithGoogle } from "../../../application/use-cases/auth/AuthenticateWithGoogle";

export class AuthController {
  constructor(
    private readonly registerUser: RegisterUser,
    private readonly loginUser: LoginUser,
    private readonly authenticateWithGoogle: AuthenticateWithGoogle,
  ) {}

  register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const output = await this.registerUser.execute(req.body);
      res.status(201).json(output);
    } catch (err) {
      next(err);
    }
  };

  login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const output = await this.loginUser.execute(req.body);
      res.status(200).json(output);
    } catch (err) {
      next(err);
    }
  };

  googleAuth = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const output = await this.authenticateWithGoogle.execute(req.body);
      res.status(200).json(output);
    } catch (err) {
      next(err);
    }
  };
}
