import { Expense } from "../entities/Expense";

export type ExpenseSummary = {
  total: number;
  count: number;
  byCategory: Record<string, number>;
};

export type ExpenseFilters = {
  category?: string;
  from?: Date;
  to?: Date;
};

export interface IExpenseRepository {
  create(expense: Expense): Promise<Expense>;
  findById(id: string): Promise<Expense | null>;
  findAllByUserId(userId: string, filters?: ExpenseFilters): Promise<Expense[]>;
  update(expense: Expense): Promise<Expense>;
  delete(id: string): Promise<void>;
  getSummaryByUserId(userId: string): Promise<ExpenseSummary>;
}