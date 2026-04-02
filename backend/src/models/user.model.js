import mongoose, { Schema } from "mongoose";
import { compareValue, hashValue } from "../utils/bcrypt.js";

const userSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
    },
    profilePicture: {
        type: String,
        default: null,
    },
    password: {
        type: String,
        select: true,
        required: true,
    },
    role: {
        type: String,
        default: "USER",
        enum: ["USER", "ADMIN"],
    },
    isEmailVerified: {
        type: Boolean,
        default: false,
    },
    isBlocked: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true,
});

userSchema.pre("save", async function (next) {
    if (!this.isModified("password"))
        return next();
    this.password = await hashValue(this.password);
    next();
});

userSchema.methods.comparePassword = async function (password) {
    return compareValue(password, this.password);
};

userSchema.methods.omitPassword = function () {
    const user = this.toObject();
    delete user.password;
    return user;
};

const UserModel = mongoose.model("User", userSchema);
export default UserModel;