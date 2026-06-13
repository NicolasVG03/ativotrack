import { z } from "zod";
import { listExpensesSchema } from "./schemas";

export type ListExpensesInput = z.infer<typeof listExpensesSchema>;
