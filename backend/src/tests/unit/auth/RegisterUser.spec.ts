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

describe("RegisterUser", () => {
  let userRepository: InMemoryUserRepository;
  let sut: RegisterUser;

  beforeEach(() => {
    userRepository = new InMemoryUserRepository();
    sut = new RegisterUser(userRepository, makeHasher(), makeTokenService());
  });

  it("deve registrar um novo usuário e retornar token", async () => {
    const result = await sut.execute({
      name: "Ana",
      email: "ana@email.com",
      password: "senha123",
    });

    expect(result.token).toBeDefined();
    expect(result.user.email).toBe("ana@email.com");
    expect(result.user.name).toBe("Ana");
  });

  it("deve persistir o usuário com senha hasheada", async () => {
    await sut.execute({ name: "Ana", email: "ana@email.com", password: "senha123" });

    const saved = await userRepository.findByEmail("ana@email.com");
    expect(saved).not.toBeNull();
    expect(saved!.passwordHash).toBe("hashed:senha123");
    expect(saved!.provider).toBe("local");
  });

  it("deve lançar AppError 409 ao cadastrar email duplicado", async () => {
    await sut.execute({ name: "Ana", email: "ana@email.com", password: "senha123" });

    await expect(
      sut.execute({ name: "Ana 2", email: "ana@email.com", password: "outrasenha" }),
    ).rejects.toThrow(new AppError("Email já cadastrado", 409));
  });
});
