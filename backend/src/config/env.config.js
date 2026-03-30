import { config } from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { getEnv } from "../utils/get-env.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

config({
    path: path.resolve(__dirname, "../../.env"),
});

const envConfig = () => {
    const config = {
        NODE_ENV: getEnv("NODE_ENV", "development"),
        PORT: Number(getEnv("PORT", "8000")),
        BASE_PATH: getEnv("BASE_PATH", "/api"),
        MONGO_URI: getEnv("MONGO_URI"),
        JWT_SECRET: getEnv("JWT_SECRET"),
        JWT_EXPIRES_IN: getEnv("JWT_EXPIRES_IN", "15m"),
        JWT_REFRESH_SECRET: getEnv("JWT_REFRESH_SECRET"),
        JWT_REFRESH_EXPIRES_IN: getEnv("JWT_REFRESH_EXPIRES_IN", "7d"),
        GEMINI_API_KEY: getEnv("GEMINI_API_KEY"),
        CLOUDINARY_CLOUD_NAME: getEnv("CLOUDINARY_CLOUD_NAME"),
        CLOUDINARY_API_KEY: getEnv("CLOUDINARY_API_KEY"),
        CLOUDINARY_API_SECRET: getEnv("CLOUDINARY_API_SECRET"),
        SMTP_HOST: getEnv("SMTP_HOST", "127.0.0.1"),
        SMTP_PORT: Number(getEnv("SMTP_PORT", "587")),
        MAIL_USER: getEnv("MAIL_USER"),
        MAIL_PASS: getEnv("MAIL_PASS"),
        FRONTEND_ORIGIN: getEnv("FRONTEND_ORIGIN", "localhost"),
    };
    return config;
};

export const Env = envConfig();
