import { HTTPSTATUS } from "../config/http.config.js";
import { asyncHandler } from "../middlewares/asyncHandler.middlerware.js";
import { registerSchema, loginSchema } from "../validators/auth.validator.js";
import { registerService, loginService } from "../services/auth.service.js";

export const registerController = asyncHandler(async (req, res) => {
    console.log("Register Request Body:", req.body);
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
