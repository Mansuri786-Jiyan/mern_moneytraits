import "./config/passport.config.js";
import express from "express";
import cors from "cors";
import passport from "passport";
import { Env } from "./config/env.config.js";
import { HTTPSTATUS } from "./config/http.config.js";
import { errorHandler } from "./middlewares/errorHandler.middleware.js";
import { asyncHandler } from "./middlewares/asyncHandler.middlerware.js";
import connectDatabase from "./config/database.config.js";
import authRoutes from "./routes/auth.route.js";
import passwordResetRoutes from "./routes/password-reset.route.js";
import { passportAuthenticateJwt } from "./config/passport.config.js";
import userRoutes from "./routes/user.route.js";
import transactionRoutes from "./routes/transaction.route.js";
import { initializeCrons } from "./cron/index.js";
import reportRoutes from "./routes/report.route.js";
import analyticsRoutes from "./routes/analytics.route.js";
import adminRoutes from "./routes/admin.route.js";
import budgetRoutes from "./routes/budget.route.js";
import goalRoutes from "./routes/goal.route.js";
import aiRoutes from "./routes/ai.route.js";
import categorizeRoutes from "./routes/categorize.route.js";
import forecastRoutes from "./routes/forecast.route.js";
import chatbotRoutes from "./routes/chatbot.route.js";

const app = express();
const BASE_PATH = Env.BASE_PATH;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());


app.use(cors({
    origin(origin, callback) {
        if (!origin || origin === Env.FRONTEND_ORIGIN || /^https?:\/\/localhost:\d+$/.test(origin)) {
            callback(null, true);
            return;
        }
        callback(new Error("CORS not allowed for this origin"));
    },
    credentials: true,
}));


app.get("/", asyncHandler(async (req, res, next) => {
    res.status(HTTPSTATUS.OK).json({
        message: "Backend API is running",
    });
}));

app.use(`${BASE_PATH}/auth`, authRoutes);
app.use(`${BASE_PATH}/auth`, passwordResetRoutes);
app.use(`${BASE_PATH}/user`, passportAuthenticateJwt, userRoutes);
app.use(`${BASE_PATH}/transaction`, passportAuthenticateJwt, transactionRoutes);
app.use(`${BASE_PATH}/report`, passportAuthenticateJwt, reportRoutes);
app.use(`${BASE_PATH}/analytics`, passportAuthenticateJwt, analyticsRoutes);
app.use(`${BASE_PATH}/budget`, passportAuthenticateJwt, budgetRoutes);
app.use(`${BASE_PATH}/goal`, passportAuthenticateJwt, goalRoutes);
app.use(`${BASE_PATH}/ai`, passportAuthenticateJwt, aiRoutes);
app.use(`${BASE_PATH}/categorize`, passportAuthenticateJwt, categorizeRoutes);
app.use(`${BASE_PATH}/forecast`, passportAuthenticateJwt, forecastRoutes);
app.use(`${BASE_PATH}/chatbot`, passportAuthenticateJwt, chatbotRoutes);
app.use(`${BASE_PATH}/admin`, adminRoutes);

app.use(errorHandler);

app.listen(Env.PORT, async () => {
    await connectDatabase();
    await initializeCrons();
});
