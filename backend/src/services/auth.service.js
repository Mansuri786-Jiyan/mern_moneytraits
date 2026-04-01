export const registerService = async (body) => {
    const { name, email, password } = body;

    const existingUser = await UserModel.findOne({ email });

    // ✅ HANDLE EXISTING USER
    if (existingUser) {
        if (existingUser.isEmailVerified) {
            // If already verified → block
            throw new UnauthorizedException("User already exists");
        } else {
            // 🔥 If NOT verified → delete old user
            await UserModel.deleteOne({ _id: existingUser._id });
            await PasswordResetTokenModel.deleteMany({ userId: existingUser._id });
            await ReportSettingModel.deleteMany({ userId: existingUser._id });
        }
    }

    // ✅ Create new user
    const newUser = new UserModel({
        name,
        email,
        password,
        role: "USER",
        isEmailVerified: false,
    });

    await newUser.save();

    // ✅ Create report settings
    const reportSetting = new ReportSettingModel({
        userId: newUser._id,
        frequency: ReportFrequencyEnum.MONTHLY,
        isEnabled: true,
        nextReportDate: calulateNextReportDate(),
        lastSentDate: null,
    });
    await reportSetting.save();

    // ✅ Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    await PasswordResetTokenModel.deleteMany({
        userId: newUser._id,
        used: false,
    });

    await PasswordResetTokenModel.create({
        userId: newUser._id,
        token: otp,
        expiresAt: new Date(Date.now() + 15 * 60 * 1000),
    });

    // ✅ Send email
    try {
        await sendEmailVerificationOtp({
            email: newUser.email,
            username: newUser.name,
            otp,
        });
    } catch (error) {
        console.error("Email failed:", error);

        // 🔥 rollback user if email fails
        await UserModel.deleteOne({ _id: newUser._id });
        await PasswordResetTokenModel.deleteMany({ userId: newUser._id });
        await ReportSettingModel.deleteMany({ userId: newUser._id });

        throw new Error("Failed to send verification email. Please try again.");
    }

    return { user: newUser.omitPassword() };
};