import { z } from "zod";

export const updateUserSchema = z.object({
    name: z.string().trim().min(1).max(255).optional(),
});

export const updateUserRoleSchema = z.object({
    role: z.enum(["USER", "ADMIN"]),
});

export const changePasswordSchema = z.object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z.string().min(6, "New password must be at least 6 characters"),
});

export const requestEmailUpdateSchema = z.object({
    password: z.string().min(1, "Password is required to verify identity"),
    newEmail: z.string().email("Invalid email address"),
});

export const verifyEmailUpdateSchema = z.object({
    otp: z.string().length(6, "OTP must be 6 digits"),
});
