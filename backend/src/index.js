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
import categoryRoutes from "./routes/category.route.js";

const app = express();
const BASE_PATH = Env.BASE_PATH;

// CORS configuration — allow all localhost ports for local dev, plus production origins
const productionOrigins = [
  "https://mern-moneytraits-gtwj.vercel.app",
  "https://mern-moneytraits.vercel.app",
  Env.FRONTEND_ORIGIN,
].filter(Boolean).map(o => o.trim().replace(/\/$/, ""));

app.use(cors({
  origin: function (origin, callback) {
    // Allow server-to-server requests (no origin header)
    if (!origin) return callback(null, true);

    const normalizedOrigin = origin.trim().replace(/\/$/, "");

    // Allow ALL localhost ports for local development
    const isLocalhost = normalizedOrigin.startsWith("http://localhost:") ||
                        normalizedOrigin.startsWith("http://127.0.0.1:");

    // Allow all Vercel deployments (covers preview URLs too)
    const isVercel = normalizedOrigin.endsWith(".vercel.app");

    // Allow explicitly listed production origins
    const isProduction = productionOrigins.includes(normalizedOrigin);

    if (isLocalhost || isVercel || isProduction) {
      callback(null, true);
    } else {
      console.log(`CORS Blocked: ${origin}`);
      callback(new Error(`CORS not allowed for origin: ${origin}`));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "X-Requested-With",
    "Accept",
    "Origin",
  ],
  credentials: true,
  preflightContinue: false,
  optionsSuccessStatus: 204
}));

// Express pre-flighting with Express 5 support removed because app.use(cors()) is sufficient 
// and '*' throws a path-to-regexp Missing parameter name error.

// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(passport.initialize());

// Health check route
app.get("/", asyncHandler(async (req, res) => {
  console.log("Health check hit! SMTP_HOST = ", Env.SMTP_HOST);
  res.status(HTTPSTATUS.OK).json({
    message: "Backend API is running",
    smtpHost: Env.SMTP_HOST // Temp to debug what Render sees!
  });
}));

// Routes
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
app.use(`${BASE_PATH}/category`, passportAuthenticateJwt, categoryRoutes);
app.use(`${BASE_PATH}/admin`, adminRoutes);

// Error handler
app.use(errorHandler);

// Start server
app.listen(Env.PORT, async () => {
  console.log(`Server running on port ${Env.PORT}`);
  await connectDatabase();
  await initializeCrons();
});