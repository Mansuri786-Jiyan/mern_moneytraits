import { asyncHandler } from "../middlewares/asyncHandler.middlerware.js";
import { HTTPSTATUS } from "../config/http.config.js";
import { createTransactionSchema, transactionIdSchema, updateTransactionSchema, bulkDeleteTransactionSchema, bulkTransactionSchema } from "../validators/transaction.validator.js";
import { createTransactionService, getAllTransactionService, getTransactionByIdService, duplicateTransactionService, updateTransactionService, deleteTransactionService, bulkDeleteTransactionService, bulkTransactionService, scanReceiptService } from "../services/transaction.service.js";
import TransactionModel from "../models/transaction.model.js";

export const createTransactionController = asyncHandler(async (req, res) => {
    const body = createTransactionSchema.parse(req.body);
    const userId = req.user?._id;
    const transaction = await createTransactionService(body, userId);
    return res.status(HTTPSTATUS.CREATED).json({
        message: "Transacton created successfully",
        transaction,
    });
});

export const getAllTransactionController = asyncHandler(async (req, res) => {
    const userId = req.user?._id;
    const filters = {
        keyword: req.query.keyword,
        type: req.query.type,
        recurringStatus: req.query.recurringStatus,
        category: req.query.category,
    };
    const pagination = {
        pageSize: parseInt(req.query.pageSize) || 20,
        pageNumber: parseInt(req.query.pageNumber) || 1,
    };
    const result = await getAllTransactionService(userId, filters, pagination);
    return res.status(HTTPSTATUS.OK).json({
        message: "Transaction fetched successfully",
        ...result,
    });
});

export const getTransactionByIdController = asyncHandler(async (req, res) => {
    const userId = req.user?._id;
    const transactionId = transactionIdSchema.parse(req.params.id);
    const transaction = await getTransactionByIdService(userId, transactionId);
    return res.status(HTTPSTATUS.OK).json({
        message: "Transaction fetched successfully",
        transaction,
    });
});

export const duplicateTransactionController = asyncHandler(async (req, res) => {
    const userId = req.user?._id;
    const transactionId = transactionIdSchema.parse(req.params.id);
    const transaction = await duplicateTransactionService(userId, transactionId);
    return res.status(HTTPSTATUS.OK).json({
        message: "Transaction duplicated successfully",
        data: transaction,
    });
});

export const updateTransactionController = asyncHandler(async (req, res) => {
    const userId = req.user?._id;
    const transactionId = transactionIdSchema.parse(req.params.id);
    const body = updateTransactionSchema.parse(req.body);
    await updateTransactionService(userId, transactionId, body);
    return res.status(HTTPSTATUS.OK).json({
        message: "Transaction updated successfully",
    });
});

export const deleteTransactionController = asyncHandler(async (req, res) => {
    const userId = req.user?._id;
    const transactionId = transactionIdSchema.parse(req.params.id);
    await deleteTransactionService(userId, transactionId);
    return res.status(HTTPSTATUS.OK).json({
        message: "Transaction deleted successfully",
    });
});

export const bulkDeleteTransactionController = asyncHandler(async (req, res) => {
    const userId = req.user?._id;
    const { transactionIds } = bulkDeleteTransactionSchema.parse(req.body);
    const result = await bulkDeleteTransactionService(userId, transactionIds);
    return res.status(HTTPSTATUS.OK).json({
        message: "Transaction deleted successfully",
        ...result,
    });
});

export const bulkTransactionController = asyncHandler(async (req, res) => {
    const userId = req.user?._id;
    const { transactions } = bulkTransactionSchema.parse(req.body);
    const result = await bulkTransactionService(userId, transactions);
    return res.status(HTTPSTATUS.OK).json({
        message: "Bulk transaction inserted successfully",
        ...result,
    });
});

export const scanReceiptController = asyncHandler(async (req, res) => {
    const file = req?.file;
    const result = await scanReceiptService(file);
    return res.status(HTTPSTATUS.OK).json({
        message: "Reciept scanned successfully",
        data: result,
    });
});

export const getAllTransactionsForExportController = asyncHandler(async (req, res) => {
    const userId = req.user?._id;
    const filters = {
        keyword: req.query.keyword,
        type: req.query.type,
        recurringStatus: req.query.recurringStatus,
    };
    
    const filterConditions = {
        userId,
    };
    
    if (filters.keyword) {
        filterConditions.$or = [
            { title: { $regex: filters.keyword, $options: "i" } },
            { category: { $regex: filters.keyword, $options: "i" } },
        ];
    }
    
    if (filters.type) {
        filterConditions.type = filters.type;
    }
    
    if (filters.recurringStatus) {
        if (filters.recurringStatus === "RECURRING") {
            filterConditions.isRecurring = true;
        } else if (filters.recurringStatus === "NON_RECURRING") {
            filterConditions.isRecurring = false;
        }
    }

    const transactions = await TransactionModel.find(filterConditions).sort({ date: -1 });
    
    return res.status(HTTPSTATUS.OK).json({
        message: "All transactions fetched for export",
        data: {
            transactions,
            totalCount: transactions.length
        }
    });
});
