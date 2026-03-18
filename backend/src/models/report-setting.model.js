import mongoose, { Schema } from "mongoose";

export const ReportFrequencyEnum = {
    MONTHLY: "MONTHLY",
};

const reportSettingSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "User",
    },
    frequency: {
        type: String,
        enum: Object.values(ReportFrequencyEnum),
        default: ReportFrequencyEnum.MONTHLY,
    },
    isEnabled: {
        type: Boolean,
        default: false,
    },
    nextReportDate: {
        type: Date,
    },
    lastSentDate: {
        type: Date,
    },
}, {
    timestamps: true,
});

const ReportSettingModel = mongoose.model("ReportSetting", reportSettingSchema);
export default ReportSettingModel;
