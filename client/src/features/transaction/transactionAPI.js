import { apiClient } from "@/app/api-client";
export const transactionApi = apiClient.injectEndpoints({
    endpoints: (builder) => ({
        createTransaction: builder.mutation({
            query: (body) => ({
                url: "/transaction/create",
                method: "POST",
                body: body,
            }),
            invalidatesTags: ["transactions", "analytics"],
        }),
        aiScanReceipt: builder.mutation({
            query: (formData) => ({
                url: "/transaction/scan-receipt",
                method: "POST",
                body: formData,
            }),
        }),
        getAllTransactions: builder.query({
            query: (params) => {
                const { keyword = undefined, type = undefined, recurringStatus = undefined, pageNumber = 1, pageSize = 10, } = params;
                return {
                    url: "/transaction/all",
                    method: "GET",
                    params: {
                        keyword,
                        type,
                        recurringStatus,
                        pageNumber,
                        pageSize,
                    },
                };
            },
            providesTags: ["transactions"],
        }),
        getSingleTransaction: builder.query({
            query: (id) => ({
                url: `/transaction/${id}`,
                method: "GET",
            }),
        }),
        duplicateTransaction: builder.mutation({
            query: (id) => ({
                url: `/transaction/duplicate/${id}`,
                method: "PUT",
            }),
            invalidatesTags: ["transactions"],
        }),
        updateTransaction: builder.mutation({
            query: ({ id, transaction }) => ({
                url: `/transaction/update/${id}`,
                method: "PUT",
                body: transaction,
            }),
            invalidatesTags: ["transactions"],
        }),
        bulkImportTransaction: builder.mutation({
            query: (body) => ({
                url: "/transaction/bulk-transaction",
                method: "POST",
                body,
            }),
            invalidatesTags: ["transactions"],
        }),
        getAllTransactionsForExport: builder.query({
            query: ({ keyword, type, recurringStatus } = {}) => ({
                url: "/transaction/export-all",
                method: "GET",
                params: { keyword, type, recurringStatus },
            }),
        }),
        deleteTransaction: builder.mutation({
            query: (id) => ({
                url: `/transaction/delete/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["transactions", "analytics"],
        }),
        bulkDeleteTransaction: builder.mutation({
            query: (transactionIds) => ({
                url: "/transaction/bulk-delete",
                method: "DELETE",
                body: {
                    transactionIds,
                },
            }),
            invalidatesTags: ["transactions", "analytics"],
        }),
        suggestCategory: builder.mutation({
            query: (body) => ({
                url: "/categorize/suggest",
                method: "POST",
                body,
            }),
        }),
    }),
});
export const { useCreateTransactionMutation, useGetAllTransactionsQuery, useGetAllTransactionsForExportQuery, useAiScanReceiptMutation, useGetSingleTransactionQuery, useDuplicateTransactionMutation, useUpdateTransactionMutation, useBulkImportTransactionMutation, useDeleteTransactionMutation, useBulkDeleteTransactionMutation, useSuggestCategoryMutation, } = transactionApi;
