export interface TokenPayload {
  sub: string;
}

export interface ITokenService {
  generate(payload: TokenPayload): string;
  verify(token: string): TokenPayload;
}
