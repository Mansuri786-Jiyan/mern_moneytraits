import UserModel from "../models/user.model.js";
import { UnauthorizedException, NotFoundException } from "../utils/app-error.js";
import ReportSettingModel, { ReportFrequencyEnum } from "../models/report-setting.model.js";
import { calulateNextReportDate } from "../utils/helper.js";
import { signJwtToken } from "../utils/jwt.js";
import jwt from "jsonwebtoken";
import { Env } from "../config/env.config.js";

export const registerService = async (body) => {
    const { email } = body;
    const existingUser = await UserModel.findOne({ email });
    if (existingUser)
        throw new UnauthorizedException("User already exists");

    const newUser = new UserModel({
        ...body,
    });
    await newUser.save();

    const reportSetting = new ReportSettingModel({
        userId: newUser._id,
        frequency: ReportFrequencyEnum.MONTHLY,
        isEnabled: true,
        nextReportDate: calulateNextReportDate(),
        lastSentDate: null,
    });
    await reportSetting.save();

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

export const refreshTokenService = async (accessToken) => {
    if (!accessToken) {
        throw new UnauthorizedException("No token provided");
    }

    // Decode the token (even if expired) to get the userId
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

    // Issue a new access token
    const { token, expiresAt } = signJwtToken({ userId: user.id });
    return {
        accessToken: token,
        expiresAt,
    };
};
