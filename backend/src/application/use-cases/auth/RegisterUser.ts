import { randomUUID } from "crypto";
import { IUserRepository } from "../../../domain/repositories/IUserRepository";
import { IHasher } from "../../../domain/services/IHasher";
import { ITokenService } from "../../../domain/services/ITokenService";
import { AppError } from "../../errors/AppError";
import { RegisterUserInput } from "../../dtos/auth/RegisterUserInput";
import { AuthOutput } from "../../dtos/auth/AuthOutput";

export class RegisterUser {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly hasher: IHasher,
    private readonly tokenService: ITokenService,
  ) {}

  async execute({ name, email, password }: RegisterUserInput): Promise<AuthOutput> {
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
    return { token, user: { id: user.id, name: user.name, email: user.email } };
  }
}
