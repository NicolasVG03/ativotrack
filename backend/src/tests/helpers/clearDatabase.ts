import { prisma } from "../../infrastructure/database/prisma/cliente";

export async function clearDatabase() {
  await prisma.expense.deleteMany();
  await prisma.user.deleteMany();
}