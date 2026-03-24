import { sendEmail } from "./mailer.js";
import { getPasswordResetEmailTemplate } from "./templates/password-reset.template.js";

export const sendPasswordResetEmail = async ({ email, username, otp }) => {
    const htmlTemplate = getPasswordResetEmailTemplate(username, otp);
    
    await sendEmail({
        to: email,
        subject: "Your Moneytraits password reset OTP",
        text: `Hi ${username}, your password reset OTP is: ${otp}. It expires in 10 minutes.`,
        html: htmlTemplate,
    });
};
