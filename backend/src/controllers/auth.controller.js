import { HTTPSTATUS } from "../config/http.config.js";
import { asyncHandler } from "../middlewares/asyncHandler.middlerware.js";
import { registerSchema, loginSchema } from "../validators/auth.validator.js";
import { registerService, loginService, refreshTokenService, verifyEmailService } from "../services/auth.service.js";

export const registerController = asyncHandler(async (req, res) => {
    const body = registerSchema.parse(req.body);

    const result = await registerService(body);

    return res.status(HTTPSTATUS.CREATED).json({
        message: "User registered successfully",
        data: result,
    });
});

export const loginController = asyncHandler(async (req, res) => {
    const body = loginSchema.parse({
        ...req.body,
    });
    const { user, accessToken, expiresAt, reportSetting } = await loginService(body);
    return res.status(HTTPSTATUS.OK).json({
        message: "User logged in successfully",
        user,
        accessToken,
        expiresAt,
        reportSetting,
    });
});

export const refreshTokenController = asyncHandler(async (req, res) => {
    // Extract the token from the Authorization header
    const authHeader = req.headers.authorization;
    const token = authHeader?.startsWith("Bearer ")
        ? authHeader.split(" ")[1]
        : null;

    const result = await refreshTokenService(token);
    return res.status(HTTPSTATUS.OK).json({
        message: "Token refreshed successfully",
        ...result,
    });
});

export const logoutController = asyncHandler(async (req, res) => {
    // Since we're using stateless JWTs, logout is handled client-side
    // This endpoint exists for the frontend to call
    return res.status(HTTPSTATUS.OK).json({
        message: "Logged out successfully",
    });
});

export const verifyEmailController = asyncHandler(async (req, res) => {
    const { email, otp } = req.body;
    if (!email || !otp) {
        return res.status(400).json({ message: "Email and OTP are required" });
    }
    const result = await verifyEmailService(email, otp);
    return res.status(HTTPSTATUS.OK).json(result);
});

