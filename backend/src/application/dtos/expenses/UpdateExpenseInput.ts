import { z } from "zod";
import { updateExpenseSchema } from "./schemas";

export type UpdateExpenseInput = z.infer<typeof updateExpenseSchema>;
