import CategoryModel from "../models/category.model.js";
import { HTTPSTATUS } from "../config/http.config.js";
import { asyncHandler } from "../middlewares/asyncHandler.middlerware.js";

// Basic default categories formatted correctly for the frontend (value and label)
const DEFAULT_CATEGORIES = [
    { value: "groceries", label: "Groceries", isSystem: true },
    { value: "dining", label: "Dining & Restaurants", isSystem: true },
    { value: "transportation", label: "Transportation", isSystem: true },
    { value: "utilities", label: "Utilities", isSystem: true },
    { value: "entertainment", label: "Entertainment", isSystem: true },
    { value: "shopping", label: "Shopping", isSystem: true },
    { value: "healthcare", label: "Healthcare", isSystem: true },
    { value: "travel", label: "Travel", isSystem: true },
    { value: "housing", label: "Housing & Rent", isSystem: true },
    { value: "income", label: "Income", isSystem: true },
    { value: "investments", label: "Investments", isSystem: true },
    { value: "other", label: "Other", isSystem: true },
];

export const getCategories = asyncHandler(async (req, res) => {
    const userId = req.user?._id;

    // Fetch custom user categories
    const customCategories = await CategoryModel.find({ userId }).sort({ createdAt: -1 });

    // Transform custom categories to match the {value, label} format needed by frontend
    const mappedCustomCategories = customCategories.map(cat => ({
        _id: cat._id,
        value: cat.name.toLowerCase(),
        label: cat.name,
        color: cat.color,
        icon: cat.icon,
        type: cat.type,
        isSystem: false
    }));

    // Combine defaults and custom
    return res.status(HTTPSTATUS.OK).json({
        message: "Categories fetched successfully",
        categories: [...DEFAULT_CATEGORIES, ...mappedCustomCategories]
    });
});

export const createCategory = asyncHandler(async (req, res) => {
    const userId = req.user?._id;
    const { name, type, color, icon } = req.body;

    if (!name || !type) {
        return res.status(HTTPSTATUS.BAD_REQUEST).json({
            message: "Category Name and Type are required"
        });
    }

    // Check if user already has a category with this name/type
    const existingCategory = await CategoryModel.findOne({ 
        userId, 
        name: { $regex: new RegExp(`^${name}$`, "i") }, 
        type 
    });

    if (existingCategory) {
        return res.status(HTTPSTATUS.CONFLICT).json({
            message: "You already have a category with this name"
        });
    }

    // Check if it matches a default category to avoid duplicates
    const isDefault = DEFAULT_CATEGORIES.some(cat => cat.value === name.toLowerCase());
    if (isDefault) {
        return res.status(HTTPSTATUS.CONFLICT).json({
            message: "This is already a default system category"
        });
    }

    try {
        const category = await CategoryModel.create({
            userId,
            name,
            type,
            color: color || "#000000",
            icon: icon || ""
        });

        return res.status(HTTPSTATUS.CREATED).json({
            message: "Category created successfully",
            category: {
                _id: category._id,
                value: category.name.toLowerCase(),
                label: category.name,
                color: category.color,
                icon: category.icon,
                type: category.type,
                isSystem: false
            }
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(HTTPSTATUS.CONFLICT).json({
                message: "Category with this name already exists"
            });
        }
        throw error;
    }
});

export const updateCategory = asyncHandler(async (req, res) => {
    const userId = req.user?._id;
    const { id } = req.params;
    const { name, type, color, icon } = req.body;

    if (!name || !type) {
        return res.status(HTTPSTATUS.BAD_REQUEST).json({
            message: "Category Name and Type are required"
        });
    }

    // Check for duplicate name (excluding the current category)
    const existingCategory = await CategoryModel.findOne({
        userId,
        name: { $regex: new RegExp(`^${name}$`, "i") },
        type,
        _id: { $ne: id }
    });

    if (existingCategory) {
        return res.status(HTTPSTATUS.CONFLICT).json({
            message: "You already have a category with this name"
        });
    }

    const isDefault = DEFAULT_CATEGORIES.some(cat => cat.value === name.toLowerCase());
    if (isDefault) {
        return res.status(HTTPSTATUS.CONFLICT).json({
            message: "Cannot use a default system category name"
        });
    }

    const updated = await CategoryModel.findOneAndUpdate(
        { _id: id, userId },
        { name, type, color: color || "#000000", icon: icon || "" },
        { new: true }
    );

    if (!updated) {
        return res.status(HTTPSTATUS.NOT_FOUND).json({
            message: "Category not found"
        });
    }

    return res.status(HTTPSTATUS.OK).json({
        message: "Category updated successfully",
        category: {
            _id: updated._id,
            value: updated.name.toLowerCase(),
            label: updated.name,
            color: updated.color,
            icon: updated.icon,
            type: updated.type,
            isSystem: false
        }
    });
});

export const deleteCategory = asyncHandler(async (req, res) => {
    const userId = req.user?._id;
    const { id } = req.params;

    const deletedCategory = await CategoryModel.findOneAndDelete({ _id: id, userId });
    
    if (!deletedCategory) {
        return res.status(HTTPSTATUS.NOT_FOUND).json({
            message: "Category not found"
        });
    }

    return res.status(HTTPSTATUS.OK).json({
        message: "Category deleted successfully"
    });
});
