import { IUserRepository } from "../../../domain/repositories/IUserRepository";
import { IHasher } from "../../../domain/services/IHasher";
import { ITokenService } from "../../../domain/services/ITokenService";
import { AppError } from "../../errors/AppError";

interface Input {
  email: string;
  password: string;
}

interface Output {
  token: string;
}

export class LoginUser {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly hasher: IHasher,
    private readonly tokenService: ITokenService,
  ) {}

  async execute({ email, password }: Input): Promise<Output> {
    const user = await this.userRepository.findByEmail(email);
    if (!user || !user.passwordHash) {
      throw new AppError("Credenciais inválidas", 401);
    }

    const valid = await this.hasher.compare(password, user.passwordHash);
    if (!valid) {
      throw new AppError("Credenciais inválidas", 401);
    }

    const token = this.tokenService.generate({ sub: user.id });
    return { token };
  }
}
