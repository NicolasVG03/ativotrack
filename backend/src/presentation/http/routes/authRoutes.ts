import { Router } from "express";
import { AuthController } from "../controllers/AuthController";
import { validate } from "../middlewares/validate";
import { registerSchema, loginSchema, googleAuthSchema } from "../../../application/dtos/auth/schemas";

export function authRoutes(controller: AuthController): Router {
  const router = Router();

  router.post("/register", validate(registerSchema), controller.register);
  router.post("/login", validate(loginSchema), controller.login);
  router.post("/google", validate(googleAuthSchema), controller.googleAuth);

  return router;
}