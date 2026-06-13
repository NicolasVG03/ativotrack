import { Expense } from "../../domain/entities/Expense";
import {
  ExpenseFilters,
  ExpenseSummary,
  IExpenseRepository,
} from "../../domain/repositories/IExpenseRepository";

export class InMemoryExpenseRepository implements IExpenseRepository {
  private items: Expense[] = [];

  async create(expense: Expense): Promise<Expense> {
    this.items.push(expense);
    return expense;
  }

  async findById(id: string): Promise<Expense | null> {
    return this.items.find((e) => e.id === id) ?? null;
  }

  async findAllByUserId(userId: string, filters?: ExpenseFilters): Promise<Expense[]> {
    return this.items.filter((e) => {
      if (e.userId !== userId) return false;
      if (filters?.category && e.category !== filters.category) return false;
      if (filters?.from && e.date < filters.from) return false;
      if (filters?.to && e.date > filters.to) return false;
      return true;
    });
  }

  async update(expense: Expense): Promise<Expense> {
    const index = this.items.findIndex((e) => e.id === expense.id);
    this.items[index] = expense;
    return expense;
  }

  async delete(id: string): Promise<void> {
    this.items = this.items.filter((e) => e.id !== id);
  }

  async getSummaryByUserId(userId: string): Promise<ExpenseSummary> {
    const expenses = this.items.filter((e) => e.userId === userId);
    const byCategory: Record<string, number> = {};

    for (const expense of expenses) {
      byCategory[expense.category] = (byCategory[expense.category] ?? 0) + expense.amount;
    }

    return {
      total: expenses.reduce((sum, e) => sum + e.amount, 0),
      count: expenses.length,
      byCategory,
    };
  }
}
