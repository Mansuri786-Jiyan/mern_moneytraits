import { z } from "zod";

export const setBudgetSchema = z.object({
  category: z.string().min(1, "Category is required"),
  limitAmount: z.number().positive("Limit must be a positive number"),
  month: z.number().min(1).max(12).optional(),
  year: z.number().optional(),
});

export const getBudgetsSchema = z.object({
  month: z.coerce.number().min(1).max(12),
  year: z.coerce.number(),
});
