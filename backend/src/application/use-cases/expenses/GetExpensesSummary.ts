import { IExpenseRepository, ExpenseSummary } from "../../../domain/repositories/IExpenseRepository";

type Input = { userId: string };

export class GetExpensesSummary {
  constructor(private readonly expenseRepository: IExpenseRepository) {}

  async execute({ userId }: Input): Promise<ExpenseSummary> {
    return this.expenseRepository.getSummaryByUserId(userId);
  }
}
