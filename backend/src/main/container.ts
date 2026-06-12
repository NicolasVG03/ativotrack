import "dotenv/config";
import { PrismaUserRepository } from "../infrastructure/repositories/PrismaUserRepository";
import { BcryptHasher } from "../infrastructure/auth/BcryptHasher";
import { JwtTokenService } from "../infrastructure/auth/JwtTokenService";
import { RegisterUser } from "../application/use-cases/auth/RegisterUser";
import { LoginUser } from "../application/use-cases/auth/LoginUser";
import { AuthenticateWithGoogle } from "../application/use-cases/auth/AuthenticateWithGoogle";
import { AuthController } from "../presentation/http/controllers/AuthController";
import { makeAuthMiddleware } from "../presentation/http/middlewares/authMiddleware";

const JWT_SECRET = process.env.JWT_SECRET;
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET não definida nas variáveis de ambiente");
}
if (!GOOGLE_CLIENT_ID) {
  throw new Error("GOOGLE_CLIENT_ID não definida nas variáveis de ambiente");
}

const userRepository = new PrismaUserRepository();
const hasher = new BcryptHasher();
const tokenService = new JwtTokenService(JWT_SECRET);

const registerUser = new RegisterUser(userRepository, hasher, tokenService);
const loginUser = new LoginUser(userRepository, hasher, tokenService);
const authenticateWithGoogle = new AuthenticateWithGoogle(
  userRepository,
  tokenService,
  GOOGLE_CLIENT_ID,
);

export const authController = new AuthController(registerUser, loginUser, authenticateWithGoogle);
export const authMiddleware = makeAuthMiddleware(tokenService);
