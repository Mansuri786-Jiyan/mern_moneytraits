import { z } from "zod";

export const createGoalSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  targetAmount: z.number().positive("Target amount must be positive"),
  currentAmount: z.number().min(0).default(0),
  deadline: z.string().optional().refine((val) => !val || !isNaN(Date.parse(val)), {
    message: "Invalid date format",
  }),
});

export const updateGoalSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  targetAmount: z.number().positive().optional(),
  currentAmount: z.number().min(0).optional(),
  deadline: z.string().optional().refine((val) => !val || !isNaN(Date.parse(val)), {
    message: "Invalid date format",
  }),
  status: z.enum(["ACTIVE", "COMPLETED"]).optional(),
});
