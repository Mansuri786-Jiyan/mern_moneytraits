import nodemailer from "nodemailer";
import { Env } from "./env.config.js";

export const transporter = nodemailer.createTransport({
    host: Env.SMTP_HOST,
    port: Number(Env.SMTP_PORT),
    secure: Number(Env.SMTP_PORT) === 465,
    auth: {
        user: Env.MAIL_USER,
        pass: Env.MAIL_PASS,
    },
});
