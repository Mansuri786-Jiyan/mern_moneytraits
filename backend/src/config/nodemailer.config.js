import nodemailer from "nodemailer";
import { Env } from "./env.config.js";

export const transporter = nodemailer.createTransport({
    host: Env.SMTP_HOST,
    port: Number(Env.SMTP_PORT),
    secure: false,
    auth: {
        user: Env.MAIL_USER,
        pass: Env.MAIL_PASS,
    },
});