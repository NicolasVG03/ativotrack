import { IExpenseRepository } from "../../../domain/repositories/IExpenseRepository";
import { Expense } from "../../../domain/entities/Expense";
import { ListExpensesInput } from "../../dtos/expenses/ListExpensesInput";

type Input = ListExpensesInput & { userId: string };

export class ListExpenses {
  constructor(private readonly expenseRepository: IExpenseRepository) {}

  async execute({ userId, ...filters }: Input): Promise<Expense[]> {
    return this.expenseRepository.findAllByUserId(userId, filters);
  }
}
