import UserModel from "../models/user.model.js";
import { BadRequestException, UnauthorizedException, NotFoundException } from "../utils/app-error.js";
import ReportSettingModel, { ReportFrequencyEnum } from "../models/report-setting.model.js";
import PasswordResetTokenModel from "../models/password-reset-token.model.js";
import { calulateNextReportDate } from "../utils/helper.js";
import { signJwtToken } from "../utils/jwt.js";
import { sendEmailVerificationOtp } from "../mailers/email-verification.mailer.js";
import jwt from "jsonwebtoken";
import { Env } from "../config/env.config.js";

export const registerService = async (body) => {
    const { name, email, password } = body;

    const existingUser = await UserModel.findOne({ email });

    // ✅ HANDLE EXISTING USER
    if (existingUser) {
        if (existingUser.isEmailVerified) {
            // If already verified → block
            throw new UnauthorizedException("User already exists");
        } else {
            // 🔥 If NOT verified → delete old user
            await UserModel.deleteOne({ _id: existingUser._id });
            await PasswordResetTokenModel.deleteMany({ userId: existingUser._id });
            await ReportSettingModel.deleteMany({ userId: existingUser._id });
        }
    }

    // ✅ Create new user
    const newUser = new UserModel({
        name,
        email,
        password,
        role: "USER",
        isEmailVerified: false,
    });

    await newUser.save();

    // ✅ Create report settings
    const reportSetting = new ReportSettingModel({
        userId: newUser._id,
        frequency: ReportFrequencyEnum.MONTHLY,
        isEnabled: true,
        nextReportDate: calulateNextReportDate(),
        lastSentDate: null,
    });
    await reportSetting.save();

    // ✅ Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    await PasswordResetTokenModel.deleteMany({
        userId: newUser._id,
        used: false,
    });

    await PasswordResetTokenModel.create({
        userId: newUser._id,
        token: otp,
        expiresAt: new Date(Date.now() + 15 * 60 * 1000),
    });

    // ✅ Send email
    try {
        await sendEmailVerificationOtp({
            email: newUser.email,
            username: newUser.name,
            otp,
        });
    } catch (error) {
        console.error("Email failed:", error);

        // 🔥 rollback user if email fails
        await UserModel.deleteOne({ _id: newUser._id });
        await PasswordResetTokenModel.deleteMany({ userId: newUser._id });
        await ReportSettingModel.deleteMany({ userId: newUser._id });

        throw new Error("Failed to send verification email. Please try again.");
    }

    return { user: newUser.omitPassword() };
};

export const loginService = async (body) => {
    const { email, password } = body;
    const user = await UserModel.findOne({ email });
    if (!user)
        throw new NotFoundException("Email/password not found");
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid)
        throw new UnauthorizedException("Invalid email/password");

    // Block login if email is not verified
    if (!user.isEmailVerified) {
        throw new UnauthorizedException("Please verify your email before logging in. Check your inbox for the OTP.");
    }

    const { token, expiresAt } = signJwtToken({ userId: user.id });
    const reportSetting = await ReportSettingModel.findOne({
        userId: user.id,
    }, { _id: 1, frequency: 1, isEnabled: 1 }).lean();
    return {
        user: user.omitPassword(),
        accessToken: token,
        expiresAt,
        reportSetting,
    };
};

export const verifyEmailService = async (email, otp) => {
    const user = await UserModel.findOne({ email });
    if (!user) {
        throw new NotFoundException("User not found");
    }

    if (user.isEmailVerified) {
        throw new BadRequestException("Email is already verified");
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

    // Mark email as verified
    user.isEmailVerified = true;
    await user.save();

    // Mark OTP as used
    token.used = true;
    await token.save();

    return { message: "Email verified successfully. You can now log in." };
};

export const refreshTokenService = async (accessToken) => {
    if (!accessToken) {
        throw new UnauthorizedException("No token provided");
    }

    let decoded;
    try {
        decoded = jwt.verify(accessToken, Env.JWT_SECRET, {
            ignoreExpiration: true,
        });
    } catch {
        throw new UnauthorizedException("Invalid token");
    }

    if (!decoded?.userId) {
        throw new UnauthorizedException("Invalid token payload");
    }

    const user = await UserModel.findById(decoded.userId);
    if (!user) {
        throw new UnauthorizedException("User not found");
    }

    const { token, expiresAt } = signJwtToken({ userId: user.id });
    return {
        accessToken: token,
        expiresAt,
        user: user.omitPassword(),
    };
};