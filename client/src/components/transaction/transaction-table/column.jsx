import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { ArrowUpDown, CircleDot, Copy, Loader, MoreHorizontal, Pencil, RefreshCw, 
//StopCircleIcon,
Trash2, } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger, } from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import { formatCurrency } from "@/lib/format-currency";
import useEditTransactionDrawer from "@/hooks/use-edit-transaction-drawer";
import { _TRANSACTION_FREQUENCY, _TRANSACTION_TYPE } from "@/constant";
import { useDeleteTransactionMutation, useDuplicateTransactionMutation, } from "@/features/transaction/transactionAPI";
import { toast } from "sonner";
export const transactionColumns = [
    {
        id: "select",
        header: ({ table }) => (_jsx(Checkbox, { className: "!border-black data-[state=checked]:!bg-gray-800 !text-white", checked: table.getIsAllPageRowsSelected(), onCheckedChange: (value) => table.toggleAllPageRowsSelected(!!value), "aria-label": "Select all" })),
        cell: ({ row }) => (_jsx(Checkbox, { className: "!border-black data-[state=checked]:!bg-gray-800 !text-white", checked: row.getIsSelected(), onCheckedChange: (value) => row.toggleSelected(!!value), "aria-label": "Select row" })),
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: "createdAt",
        header: ({ column }) => (_jsxs(Button, { variant: "ghost", onClick: () => column.toggleSorting(column.getIsSorted() === "asc"), children: ["Date Created", _jsx(ArrowUpDown, { className: "ml-2 h-4 w-4" })] })),
        cell: ({ row }) => {
            const date = row.getValue("createdAt");
            if (!date) return "N/A";
            try {
                return format(new Date(date), "MMM dd, yyyy");
            } catch (e) {
                return "Invalid Date";
            }
        },
    },
    {
        accessorKey: "title",
        header: "Title",
    },
    {
        accessorKey: "category",
        header: ({ column }) => (_jsxs(Button, { variant: "ghost", className: "!pl-0", onClick: () => column.toggleSorting(column.getIsSorted() === "asc"), children: ["Category", _jsx(ArrowUpDown, { className: "ml-2 h-4 w-4" })] })),
        cell: ({ row }) => {
            const category = row.original.category;
            return _jsx("div", { className: "capitalize", children: category });
        },
    },
    {
        accessorKey: "type",
        header: ({ column }) => (_jsxs(Button, { variant: "ghost", onClick: () => column.toggleSorting(column.getIsSorted() === "asc"), children: ["Type", _jsx(ArrowUpDown, { className: "ml-2 h-4 w-4" })] })),
        cell: ({ row }) => (_jsx("div", { className: "capitalize", children: _jsx("span", { className: `px-2 py-1 rounded-full text-xs ${row.getValue("type") === _TRANSACTION_TYPE.INCOME
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"}`, children: row.getValue("type") }) })),
        filterFn: (row, id, value) => {
            return value.includes(row.getValue(id));
        },
    },
    {
        accessorKey: "amount",
        header: () => _jsx("div", { className: "text-right", children: "Amount" }),
        cell: ({ row }) => {
            const amount = parseFloat(row.getValue("amount"));
            const type = row.getValue("type");
            return (_jsxs("div", { className: `text-right font-medium ${type === _TRANSACTION_TYPE.INCOME
                    ? "text-green-600"
                    : "text-destructive"}`, children: [type === _TRANSACTION_TYPE.EXPENSE ? "-" : "+", formatCurrency(amount)] }));
        },
    },
    {
        accessorKey: "date",
        header: ({ column }) => (_jsxs(Button, { variant: "ghost", onClick: () => column.toggleSorting(column.getIsSorted() === "asc"), children: ["Transaction Date", _jsx(ArrowUpDown, { className: "ml-2 h-4 w-4" })] })),
        cell: ({ row }) => {
            const date = row.original?.date;
            if (!date) return "N/A";
            try {
                return format(new Date(date), "MMM dd, yyyy");
            } catch (e) {
                return "Invalid Date";
            }
        },
    },
    {
        accessorKey: "paymentMethod",
        header: "Payment Method",
        cell: ({ row }) => {
            const paymentMethod = row.original.paymentMethod;
            if (!paymentMethod)
                return "N/A";
            //remove _
            const paymentMethodWithoutUnderscore = paymentMethod
                ?.replace("_", " ")
                ?.toLowerCase();
            return _jsx("div", { className: "capitalize", children: paymentMethodWithoutUnderscore });
        },
    },
    {
        accessorKey: "recurringInterval",
        header: ({ column }) => (_jsxs(Button, { variant: "ghost", onClick: () => column.toggleSorting(column.getIsSorted() === "asc"), children: ["Frequently", _jsx(ArrowUpDown, { className: "ml-2 h-4 w-4" })] })),
        cell: ({ row }) => {
            const frequency = row.getValue("recurringInterval");
            const nextDate = row.original?.nextRecurringDate;
            const isRecurring = row.original?.isRecurring;
            const frequencyMap = isRecurring
                ? {
                    [_TRANSACTION_FREQUENCY.DAILY]: { label: "Daily", icon: RefreshCw },
                    [_TRANSACTION_FREQUENCY.WEEKLY]: {
                        label: "Weekly",
                        icon: RefreshCw,
                    },
                    [_TRANSACTION_FREQUENCY.MONTHLY]: {
                        label: "Monthly",
                        icon: RefreshCw,
                    },
                    [_TRANSACTION_FREQUENCY.YEARLY]: {
                        label: "Yearly",
                        icon: RefreshCw,
                    },
                    DEFAULT: { label: "One-time", icon: CircleDot }, // Fallback
                }
                : { DEFAULT: { label: "One-time", icon: CircleDot } };
            const frequencyKey = isRecurring ? frequency : "DEFAULT";
            const frequencyInfo = frequencyMap?.[frequencyKey] || frequencyMap.DEFAULT;
            const { label, icon: Icon } = frequencyInfo;
            return (_jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Icon, { className: "h-4 w-4 text-muted-foreground" }), _jsxs("div", { className: "flex flex-col", children: [_jsx("span", { children: label }), nextDate && isRecurring && (_jsxs("span", { className: "text-xs text-muted-foreground", children: ["Next: ", format(nextDate, "MMM dd yyyy")] }))] })] }));
        },
        filterFn: (row, id, value) => value.includes(row.getValue(id)),
    },
    {
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => _jsx(ActionsCell, { row: row }),
    },
];
const ActionsCell = ({ row }) => {
    //const isRecurring = row.original.isRecurring;
    const transactionId = row.original.id;
    const { onOpenDrawer } = useEditTransactionDrawer();
    const [duplicateTransaction, { isLoading: isDuplicating }] = useDuplicateTransactionMutation();
    const [deleteTransaction, { isLoading: isDeleting }] = useDeleteTransactionMutation();
    const handleDuplicate = (e) => {
        e.preventDefault();
        if (isDuplicating)
            return;
        duplicateTransaction(transactionId)
            .unwrap()
            .then(() => {
            toast.success("Transaction duplicated successfully");
        })
            .catch((error) => {
            toast.error(error.data?.message || "Failed to duplicate transaction");
        });
    };
    const handleDelete = (e) => {
        e.preventDefault();
        if (isDeleting)
            return;
        deleteTransaction(transactionId)
            .unwrap()
            .then(() => {
            toast.success("Transaction deleted successfully");
        })
            .catch((error) => {
            toast.error(error.data?.message || "Failed to delete transaction");
        });
    };
    return (_jsxs(DropdownMenu, { children: [_jsx(DropdownMenuTrigger, { asChild: true, children: _jsx(Button, { variant: "ghost", className: "h-8 w-8 p-0", children: _jsx(MoreHorizontal, { className: "h-4 w-4" }) }) }), _jsxs(DropdownMenuContent, { className: "w-44", align: "end", onCloseAutoFocus: (e) => {
                    if (isDeleting || isDuplicating) {
                        e.preventDefault();
                    }
                }, children: [_jsxs(DropdownMenuItem, { onClick: () => onOpenDrawer(transactionId), children: [_jsx(Pencil, { className: "mr-1 h-4 w-4" }), "Edit"] }), _jsxs(DropdownMenuItem, { className: "relative", disabled: isDuplicating, onSelect: handleDuplicate, children: [_jsx(Copy, { className: "mr-1 h-4 w-4" }), "Duplicate", isDuplicating && (_jsx(Loader, { className: "ml-1 h-4 w-4 absolute right-2 animate-spin" }))] }), _jsx(DropdownMenuSeparator, {}), _jsxs(DropdownMenuItem, { className: "relative !text-destructive", disabled: isDeleting, onSelect: handleDelete, children: [_jsx(Trash2, { className: "mr-1 h-4 w-4 !text-destructive" }), "Delete", isDeleting && (_jsx(Loader, { className: "ml-1 h-4 w-4 absolute right-2 animate-spin" }))] })] })] }));
};

