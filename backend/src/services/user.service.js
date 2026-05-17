import UserModel from "../models/user.model.js";
import TransactionModel from "../models/transaction.model.js";
import BudgetModel from "../models/budget.model.js";
import GoalModel from "../models/goal.model.js";
import CategoryModel from "../models/category.model.js";
import ReportModel from "../models/report.model.js";
import ReportSettingModel from "../models/report-setting.model.js";
import PasswordResetTokenModel from "../models/password-reset-token.model.js";
import EmailVerificationTokenModel from "../models/email-verification-token.model.js";
import { sendEmail } from "../mailers/mailer.js";
import { BadRequestException, NotFoundException } from "../utils/app-error.js";
import crypto from "crypto";

export const findByIdUserService = async (userId) => {
    const user = await UserModel.findById(userId);
    return user?.omitPassword();
};

export const updateUserService = async (userId, body, profilePic) => {
    const user = await UserModel.findById(userId);
    if (!user)
        throw new NotFoundException("User not found");

    if (profilePic) {
        user.profilePicture = profilePic.path;
    }
    if (body.name) {
        user.name = body.name;
    }
    await user.save();
    return user.omitPassword();
};

export const changeUserPasswordService = async (userId, currentPassword, newPassword) => {
    const user = await UserModel.findById(userId).select("+password");
    if (!user) throw new NotFoundException("User not found");

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
        throw new BadRequestException("Invalid current password");
    }

    user.password = newPassword;
    await user.save();
    return user.omitPassword();
};

export const deleteUserAccountService = async (userId) => {
    const user = await UserModel.findById(userId);
    if (!user) throw new NotFoundException("User not found");

    await TransactionModel.deleteMany({ userId });
    await BudgetModel.deleteMany({ userId });
    await GoalModel.deleteMany({ userId });
    await CategoryModel.deleteMany({ userId });
    await ReportModel.deleteMany({ userId });
    await ReportSettingModel.deleteMany({ userId });
    await PasswordResetTokenModel.deleteMany({ userId });

    await UserModel.findByIdAndDelete(userId);
    return true;
};

export const listUsersService = async () => {
    return UserModel.find({}, {
        name: 1,
        email: 1,
        profilePicture: 1,
        role: 1,
        createdAt: 1,
    }).sort({ createdAt: -1 }).lean();
};

export const updateUserRoleService = async (targetUserId, role, currentUserId) => {
    if (String(targetUserId) === String(currentUserId) && role !== "ADMIN") {
        throw new BadRequestException("You cannot remove your own admin role");
    }

    const user = await UserModel.findById(targetUserId);
    if (!user)
        throw new NotFoundException("User not found");

    user.role = role;
    await user.save();
    return user.omitPassword();
};

export const requestEmailUpdateService = async (userId, newEmail, password) => {
    const user = await UserModel.findById(userId).select("+password");
    if (!user) throw new NotFoundException("User not found");

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
        throw new BadRequestException("Invalid password. Identity verification failed.");
    }

    if (user.email === newEmail) {
        throw new BadRequestException("You are already using this email");
    }

    const existingUser = await UserModel.findOne({ email: newEmail });
    if (existingUser) {
        throw new BadRequestException("Email is already in use by another account");
    }

    // Generate 6-digit OTP
    const otp = crypto.randomInt(100000, 999999).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

    await EmailVerificationTokenModel.deleteMany({ userId });
    await EmailVerificationTokenModel.create({
        userId,
        newEmail,
        otp,
        expiresAt,
    });

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Verify Your New Email Address</h2>
        <p>You requested to change your email address. Please use the verification code below to complete the process.</p>
        <div style="background-color: #f4f4f4; padding: 15px; text-align: center; font-size: 24px; font-weight: bold; margin: 20px 0; letter-spacing: 2px;">
            ${otp}
        </div>
        <p>This code will expire in 10 minutes.</p>
        <p>If you did not request this change, please ignore this email and your address will not be changed.</p>
      </div>
    `;

    await sendEmail({
        to: newEmail,
        subject: "Verify your new email address",
        html,
    });

    return true;
};

export const verifyEmailUpdateService = async (userId, otp) => {
    const tokenRecord = await EmailVerificationTokenModel.findOne({ userId, otp });
    if (!tokenRecord) {
        throw new BadRequestException("Invalid or incorrect verification code");
    }

    if (tokenRecord.expiresAt < new Date()) {
        await EmailVerificationTokenModel.findByIdAndDelete(tokenRecord._id);
        throw new BadRequestException("Verification code has expired");
    }

    const user = await UserModel.findById(userId);
    if (!user) throw new NotFoundException("User not found");

    const existingUser = await UserModel.findOne({ email: tokenRecord.newEmail });
    if (existingUser) {
        throw new BadRequestException("Email is already in use by another account");
    }

    const oldEmail = user.email;
    user.email = tokenRecord.newEmail;
    user.isEmailVerified = true;
    await user.save();

    await EmailVerificationTokenModel.findByIdAndDelete(tokenRecord._id);

    // Send notification to the old email
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Security Notice: Email Address Changed</h2>
        <p>This is a confirmation that the email address associated with your account has been successfully changed from <strong>${oldEmail}</strong> to <strong>${user.email}</strong>.</p>
        <p>If you did not authorize this change, please contact support immediately to secure your account.</p>
      </div>
    `;

    try {
        await sendEmail({
            to: oldEmail,
            subject: "Security Notice: Your email address was changed",
            html,
        });
    } catch (error) {
        console.error("Failed to send old email notification:", error);
    }

    return user.omitPassword();
};
