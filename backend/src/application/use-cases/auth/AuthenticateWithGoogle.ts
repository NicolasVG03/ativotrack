import { randomUUID } from "crypto";
import { OAuth2Client } from "google-auth-library";
import { IUserRepository } from "../../../domain/repositories/IUserRepository";
import { ITokenService } from "../../../domain/services/ITokenService";
import { AppError } from "../../errors/AppError";

interface Input {
  idToken: string;
}

interface Output {
  token: string;
}

export class AuthenticateWithGoogle {
  private readonly client: OAuth2Client;

  constructor(
    private readonly userRepository: IUserRepository,
    private readonly tokenService: ITokenService,
    googleClientId: string,
  ) {
    this.client = new OAuth2Client(googleClientId);
  }

  async execute({ idToken }: Input): Promise<Output> {
    const ticket = await this.client.verifyIdToken({ idToken, audience: this.client._clientId });
    const payload = ticket.getPayload();

    if (!payload?.email || !payload.name) {
      throw new AppError("Token do Google inválido", 400);
    }

    let user = await this.userRepository.findByEmail(payload.email);

    if (!user) {
      user = await this.userRepository.create({
        id: randomUUID(),
        name: payload.name,
        email: payload.email,
        passwordHash: "",
        provider: "google",
        createdAt: new Date(),
      });
    }

    const token = this.tokenService.generate({ sub: user.id });
    return { token };
  }
}
