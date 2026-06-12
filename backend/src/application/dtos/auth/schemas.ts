import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(2, "Nome deve ter ao menos 2 caracteres"),
  email: z.email("Email inválido"),
  password: z.string().min(6, "Senha deve ter ao menos 6 caracteres"),
});

export const loginSchema = z.object({
  email: z.email("Email inválido"),
  password: z.string().min(1, "Senha é obrigatória"),
});

export const googleAuthSchema = z.object({
  idToken: z.string().min(1, "idToken é obrigatório"),
});