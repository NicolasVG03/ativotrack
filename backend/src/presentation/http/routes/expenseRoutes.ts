import { Router, RequestHandler } from "express";
import { ExpenseController } from "../controllers/ExpenseController";
import { validate } from "../middlewares/validate";
import { validateQuery } from "../middlewares/validateQuery";
import { createExpenseSchema, updateExpenseSchema, listExpensesSchema } from "../../../application/dtos/expenses/schemas";

export function expenseRoutes(controller: ExpenseController, authMiddleware: RequestHandler): Router {
  const router = Router();

  router.use(authMiddleware);

  router.post("/", validate(createExpenseSchema), controller.create);
  router.get("/", validateQuery(listExpensesSchema), controller.list);
  router.get("/summary", controller.summary);
  router.get("/:id", controller.getById);
  router.put("/:id", validate(updateExpenseSchema), controller.update);
  router.delete("/:id", controller.delete);

  return router;
}
