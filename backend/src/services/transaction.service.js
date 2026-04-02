import axios from "axios";
import TransactionModel from "../models/transaction.model.js";
import { NotFoundException, BadRequestException } from "../utils/app-error.js";
import { calculateNextOccurrence } from "../utils/helper.js";
import { genAI, genAIModel } from "../config/google-ai.config.js";
import { receiptPrompt } from "../utils/prompt.js";

export const createTransactionService = async (body, userId) => {
    let nextRecurringDate;
    const currentDate = new Date();
    if (body.isRecurring && body.recurringInterval) {
        const calulatedDate = calculateNextOccurrence(body.date, body.recurringInterval);
        nextRecurringDate =
            calulatedDate < currentDate
                ? calculateNextOccurrence(currentDate, body.recurringInterval)
                : calulatedDate;
    }
    const transaction = await TransactionModel.create({
        ...body,
        userId,
        category: body.category,
        amount: Number(body.amount),
        isRecurring: body.isRecurring || false,
        recurringInterval: body.recurringInterval || null,
        nextRecurringDate,
        lastProcessed: null,
    });
    return transaction;
};

export const getAllTransactionService = async (userId, filters, pagination) => {
    const { keyword, type, recurringStatus } = filters;
    const filterConditions = {
        userId,
    };
    if (keyword) {
        filterConditions.$or = [
            { title: { $regex: keyword, $options: "i" } },
            { category: { $regex: keyword, $options: "i" } },
        ];
    }
    if (type) {
        filterConditions.type = type;
    }
    if (recurringStatus) {
        if (recurringStatus === "RECURRING") {
            filterConditions.isRecurring = true;
        }
        else if (recurringStatus === "NON_RECURRING") {
            filterConditions.isRecurring = false;
        }
    }
    const { pageSize, pageNumber } = pagination;
    const skip = (pageNumber - 1) * pageSize;
    const [transactions, totalCount] = await Promise.all([
        TransactionModel.find(filterConditions)
            .skip(skip)
            .limit(pageSize)
            .sort({ createdAt: -1 }),
        TransactionModel.countDocuments(filterConditions),
    ]);
    const totalPages = Math.ceil(totalCount / pageSize);
    return {
        transactions,
        pagination: {
            pageSize,
            pageNumber,
            totalCount,
            totalPages,
            skip,
        },
    };
};

export const getTransactionByIdService = async (userId, transactionId) => {
    const transaction = await TransactionModel.findOne({
        _id: transactionId,
        userId,
    });
    if (!transaction)
        throw new NotFoundException("Transaction not found");
    return transaction;
};

export const duplicateTransactionService = async (userId, transactionId) => {
    const transaction = await TransactionModel.findOne({
        _id: transactionId,
        userId,
    });
    if (!transaction)
        throw new NotFoundException("Transaction not found");
    const duplicated = await TransactionModel.create({
        ...transaction.toObject(),
        _id: undefined,
        title: `Duplicate - ${transaction.title}`,
        description: transaction.description
            ? `${transaction.description} (Duplicate)`
            : "Duplicated transaction",
        isRecurring: false,
        recurringInterval: undefined,
        nextRecurringDate: undefined,
        createdAt: undefined,
        updatedAt: undefined,
    });
    return duplicated;
};

export const updateTransactionService = async (userId, transactionId, body) => {
    const existingTransaction = await TransactionModel.findOne({
        _id: transactionId,
        userId,
    });
    if (!existingTransaction)
        throw new NotFoundException("Transaction not found");
    const now = new Date();
    const isRecurring = body.isRecurring ?? existingTransaction.isRecurring;
    const date = body.date !== undefined ? new Date(body.date) : existingTransaction.date;
    const recurringInterval = body.recurringInterval || existingTransaction.recurringInterval;
    let nextRecurringDate;
    if (isRecurring && recurringInterval) {
        const calulatedDate = calculateNextOccurrence(date, recurringInterval);
        nextRecurringDate =
            calulatedDate < now
                ? calculateNextOccurrence(now, recurringInterval)
                : calulatedDate;
    }
    existingTransaction.set({
        ...(body.title && { title: body.title }),
        ...(body.description && { description: body.description }),
        ...(body.category && { category: body.category }),
        ...(body.type && { type: body.type }),
        ...(body.paymentMethod && { paymentMethod: body.paymentMethod }),
        ...(body.amount !== undefined && { amount: Number(body.amount) }),
        date,
        isRecurring,
        recurringInterval,
        nextRecurringDate,
    });
    await existingTransaction.save();
    return;
};

export const deleteTransactionService = async (userId, transactionId) => {
    const deleted = await TransactionModel.findByIdAndDelete({
        _id: transactionId,
        userId,
    });
    if (!deleted)
        throw new NotFoundException("Transaction not found");
    return;
};

export const bulkDeleteTransactionService = async (userId, transactionIds) => {
    const result = await TransactionModel.deleteMany({
        _id: { $in: transactionIds },
        userId,
    });
    if (result.deletedCount === 0)
        throw new NotFoundException("No transactions found");
    return {
        sucess: true,
        deletedCount: result.deletedCount,
    };
};

export const bulkTransactionService = async (userId, transactions) => {
    try {
        const bulkOps = transactions.map((tx) => ({
            insertOne: {
                document: {
                    ...tx,
                    userId,
                    isRecurring: false,
                    nextRecurringDate: null,
                    recurringInterval: null,
                    lastProcesses: null,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
            },
        }));
        const result = await TransactionModel.bulkWrite(bulkOps, {
            ordered: true,
        });
        return {
            insertedCount: result.insertedCount,
            success: true,
        };
    }
    catch (error) {
        throw error;
    }
};

export const scanReceiptService = async (file) => {
    if (!file) {
        throw new BadRequestException("No file uploaded");
    }
    try {
        if (!file.path) {
            throw new BadRequestException("File upload failed - no path found");
        }
        // Download image from Cloudinary
        let responseData;
        try {
            responseData = await axios.get(file.path, {
                responseType: "arraybuffer",
            });
        } catch (axiosError) {
            console.error("Axios Image Download Error:", axiosError.message);
            throw new Error(`Failed to download image from Cloudinary: ${axiosError.message}`);
        }
        
        const base64String = Buffer.from(responseData.data).toString("base64");
        if (!base64String) {
            throw new BadRequestException("Could not process file to base64");
        }

        console.log("Preparing Gemini AI request...");
        const result = await genAI.models.generateContent({
            model: genAIModel,
            contents: [
                {
                    role: "user",
                    parts: [
                        { text: receiptPrompt },
                        {
                            inlineData: {
                                data: base64String,
                                mimeType: file.mimetype,
                            },
                        },
                    ],
                },
            ],
            config: {
                temperature: 0,
                topP: 1,
                responseMimeType: "application/json",
            },
        });

        // The @google/genai SDK returns result.text for non-streaming calls
        const rawText = result.text || (typeof result.response?.text === 'function' ? await result.response.text() : "");
        
        console.log("Gemini Raw Response:", rawText);

        // Remove markdown formatting if Gemini returns it
        const cleanedText = rawText?.replace(/```json|```/g, "").trim();
        if (!cleanedText) {
            throw new Error("Could not read receipt content from AI response");
        }

        let data;
        try {
            data = JSON.parse(cleanedText);
        } catch (parseError) {
            console.error("JSON Parsing Error:", parseError.message, "Cleaned Text:", cleanedText);
            throw new Error("Failed to parse receipt data. Please try again with a clearer image.");
        }

        if (!data.amount || !data.date) {
            throw new Error("Receipt missing required fields (amount or date)");
        }

        return {
            title: data.title || "Receipt Expense",
            amount: Number(data.amount),
            date: new Date(data.date),
            description: data.description || "",
            category: data.category || "Other",
            paymentMethod: data.paymentMethod || "CASH",
            type: data.type || "EXPENSE",
            receiptUrl: file.path,
        };
    }
    catch (error) {
        console.error("Critical Receipt Scan Error:", error);
        // Throwing the error so it's caught by asyncHandler and returns 500/400 properly
        throw error;
    }
};
