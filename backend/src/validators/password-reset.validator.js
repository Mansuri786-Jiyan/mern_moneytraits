import { z } from "zod";
import { emailSchema, passwordSchema } from "./auth.validator.js";

export const forgotPasswordSchema = z.object({ 
    email: emailSchema 
});

export const verifyOtpSchema = z.object({ 
    email: emailSchema, 
    otp: z.string().length(6, "OTP must be exactly 6 digits") 
});

export const resetPasswordSchema = z.object({ 
    email: emailSchema, 
    otp: z.string().length(6, "OTP must be exactly 6 digits"),
    newPassword: passwordSchema
});
