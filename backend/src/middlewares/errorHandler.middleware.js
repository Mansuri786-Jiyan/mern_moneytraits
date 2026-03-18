import { ZodError } from "zod";
import { HTTPSTATUS } from "../config/http.config.js";
import { AppError } from "../utils/app-error.js";
import { ErrorCodeEnum } from "../enums/error-code.enum.js";
import { MulterError } from "multer";

const formatZodError = (res, error) => {
    const errors = error?.issues?.map((err) => ({
        field: err.path.join("."),
        message: err.message,
    }));
    return res.status(HTTPSTATUS.BAD_REQUEST).json({
        message: "Validation failed",
        errors: errors,
        errorCode: ErrorCodeEnum.VALIDATION_ERROR,
    });
};

const handleMulterError = (error) => {
    const messages = {
        LIMIT_UNEXPECTED_FILE: "Invalid file field name. Please use 'file'",
        LIMIT_FILE_SIZE: "File size exceeds the limit",
        LIMIT_FILE_COUNT: "Too many files uploaded",
        default: "File upload error",
    };
    return {
        status: HTTPSTATUS.BAD_REQUEST,
        message: messages[error.code] || messages.default,
        error: error.message,
    };
};

export const errorHandler = (error, req, res, next) => {
    if (error.name === "ZodError" || error instanceof ZodError) {
        return formatZodError(res, error);
    }
    if (error instanceof MulterError) {
        const { status, message, error: err } = handleMulterError(error);
        return res.status(status).json({
            message,
            error: err,
            errorCode: ErrorCodeEnum.FILE_UPLOAD_ERROR,
        });
    }
    if (error instanceof AppError) {
        return res.status(error.statusCode).json({
            message: error.message,
            errorCode: error.errorCode,
        });
    }
    return res.status(HTTPSTATUS.INTERNAL_SERVER_ERROR).json({
        message: "Internal Server Error",
        error: error?.message || "Unknow error occurred",
    });
};
