import { randomUUID } from "crypto";
import { IUserRepository } from "../../../domain/repositories/IUserRepository";
import { IHasher } from "../../../domain/services/IHasher";
import { ITokenService } from "../../../domain/services/ITokenService";
import { AppError } from "../../errors/AppError";

interface Input {
  name: string;
  email: string;
  password: string;
}

interface Output {
  token: string;
}

export class RegisterUser {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly hasher: IHasher,
    private readonly tokenService: ITokenService,
  ) {}

  async execute({ name, email, password }: Input): Promise<Output> {
    const existing = await this.userRepository.findByEmail(email);
    if (existing) {
      throw new AppError("Email já cadastrado", 409);
    }

    const passwordHash = await this.hasher.hash(password);

    const user = await this.userRepository.create({
      id: randomUUID(),
      name,
      email,
      passwordHash,
      provider: "local",
      createdAt: new Date(),
    });

    const token = this.tokenService.generate({ sub: user.id });
    return { token };
  }
}
