import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Button } from "@/components/ui/button";
import { Clock, RefreshCw } from "lucide-react";
import { _REPORT_STATUS } from "@/constant";
export const reportColumns = [
    {
        accessorKey: "period",
        header: "Report Period",
        size: 150,
        cell: ({ row }) => {
            const period = row.getValue("period");
            return (_jsxs("div", { className: "flex items-center gap-2 lg:!w-10", children: [_jsx(Clock, { className: "h-3.5 w-3.5 opacity-50 shrink-0" }), _jsx("span", { children: period })] }));
        },
    },
    {
        accessorKey: "sentDate",
        header: "Sent Date",
        size: 100,
        cell: ({ row }) => {
            const date = new Date(row.original.sentDate);
            return date.toLocaleDateString();
        },
    },
    {
        accessorKey: "status",
        header: "Status",
        size: 100,
        cell: ({ row }) => {
            const status = row.getValue("status");
            const statusStyles = {
                [_REPORT_STATUS.SENT]: "bg-green-100 text-green-800",
                [_REPORT_STATUS.FAILED]: "bg-red-100 text-red-800",
                [_REPORT_STATUS.PENDING]: "bg-yellow-100 text-yellow-800",
                [_REPORT_STATUS.PROCESSING]: "bg-blue-100 text-blue-800",
                [_REPORT_STATUS.NO_ACTIVITY]: "bg-gray-100 text-gray-800",
            };
            const style = statusStyles[status] || "bg-gray-100 text-gray-800";
            return (_jsx("span", { className: `inline-flex items-center rounded-full
         px-2.5 py-0.5 text-xs font-medium ${style}`, children: status }));
        },
        filterFn: (row, id, value) => value.includes(row.getValue(id)),
    },
    {
        id: "actions",
        header: "Actions",
        size: 100,
        cell: () => (_jsxs("div", { className: "flex gap-1", children: [_jsxs(Button, { size: "sm", variant: "outline", className: "font-normal", children: [_jsx(RefreshCw, { className: "h-4 w-4" }), "Resend"] }), _jsx("div", {})] })),
    },
    {
        id: "-",
        header: "",
    },
    {
        id: "-",
        header: "",
    },
];
