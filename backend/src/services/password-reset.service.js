import UserModel from "../models/user.model.js";
import PasswordResetTokenModel from "../models/password-reset-token.model.js";
import { sendPasswordResetEmail } from "../mailers/password-reset.mailer.js";
import { NotFoundException, BadRequestException } from "../utils/app-error.js";

export const forgotPasswordService = async (email) => {
    const user = await UserModel.findOne({ email });
    if (!user) {
        throw new NotFoundException("User not found");
    }

    // Delete existing unused tokens for this user
    await PasswordResetTokenModel.deleteMany({ userId: user._id, used: false });

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Create token
    await PasswordResetTokenModel.create({
        userId: user._id,
        token: otp,
        expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
    });

    // Send email
    await sendPasswordResetEmail({
        email: user.email,
        username: user.name,
        otp,
    });

    return { message: "OTP sent to your email" };
};

export const verifyOtpService = async (email, otp) => {
    const user = await UserModel.findOne({ email });
    if (!user) {
        throw new NotFoundException("User not found");
    }

    const token = await PasswordResetTokenModel.findOne({
        userId: user._id,
        token: otp,
        used: false,
        expiresAt: { $gt: new Date() },
    });

    if (!token) {
        throw new BadRequestException("Invalid or expired OTP");
    }

    return { valid: true };
};

export const resetPasswordService = async (email, otp, newPassword) => {
    const user = await UserModel.findOne({ email });
    if (!user) {
        throw new NotFoundException("User not found");
    }

    const token = await PasswordResetTokenModel.findOne({
        userId: user._id,
        token: otp,
        used: false,
        expiresAt: { $gt: new Date() },
    });

    if (!token) {
        throw new BadRequestException("Invalid or expired OTP");
    }

    // Assign new password. The pre-save hook in UserModel handles hashing.
    user.password = newPassword;
    await user.save();

    // Mark token as used
    token.used = true;
    await token.save();

    return { message: "Password reset successfully" };
};
