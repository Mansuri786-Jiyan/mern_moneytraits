import { sendEmail } from "./mailer.js";
import { getEmailVerificationTemplate } from "./templates/email-verification.template.js";

export const sendEmailVerificationOtp = async ({ email, username, otp }) => {
    const htmlTemplate = getEmailVerificationTemplate(username, otp);
    await sendEmail({
        to: email,
        subject: "Verify your Moneytraits account",
        text: `Hi ${username}, your email verification OTP is: ${otp}. It expires in 15 minutes.`,
        html: htmlTemplate,
    });
};
