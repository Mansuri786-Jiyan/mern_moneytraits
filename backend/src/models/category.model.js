import mongoose, { Schema } from "mongoose";

const categorySchema = new Schema({
    userId: { 
        type: Schema.Types.ObjectId, 
        required: true, 
        ref: "User",
        index: true
    },
    name: { 
        type: String, 
        required: true 
    },
    type: { 
        type: String, 
        enum: ["INCOME", "EXPENSE"], 
        required: true 
    },
    color: { 
        type: String, 
        default: "#000000" 
    },
    icon: { 
        type: String // Optional: store an emoji or icon string
    },
}, { 
    timestamps: true 
});

// Ensure a user cannot have duplicate category names for the same transaction type
categorySchema.index({ userId: 1, name: 1, type: 1 }, { unique: true });

const CategoryModel = mongoose.model("Category", categorySchema);
export default CategoryModel;
