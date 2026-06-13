import { z } from "zod";

export const createExpenseSchema = z.object({
  description: z.string().min(1, "Descrição é obrigatória"),
  amount: z
    .number({ error: "Valor deve ser um número" })
    .positive("O valor deve ser positivo"),
  date: z.coerce.date({ message: "Data inválida" }),
  category: z.string().min(1, "Categoria é obrigatória"),
});

export const updateExpenseSchema = z
  .object({
    description: z.string().min(1, "Descrição não pode ser vazia").optional(),
    amount: z
      .number({ error: "Valor deve ser um número" })
      .positive("O valor deve ser positivo")
      .optional(),
    date: z.coerce.date({ message: "Data inválida" }).optional(),
    category: z.string().min(1, "Categoria não pode ser vazia").optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "Pelo menos um campo deve ser informado",
  });

export const listExpensesSchema = z.object({
  category: z.string().optional(),
  from: z.coerce.date({ message: "Data 'from' inválida" }).optional(),
  to: z.coerce.date({ message: "Data 'to' inválida" }).optional(),
});
