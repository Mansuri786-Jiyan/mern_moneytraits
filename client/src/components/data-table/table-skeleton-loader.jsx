import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
const TableSkeleton = ({ columns, rows = 25, }) => {
    return (_jsxs("div", { className: "w-full bg-white dark:bg-background rounded-lg", children: [_jsx("div", { className: "flex h-10 bg-gray-50 dark:bg-gray-700 rounded-t-lg", children: [...Array(columns)].map((_, index) => (_jsx("div", { className: `flex-1 px-4 py-2`, children: _jsx(Skeleton, { className: "h-4 w-full rounded-lg" }) }, `header-col-${index}`))) }), _jsx("div", { className: "divide-y divide-gray-100 dark:divide-gray-700", children: [...Array(rows)].map((_, rowIndex) => (_jsx("div", { className: "flex h-10", children: [...Array(columns)].map((_, colIndex) => (_jsx("div", { className: `flex-1 px-4 py-2`, children: _jsx(Skeleton, { className: "h-4 w-full rounded-lg" }) }, `row-${rowIndex}-col-${colIndex}`))) }, `row-${rowIndex}`))) })] }));
};
export default TableSkeleton;
