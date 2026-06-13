import { Request, Response, NextFunction } from "express";
import { CreateExpense } from "../../../application/use-cases/expenses/CreateExpense";
import { ListExpenses } from "../../../application/use-cases/expenses/ListExpenses";
import { GetExpenseById } from "../../../application/use-cases/expenses/GetExpenseById";
import { UpdateExpense } from "../../../application/use-cases/expenses/UpdateExpense";
import { DeleteExpense } from "../../../application/use-cases/expenses/DeleteExpense";
import { GetExpensesSummary } from "../../../application/use-cases/expenses/GetExpensesSummary";

export class ExpenseController {
  constructor(
    private readonly createExpense: CreateExpense,
    private readonly listExpenses: ListExpenses,
    private readonly getExpenseById: GetExpenseById,
    private readonly updateExpense: UpdateExpense,
    private readonly deleteExpense: DeleteExpense,
    private readonly getExpensesSummary: GetExpensesSummary,
  ) {}

  create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const expense = await this.createExpense.execute({ ...req.body, userId: req.userId });
      res.status(201).json(expense);
    } catch (err) {
      next(err);
    }
  };

  list = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const expenses = await this.listExpenses.execute({ ...req.query, userId: req.userId });
      res.status(200).json(expenses);
    } catch (err) {
      next(err);
    }
  };

  getById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const expense = await this.getExpenseById.execute({ id: req.params.id as string, userId: req.userId });
      res.status(200).json(expense);
    } catch (err) {
      next(err);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const expense = await this.updateExpense.execute({ ...req.body, id: req.params.id as string, userId: req.userId });
      res.status(200).json(expense);
    } catch (err) {
      next(err);
    }
  };

  delete = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await this.deleteExpense.execute({ id: req.params.id as string, userId: req.userId });
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  };

  summary = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.getExpensesSummary.execute({ userId: req.userId });
      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  };
}
