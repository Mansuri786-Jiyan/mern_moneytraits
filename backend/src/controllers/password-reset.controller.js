import { HTTPSTATUS } from "../config/http.config.js";
import { asyncHandler } from "../middlewares/asyncHandler.middlerware.js";
import { 
    forgotPasswordSchema, 
    verifyOtpSchema, 
    resetPasswordSchema 
} from "../validators/password-reset.validator.js";
import { 
    forgotPasswordService, 
    verifyOtpService, 
    resetPasswordService 
} from "../services/password-reset.service.js";

export const forgotPasswordController = asyncHandler(async (req, res) => {
    const { email } = forgotPasswordSchema.parse(req.body);
    const result = await forgotPasswordService(email);
    
    return res.status(HTTPSTATUS.OK).json({
        message: result.message,
    });
});

export const verifyOtpController = asyncHandler(async (req, res) => {
    const { email, otp } = verifyOtpSchema.parse(req.body);
    const result = await verifyOtpService(email, otp);
    
    return res.status(HTTPSTATUS.OK).json({
        message: "OTP verified successfully",
        valid: result.valid,
    });
});

export const resetPasswordController = asyncHandler(async (req, res) => {
    const { email, otp, newPassword } = resetPasswordSchema.parse(req.body);
    const result = await resetPasswordService(email, otp, newPassword);
    
    return res.status(HTTPSTATUS.OK).json({
        message: result.message,
    });
});
