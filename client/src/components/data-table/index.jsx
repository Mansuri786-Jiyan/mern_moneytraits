import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from "react";
import { getCoreRowModel, getFilteredRowModel, getSortedRowModel, useReactTable, flexRender, } from "@tanstack/react-table";
import { Loader, PlusCircleIcon, Trash, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import TableSkeleton from "./table-skeleton-loader.jsx";
import { DataTablePagination } from "./table-pagination.jsx";
import { EmptyState } from "../empty-state/index.jsx";
export function DataTable({ data, columns, searchPlaceholder = "Search...", showSearch = true, filters = [], className, onSearch, onFilterChange, onBulkDelete, selection = true, isLoading = false, isBulkDeleting = false, isShowPagination = true, pagination, onPageChange, onPageSizeChange, }) {
    const [searchTerm, setSearchTerm] = React.useState("");
    const [filterValues, setFilterValues] = React.useState({});
    const [sorting, setSorting] = React.useState([]);
    const [columnFilters, setColumnFilters] = React.useState([]);
    const [columnVisibility, setColumnVisibility] = React.useState({});
    const [rowSelection, setRowSelection] = React.useState({});
    const table = useReactTable({
        data,
        columns,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection: selection ? rowSelection : {},
        },
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: selection ? setRowSelection : undefined,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
    });
    const selectedRows = table.getFilteredSelectedRowModel().rows;
    const hasSelections = selectedRows.length > 0;
    const handleSearch = (value) => {
        setSearchTerm(value);
        onSearch?.(value);
    };
    const handleFilterChange = (key, value) => {
        const updated = { ...filterValues, [key]: value };
        setFilterValues(updated);
        onFilterChange?.(updated);
    };
    const handleClear = () => {
        setSearchTerm("");
        setFilterValues({});
        onSearch?.("");
        onFilterChange?.({});
        setRowSelection({});
    };
    const handleDelete = () => {
        const selectedIds = selectedRows.map((row) => row.original.id);
        onBulkDelete?.(selectedIds);
        setRowSelection({});
    };
    return (_jsxs("div", { className: "w-full", children: [_jsxs("div", { className: "flex flex-wrap justify-between items-center gap-2 pb-4", children: [_jsxs("div", { className: "flex items-center gap-2 flex-wrap flex-1", children: [showSearch && (_jsx(Input, { placeholder: searchPlaceholder, value: searchTerm, disabled: isLoading, onChange: (e) => handleSearch(e.target.value), className: "max-w-sm" })), filters.map(({ key, label, options }) => (_jsxs(Select, { value: filterValues[key] ?? "", disabled: isLoading, onValueChange: (value) => handleFilterChange(key, value), children: [_jsx(SelectTrigger, { className: "min-w-[160px]", children: _jsxs("div", { className: "flex items-center gap-2", children: [_jsx(PlusCircleIcon, { className: "h-4 w-4 opacity-50" }), _jsx(SelectValue, { placeholder: label })] }) }), _jsx(SelectContent, { children: options.map((opt) => (_jsx(SelectItem, { value: opt.value, children: opt.label }, opt.value))) })] }, key))), (searchTerm ||
                                Object.keys(rowSelection).length > 0 ||
                                Object.keys(filterValues).length > 0) && (_jsxs(Button, { variant: "ghost", disabled: isLoading || isBulkDeleting, onClick: handleClear, className: "h-8 px-2", children: [_jsx(X, { className: "h-4 w-4 mr-1" }), "Reset"] }))] }), (selection && hasSelections) || isBulkDeleting ? (_jsxs(Button, { disabled: isLoading || isBulkDeleting, variant: "destructive", size: "sm", onClick: handleDelete, children: [_jsx(Trash, { className: "h-4 w-4 mr-1" }), "Delete (", selectedRows.length, ")", isBulkDeleting && _jsx(Loader, { className: "ml-1 h-4 w-4 animate-spin" })] })) : null] }), _jsx("div", { className: cn("rounded-md border overflow-x-auto", className), children: isLoading ? (_jsx(TableSkeleton, { columns: 6, rows: 20 })) : (_jsxs(Table, { className: cn(table.getRowModel().rows.length === 0 ? "h-[200px]" : ""), children: [_jsx(TableHeader, { className: "sticky top-0 bg-muted z-10 ", children: table.getHeaderGroups().map((group) => (_jsx(TableRow, { children: group.headers.map((header) => (_jsx(TableHead, { className: "!font-medium !text-[13px]", children: flexRender(header.column.columnDef.header, header.getContext()) }, header.id))) }, group.id))) }), _jsx(TableBody, { children: table.getRowModel().rows.length > 0 ? (table.getRowModel().rows.map((row) => (_jsx(TableRow, { "data-state": row.getIsSelected() && "selected", children: row.getVisibleCells().map((cell) => (_jsx(TableCell, { className: "!text-[13.3px]", children: flexRender(cell.column.columnDef.cell, cell.getContext()) }, cell.id))) }, row.id)))) : (_jsx(TableRow, { children: _jsx(TableCell, { colSpan: columns.length, className: "text-center h-24", children: _jsx(EmptyState, { title: "No records found", description: "" }) }) })) })] })) }), isShowPagination && (_jsx("div", { className: "mt-4", children: _jsx(DataTablePagination, { pageNumber: pagination?.pageNumber || 1, pageSize: pagination?.pageSize || 10, totalCount: pagination?.totalItems || 0, totalPages: pagination?.totalPages || 0, onPageChange: onPageChange, onPageSizeChange: onPageSizeChange }) }))] }));
}
