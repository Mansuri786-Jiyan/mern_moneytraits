import { Env } from "../config/env.config.js";
import { transporter } from "../config/nodemailer.config.js";

const mailer_sender = `Moneytraits <${Env.MAIL_USER}>`;

export const sendEmail = async ({ to, from = mailer_sender, subject, text, html, }) => {
    try {
        return await transporter.sendMail({
            from,
            to: Array.isArray(to) ? to.join(", ") : to,
            text,
            subject,
            html,
        });
    }
    catch (error) {
        console.error("Error sending email via Nodemailer:", error);
        throw error;
    }
};
