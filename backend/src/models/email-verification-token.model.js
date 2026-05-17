import mongoose, { Schema } from "mongoose";

const emailVerificationTokenSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    newEmail: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
    },
    otp: {
        type: String,
        required: true,
    },
    expiresAt: {
        type: Date,
        required: true,
    },
});

emailVerificationTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const EmailVerificationTokenModel = mongoose.model("EmailVerificationToken", emailVerificationTokenSchema);
export default EmailVerificationTokenModel;
