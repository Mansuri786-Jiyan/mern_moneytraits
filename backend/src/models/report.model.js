import mongoose, { Schema } from "mongoose";

export const ReportStatusEnum = {
    SENT: "SENT",
    PENDING: "PENDING",
    FAILED: "FAILED",
    NO_ACTIVITY: "NO_ACTIVITY",
};

const reportSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "User",
    },
    period: {
        type: String,
        required: true,
    },
    sentDate: {
        type: Date,
        required: true,
    },
    status: {
        type: String,
        enum: Object.values(ReportStatusEnum),
        default: ReportStatusEnum.PENDING,
    },
}, {
    timestamps: true,
});

const ReportModel = mongoose.model("Report", reportSchema);
export default ReportModel;
