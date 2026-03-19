import { z } from "zod";

export const updateUserSchema = z.object({
    name: z.string().trim().min(1).max(255).optional(),
});

export const updateUserRoleSchema = z.object({
    role: z.enum(["USER", "ADMIN"]),
});
