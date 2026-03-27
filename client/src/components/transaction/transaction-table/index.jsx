import React, { useState, useEffect } from "react";
import { DataTable } from "@/components/data-table";
import { transactionColumns } from "./column.jsx";
import { _TRANSACTION_TYPE } from "@/constant";
import { useBulkDeleteTransactionMutation, useGetAllTransactionsQuery, } from "@/features/transaction/transactionAPI";
import { toast } from "sonner";

const TransactionTable = ({ pageSize, isShowPagination = true, onFiltersChange }) => {
    const [filter, setFilter] = useState({
        type: undefined,
        recurringStatus: undefined,
        pageNumber: 1,
        pageSize: pageSize || 10,
    });
    const [keyword, setKeyword] = useState("");

    const lastNotifiedFilters = React.useRef(null);

    // Notify parent about filter changes
    useEffect(() => {
        const currentFilters = {
            keyword: keyword,
            type: filter.type,
            recurringStatus: filter.recurringStatus,
        };

        // Deep compare or just stringify compare for simplicity here
        const filtersString = JSON.stringify(currentFilters);
        if (lastNotifiedFilters.current !== filtersString) {
            console.log("TransactionTable: Notifying parent of filter change", currentFilters);
            onFiltersChange?.(currentFilters);
            lastNotifiedFilters.current = filtersString;
        }
    }, [keyword, filter.type, filter.recurringStatus, onFiltersChange]);

    const [bulkDeleteTransaction, { isLoading: isBulkDeleting }] = useBulkDeleteTransactionMutation();
    const { data, isFetching, error } = useGetAllTransactionsQuery({
        keyword: keyword,
        type: filter.type,
        recurringStatus: filter.recurringStatus,
        pageNumber: filter.pageNumber,
        pageSize: filter.pageSize,
    });

    if (error) {
        console.error("TransactionTable API Error:", error);
    }

    if (data) {
        console.log("TransactionTable: Received data:", { 
            hasTransations: !!data.transations, 
            transationsCount: data.transations?.length,
            hasDataTransactions: !!data.data?.transactions,
            dataTransactionsCount: data.data?.transactions?.length 
        });
    }

    const transactions = data?.transations || data?.data?.transactions || [];
    const pagination = {
        totalItems: data?.pagination?.totalCount || 0,
        totalPages: data?.pagination?.totalPages || 0,
        pageNumber: filter.pageNumber,
        pageSize: filter.pageSize,
    };

    const handleSearch = (value) => {
        setKeyword(value);
    };

    const handleFilterChange = (filters) => {
        const { type, frequently } = filters;
        setFilter((prev) => ({
            ...prev,
            type: type,
            recurringStatus: frequently,
            pageNumber: 1, // Reset to page 1 on filter change
        }));
    };

    const handlePageChange = (pageNumber) => {
        setFilter((prev) => ({ ...prev, pageNumber }));
    };

    const handlePageSizeChange = (pageSize) => {
        setFilter((prev) => ({ ...prev, pageSize, pageNumber: 1 }));
    };

    const handleBulkDelete = (transactionIds) => {
        bulkDeleteTransaction(transactionIds)
            .unwrap()
            .then(() => {
                toast.success("Transactions deleted successfully");
            })
            .catch((error) => {
                toast.error(error.data?.message || "Failed to delete transactions");
            });
    };

    return (
        <DataTable 
            data={transactions} 
            columns={transactionColumns} 
            searchPlaceholder="Search transactions..." 
            isLoading={isFetching} 
            isBulkDeleting={isBulkDeleting} 
            isShowPagination={isShowPagination} 
            pagination={pagination} 
            filters={[
                {
                    key: "type",
                    label: "All Types",
                    options: [
                        { value: _TRANSACTION_TYPE.INCOME, label: "Income" },
                        { value: _TRANSACTION_TYPE.EXPENSE, label: "Expense" },
                    ],
                },
                {
                    key: "frequently",
                    label: "Frequently",
                    options: [
                        { value: "RECURRING", label: "Recurring" },
                        { value: "NON_RECURRING", label: "Non-Recurring" },
                    ],
                },
            ]} 
            onSearch={handleSearch} 
            onPageChange={handlePageChange} 
            onPageSizeChange={handlePageSizeChange} 
            onFilterChange={handleFilterChange} 
            onBulkDelete={handleBulkDelete} 
        />
    );
};

export default TransactionTable;
