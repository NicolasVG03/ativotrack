import { IExpenseRepository } from "../../../domain/repositories/IExpenseRepository";
import { Expense } from "../../../domain/entities/Expense";
import { AppError } from "../../errors/AppError";
import { UpdateExpenseInput } from "../../dtos/expenses/UpdateExpenseInput";

type Input = UpdateExpenseInput & { id: string; userId: string };

export class UpdateExpense {
  constructor(private readonly expenseRepository: IExpenseRepository) {}

  async execute({ id, userId, ...fields }: Input): Promise<Expense> {
    const expense = await this.expenseRepository.findById(id);
    if (!expense || expense.userId !== userId) {
      throw new AppError("Despesa não encontrada", 404);
    }
    if (fields.amount !== undefined && fields.amount <= 0) {
      throw new AppError("O valor deve ser positivo");
    }
    return this.expenseRepository.update({ ...expense, ...fields });
  }
}
