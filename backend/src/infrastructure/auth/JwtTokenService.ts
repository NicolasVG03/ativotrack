import jwt from "jsonwebtoken";
import { ITokenService, TokenPayload } from "../../domain/services/ITokenService";

export class JwtTokenService implements ITokenService {
  private readonly secret: string;
  private readonly expiresIn: string;

  constructor(secret: string, expiresIn = "7d") {
    this.secret = secret;
    this.expiresIn = expiresIn;
  }

  generate(payload: TokenPayload): string {
    return jwt.sign(payload, this.secret, { expiresIn: this.expiresIn as jwt.SignOptions["expiresIn"] });
  }

  verify(token: string): TokenPayload {
    const decoded = jwt.verify(token, this.secret);
    if (typeof decoded === "string" || !("sub" in decoded)) {
      throw new Error("Token inválido");
    }
    return { sub: decoded.sub as string };
  }
}
