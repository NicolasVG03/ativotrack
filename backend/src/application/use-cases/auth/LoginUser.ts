import { IUserRepository } from "../../../domain/repositories/IUserRepository";
import { IHasher } from "../../../domain/services/IHasher";
import { ITokenService } from "../../../domain/services/ITokenService";
import { AppError } from "../../errors/AppError";
import { LoginUserInput } from "../../dtos/auth/LoginUserInput";
import { AuthOutput } from "../../dtos/auth/AuthOutput";

export class LoginUser {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly hasher: IHasher,
    private readonly tokenService: ITokenService,
  ) {}

  async execute({ email, password }: LoginUserInput): Promise<AuthOutput> {
    const user = await this.userRepository.findByEmail(email);
    if (!user || !user.passwordHash) {
      throw new AppError("Credenciais inválidas", 401);
    }

    const valid = await this.hasher.compare(password, user.passwordHash);
    if (!valid) {
      throw new AppError("Credenciais inválidas", 401);
    }

    const token = this.tokenService.generate({ sub: user.id });
    return { token, user: { id: user.id, name: user.name, email: user.email } };
  }
}
