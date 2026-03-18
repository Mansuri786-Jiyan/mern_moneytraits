import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { z } from "zod";
import { ChevronDown, ChevronLeft, FileCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { DialogDescription, DialogHeader, DialogTitle, } from "@/components/ui/dialog";
import { _TRANSACTION_TYPE, PAYMENT_METHODS_ENUM } from "@/constant";
import { toast } from "sonner";
import { MAX_IMPORT_LIMIT } from "@/constant";
import { useProgressLoader } from "@/hooks/use-progress-loader";
import { useBulkImportTransactionMutation } from "@/features/transaction/transactionAPI";
const transactionSchema = z.object({
    title: z.string({
        required_error: "Title is required",
    }),
    amount: z
        .number({
        invalid_type_error: "Amount must be a number",
        required_error: "Amount is required",
    })
        .positive("Amount must be greater than zero"),
    date: z.preprocess((val) => new Date(val), z.date({
        invalid_type_error: "Invalid date format",
        required_error: "Date is required",
    })),
    type: z.enum([_TRANSACTION_TYPE.INCOME, _TRANSACTION_TYPE.EXPENSE], {
        invalid_type_error: "Invalid transaction type",
        required_error: "Transaction type is required",
    }),
    category: z.string({
        required_error: "Category is required",
    }),
    paymentMethod: z
        .union([
        z.literal(""),
        z.undefined(),
        z.enum([
            PAYMENT_METHODS_ENUM.CARD,
            PAYMENT_METHODS_ENUM.BANK_TRANSFER,
            PAYMENT_METHODS_ENUM.MOBILE_PAYMENT,
            PAYMENT_METHODS_ENUM.AUTO_DEBIT,
            PAYMENT_METHODS_ENUM.CASH,
            PAYMENT_METHODS_ENUM.OTHER,
        ], {
            errorMap: (issue) => ({
                message: issue.code === "invalid_enum_value"
                    ? `Payment method must be one of: ${Object.values(PAYMENT_METHODS_ENUM).join(", ")}`
                    : "Invalid payment method",
            }),
        }),
    ])
        .transform((val) => (val === "" ? undefined : val))
        .optional(),
});
const ConfirmationStep = ({ file, mappings, csvData, onComplete, onBack, }) => {
    const [errors, setErrors] = useState({});
    const { progress, isLoading, startProgress, updateProgress, doneProgress, resetProgress, } = useProgressLoader({ initialProgress: 10, completionDelay: 500 });
    const [bulkImportTransaction] = useBulkImportTransactionMutation();
    const handleImport = () => {
        const { transactions, hasValidationErrors } = getAssignFieldToMappedTransactions();
        console.log(transactions, "transactions");
        if (hasErrors || hasValidationErrors)
            return;
        if (transactions.length > MAX_IMPORT_LIMIT) {
            toast.error(`Cannot import more than ${MAX_IMPORT_LIMIT} transactions`);
            return;
        }
        resetProgress();
        startProgress(10);
        // Start progress
        let currentProgress = 10;
        const interval = setInterval(() => {
            const increment = currentProgress < 90 ? 10 : 1;
            currentProgress = Math.min(currentProgress + increment, 90);
            updateProgress(currentProgress);
        }, 250);
        const payload = { transactions: transactions };
        console.log(payload, "payload");
        bulkImportTransaction(payload)
            .unwrap()
            .then(() => {
            updateProgress(100);
            toast.success("Imported transactions successfully");
        })
            .catch((error) => {
            resetProgress();
            toast.error(error.data?.message || "Failed to import transactions");
        })
            .finally(() => {
            clearInterval(interval);
            setTimeout(() => {
                doneProgress();
                resetProgress();
                onComplete();
            }, 500);
        });
    };
    const getAssignFieldToMappedTransactions = () => {
        let hasValidationErrors = false;
        const results = [];
        csvData.forEach((row, index) => {
            const transaction = {};
            // Apply mappings
            Object.entries(mappings).forEach(([csvColumn, transactionField]) => {
                if (transactionField === "Skip" || row[csvColumn] === undefined)
                    return;
                transaction[transactionField] =
                    transactionField === "amount"
                        ? Number(row[csvColumn])
                        : transactionField === "date"
                            ? new Date(row[csvColumn])
                            : row[csvColumn];
            });
            try {
                const validated = transactionSchema.parse(transaction);
                results.push(validated);
            }
            catch (error) {
                hasValidationErrors = true;
                const message = error instanceof z.ZodError
                    ? error.errors
                        .map((e) => {
                        if (e.path[0] === "type")
                            return "Transaction type:- must be INCOME or EXPENSE";
                        if (e.path[0] === "paymentMethod")
                            return ("Payment method:- must be one of: " +
                                Object.values(PAYMENT_METHODS_ENUM).join(", "));
                        return `${e.path[0]}: ${e.message}`;
                    })
                        .join("\n")
                    : "Invalid data";
                setErrors((prev) => ({
                    ...prev,
                    [index + 1]: message,
                }));
            }
        });
        return { transactions: results, hasValidationErrors };
    };
    const hasErrors = Object.keys(errors).length > 0;
    console.log(errors, "errors");
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs(DialogHeader, { children: [_jsx(DialogTitle, { className: "flex items-center gap-1", children: "Confirm Import" }), _jsx(DialogDescription, { children: "Review your settings before importing" })] }), _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "border rounded-md p-4 w-full", children: [_jsxs("h4", { className: "flex items-center gap-1 font-medium mb-2", children: [_jsx(FileCheck, { className: "w-4 h-4" }), "Import Summary"] }), _jsxs("div", { className: "grid grid-cols-2 w-full gap-4 text-sm", children: [_jsxs("div", { children: [_jsx("p", { className: "text-muted-foreground", children: "File" }), _jsx("p", { children: file?.name })] }), _jsxs("div", { children: [_jsx("p", { className: "text-muted-foreground", children: "Columns Mapped" }), _jsx("p", { children: Object.keys(mappings).length })] }), _jsxs("div", { children: [_jsx("p", { className: "text-muted-foreground", children: "Transactions" }), _jsx("p", { children: csvData.length })] }), _jsxs("div", { children: [_jsx("p", { className: "text-muted-foreground", children: "Transactions Limit " }), _jsx("p", { children: MAX_IMPORT_LIMIT })] })] })] }), hasErrors && (_jsxs("div", { className: "w-full block border border-red-100 bg-[#fef2f2] dark:bg-background\r\n            rounded text-sm max-h-60 overflow-y-auto", style: {
                            maxHeight: "250px",
                        }, children: [_jsx("p", { className: "font-medium mb-2 bg-[#fef2f2] dark:bg-background sticky top-0 px-2 py-1", children: "Issues found:" }), _jsx("div", { className: "space-y-1 p-2", children: Object.entries(errors).map(([row, msg]) => (_jsxs("details", { className: "group", children: [_jsxs("summary", { className: "flex text-sm items-center justify-between cursor-pointer !text-red-600", children: [_jsxs("span", { children: ["Row ", row] }), _jsx(ChevronDown, { className: "w-4 h-4 transform group-open:rotate-180 transition-transform" })] }), _jsx("div", { className: "mt-1 pl-2 text-xs !text-red-500 border-l-2 border-red-200", children: msg.split("\n").map((line, i) => (_jsx("p", { children: line }, i))) })] }, row))) })] })), isLoading && (_jsxs("div", { className: "space-y-2", children: [_jsx(Progress, { value: progress, className: "h-2" }), _jsxs("p", { className: "text-xs text-muted-foreground", children: ["Importing... ", progress, "%"] })] }))] }), _jsxs("div", { className: "flex justify-between", children: [_jsxs(Button, { variant: "outline", onClick: onBack, disabled: isLoading, children: [_jsx(ChevronLeft, { className: "w-4 h-4 mr-2" }), "Back"] }), _jsx(Button, { onClick: handleImport, disabled: isLoading, children: isLoading ? "Importing..." : "Confirm Import" })] })] }));
};
export default ConfirmationStep;

