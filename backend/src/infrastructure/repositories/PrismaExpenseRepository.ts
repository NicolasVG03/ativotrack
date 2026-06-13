import { Decimal } from "../../generated/prisma/internal/prismaNamespace";
import { Expense } from "../../domain/entities/Expense";
import { ExpenseFilters, ExpenseSummary, IExpenseRepository } from "../../domain/repositories/IExpenseRepository";
import { prisma } from "../database/prisma/cliente";

type PrismaExpense = {
  id: string;
  userId: string;
  amount: Decimal;
  description: string;
  date: Date;
  category: string;
};

export class PrismaExpenseRepository implements IExpenseRepository {
  async create(expense: Expense): Promise<Expense> {
    const created = await prisma.expense.create({
      data: {
        id: expense.id,
        userId: expense.userId,
        amount: expense.amount,
        description: expense.description,
        date: expense.date,
        category: expense.category,
      },
    });
    return this.toDomain(created);
  }

  async findById(id: string): Promise<Expense | null> {
    const found = await prisma.expense.findUnique({ where: { id } });
    return found ? this.toDomain(found) : null;
  }

  async findAllByUserId(userId: string, filters?: ExpenseFilters): Promise<Expense[]> {
    const found = await prisma.expense.findMany({
      where: {
        userId,
        ...(filters?.category && { category: filters.category }),
        ...((filters?.from || filters?.to) && {
          date: {
            ...(filters.from && { gte: filters.from }),
            ...(filters.to && { lte: filters.to }),
          },
        }),
      },
      orderBy: { date: "desc" },
    });
    return found.map(this.toDomain);
  }

  async update(expense: Expense): Promise<Expense> {
    const updated = await prisma.expense.update({
      where: { id: expense.id },
      data: {
        amount: expense.amount,
        description: expense.description,
        date: expense.date,
        category: expense.category,
      },
    });
    return this.toDomain(updated);
  }

  async delete(id: string): Promise<void> {
    await prisma.expense.delete({ where: { id } });
  }

  async getSummaryByUserId(userId: string): Promise<ExpenseSummary> {
    const [aggregate, groups] = await Promise.all([
      prisma.expense.aggregate({
        where: { userId },
        _sum: { amount: true },
        _count: { id: true },
      }),
      prisma.expense.groupBy({
        by: ["category"],
        where: { userId },
        _sum: { amount: true },
      }),
    ]);

    const byCategory: Record<string, number> = {};
    for (const group of groups) {
      byCategory[group.category] = group._sum.amount ? Number(group._sum.amount) : 0;
    }

    return {
      total: aggregate._sum.amount ? Number(aggregate._sum.amount) : 0,
      count: aggregate._count.id,
      byCategory,
    };
  }

  private toDomain(raw: PrismaExpense): Expense {
    return {
      id: raw.id,
      userId: raw.userId,
      amount: Number(raw.amount),
      description: raw.description,
      date: raw.date,
      category: raw.category,
    };
  }
}
