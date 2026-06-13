import { LoginUser } from "../../../application/use-cases/auth/LoginUser";
import { RegisterUser } from "../../../application/use-cases/auth/RegisterUser";
import { AppError } from "../../../application/errors/AppError";
import { InMemoryUserRepository } from "../../repositories/InMemoryUserRepository";
import { IHasher } from "../../../domain/services/IHasher";
import { ITokenService } from "../../../domain/services/ITokenService";

const makeHasher = (): IHasher => ({
  hash: async (plain) => `hashed:${plain}`,
  compare: async (plain, hashed) => hashed === `hashed:${plain}`,
});

const makeTokenService = (): ITokenService => ({
  generate: ({ sub }) => `token:${sub}`,
  verify: (token) => ({ sub: token.replace("token:", "") }),
});

describe("LoginUser", () => {
  let userRepository: InMemoryUserRepository;
  let sut: LoginUser;

  beforeEach(async () => {
    userRepository = new InMemoryUserRepository();
    const hasher = makeHasher();
    const tokenService = makeTokenService();

    await new RegisterUser(userRepository, hasher, tokenService).execute({
      name: "Ana",
      email: "ana@email.com",
      password: "senha123",
    });

    sut = new LoginUser(userRepository, hasher, tokenService);
  });

  it("deve autenticar com credenciais válidas e retornar token", async () => {
    const result = await sut.execute({ email: "ana@email.com", password: "senha123" });

    expect(result.token).toBeDefined();
    expect(result.user.email).toBe("ana@email.com");
  });

  it("deve lançar AppError 401 para email inexistente", async () => {
    await expect(
      sut.execute({ email: "naoexiste@email.com", password: "senha123" }),
    ).rejects.toThrow(new AppError("Credenciais inválidas", 401));
  });

  it("deve lançar AppError 401 para senha incorreta", async () => {
    await expect(
      sut.execute({ email: "ana@email.com", password: "senhaerrada" }),
    ).rejects.toThrow(new AppError("Credenciais inválidas", 401));
  });
});
