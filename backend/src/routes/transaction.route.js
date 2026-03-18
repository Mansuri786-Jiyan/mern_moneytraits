import { Router } from "express";
import { createTransactionController, scanReceiptController, bulkTransactionController, duplicateTransactionController, updateTransactionController, getAllTransactionController, getTransactionByIdController, deleteTransactionController, bulkDeleteTransactionController } from "../controllers/transaction.controller.js";
import { upload } from "../config/cloudinary.config.js";

const transactionRoutes = Router();

transactionRoutes.post("/create", createTransactionController);
transactionRoutes.post("/scan-receipt", upload.single("receipt"), scanReceiptController);
transactionRoutes.post("/bulk-transaction", bulkTransactionController);
transactionRoutes.put("/duplicate/:id", duplicateTransactionController);
transactionRoutes.put("/update/:id", updateTransactionController);
transactionRoutes.get("/all", getAllTransactionController);
transactionRoutes.get("/:id", getTransactionByIdController);
transactionRoutes.delete("/delete/:id", deleteTransactionController);
transactionRoutes.delete("/bulk-delete", bulkDeleteTransactionController);

export default transactionRoutes;
