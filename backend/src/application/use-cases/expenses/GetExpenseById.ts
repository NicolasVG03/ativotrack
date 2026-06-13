import { IExpenseRepository } from "../../../domain/repositories/IExpenseRepository";
import { Expense } from "../../../domain/entities/Expense";
import { AppError } from "../../errors/AppError";

type Input = { id: string; userId: string };

export class GetExpenseById {
  constructor(private readonly expenseRepository: IExpenseRepository) {}

  async execute({ id, userId }: Input): Promise<Expense> {
    const expense = await this.expenseRepository.findById(id);
    if (!expense || expense.userId !== userId) {
      throw new AppError("Despesa não encontrada", 404);
    }
    return expense;
  }
}
