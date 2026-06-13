import { z } from "zod";
import { createExpenseSchema } from "./schemas";

export type CreateExpenseInput = z.infer<typeof createExpenseSchema>;
