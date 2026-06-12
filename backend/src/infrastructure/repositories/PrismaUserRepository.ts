import { User } from "../../domain/entities/User";
import { IUserRepository } from "../../domain/repositories/IUserRepository";
import { prisma } from "../database/prisma/cliente";

export class PrismaUserRepository implements IUserRepository {
  async create(user: User): Promise<User> {
    const created = await prisma.user.create({
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        password: user.passwordHash || null,
        provider: user.provider,
        createdAt: user.createdAt,
      },
    });
    return this.toDomain(created);
  }

  async findByEmail(email: string): Promise<User | null> {
    const found = await prisma.user.findUnique({ where: { email } });
    return found ? this.toDomain(found) : null;
  }

  async findById(id: string): Promise<User | null> {
    const found = await prisma.user.findUnique({ where: { id } });
    return found ? this.toDomain(found) : null;
  }

  private toDomain(raw: { id: string; name: string; email: string; password: string | null; provider: string; createdAt: Date }): User {
    return {
      id: raw.id,
      name: raw.name,
      email: raw.email,
      passwordHash: raw.password ?? "",
      provider: raw.provider === "google" ? "google" : "local",
      createdAt: raw.createdAt,
    };
  }
}
