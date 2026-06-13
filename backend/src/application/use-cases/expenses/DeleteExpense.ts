import { IExpenseRepository } from "../../../domain/repositories/IExpenseRepository";
import { AppError } from "../../errors/AppError";

type Input = { id: string; userId: string };

export class DeleteExpense {
  constructor(private readonly expenseRepository: IExpenseRepository) {}

  async execute({ id, userId }: Input): Promise<void> {
    const expense = await this.expenseRepository.findById(id);
    if (!expense || expense.userId !== userId) {
      throw new AppError("Despesa não encontrada", 404);
    }
    await this.expenseRepository.delete(id);
  }
}
