import { z } from "zod";
import { registerSchema } from "./schemas";

export type RegisterUserInput = z.infer<typeof registerSchema>;