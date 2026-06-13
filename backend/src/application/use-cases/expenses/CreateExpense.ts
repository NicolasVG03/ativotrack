import { randomUUID } from "crypto";
import { IExpenseRepository } from "../../../domain/repositories/IExpenseRepository";
import { Expense } from "../../../domain/entities/Expense";
import { AppError } from "../../errors/AppError";
import { CreateExpenseInput } from "../../dtos/expenses/CreateExpenseInput";

type Input = CreateExpenseInput & { userId: string };

export class CreateExpense {
  constructor(private readonly expenseRepository: IExpenseRepository) {}

  async execute(input: Input): Promise<Expense> {
    if (input.amount <= 0) throw new AppError("O valor deve ser positivo");

    return this.expenseRepository.create({
      id: randomUUID(),
      ...input,
    });
  }
}
