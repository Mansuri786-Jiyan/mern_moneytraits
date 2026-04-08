import {
  ArrowUpDown,
  CircleDot,
  Copy,
  Loader,
  MoreHorizontal,
  Pencil,
  RefreshCw,
  Trash2,
} from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import { formatCurrency } from "@/lib/format-currency";
import useEditTransactionDrawer from "@/hooks/use-edit-transaction-drawer";
import { _TRANSACTION_FREQUENCY, _TRANSACTION_TYPE } from "@/constant";
import {
  useDeleteTransactionMutation,
  useDuplicateTransactionMutation,
} from "@/features/transaction/transactionAPI";
import { toast } from "sonner";

export const transactionColumns = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        className="border-slate-400 dark:border-white/30 data-[state=checked]:bg-slate-900 dark:data-[state=checked]:bg-slate-100 data-[state=checked]:text-white dark:data-[state=checked]:text-slate-900"
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        className="border-slate-400 dark:border-white/30 data-[state=checked]:bg-slate-900 dark:data-[state=checked]:bg-slate-100 data-[state=checked]:text-white dark:data-[state=checked]:text-slate-900"
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Date Created
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
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
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="!pl-0"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Category
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const category = row.original.category;
      return <div className="capitalize">{category}</div>;
    },
  },
  {
    accessorKey: "type",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Type
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="capitalize">
        <span
          className={`px-2 py-1 rounded-full text-xs ${
            row.getValue("type") === _TRANSACTION_TYPE.INCOME
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {row.getValue("type")}
        </span>
      </div>
    ),
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "amount",
    header: () => <div className="text-right">Amount</div>,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("amount"));
      const type = row.getValue("type");
      return (
        <div
          className={`text-right font-medium ${
            type === _TRANSACTION_TYPE.INCOME
              ? "text-green-600"
              : "text-destructive"
          }`}
        >
          {type === _TRANSACTION_TYPE.EXPENSE ? "-" : "+"}
          {formatCurrency(amount)}
        </div>
      );
    },
  },
  {
    accessorKey: "date",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Transaction Date
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
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
      if (!paymentMethod) return "N/A";
      const paymentMethodWithoutUnderscore = paymentMethod
        ?.replace("_", " ")
        ?.toLowerCase();
      return <div className="capitalize">{paymentMethodWithoutUnderscore}</div>;
    },
  },
  {
    accessorKey: "recurringInterval",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Frequently
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
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
            DEFAULT: { label: "One-time", icon: CircleDot },
          }
        : { DEFAULT: { label: "One-time", icon: CircleDot } };
      const frequencyKey = isRecurring ? frequency : "DEFAULT";
      const frequencyInfo = frequencyMap?.[frequencyKey] || frequencyMap.DEFAULT;
      const { label, icon: Icon } = frequencyInfo;
      return (
        <div className="flex items-center gap-2">
          <Icon className="h-4 w-4 text-muted-foreground" />
          <div className="flex flex-col">
            <span>{label}</span>
            {nextDate && isRecurring && (
              <span className="text-xs text-muted-foreground">
                Next: {format(nextDate, "MMM dd yyyy")}
              </span>
            )}
          </div>
        </div>
      );
    },
    filterFn: (row, id, value) => value.includes(row.getValue(id)),
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => <ActionsCell row={row} />,
  },
];

const ActionsCell = ({ row }) => {
  const transactionId = row.original.id;
  const { onOpenDrawer } = useEditTransactionDrawer();
  const [duplicateTransaction, { isLoading: isDuplicating }] =
    useDuplicateTransactionMutation();
  const [deleteTransaction, { isLoading: isDeleting }] =
    useDeleteTransactionMutation();

  const handleDuplicate = (e) => {
    e.preventDefault();
    if (isDuplicating) return;
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
    if (isDeleting) return;
    deleteTransaction(transactionId)
      .unwrap()
      .then(() => {
        toast.success("Transaction deleted successfully");
      })
      .catch((error) => {
        toast.error(error.data?.message || "Failed to delete transaction");
      });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="h-8 w-8 p-0"
        >
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-44"
        align="end"
        onCloseAutoFocus={(e) => {
          if (isDeleting || isDuplicating) {
            e.preventDefault();
          }
        }}
      >
        <DropdownMenuItem onClick={() => onOpenDrawer(transactionId)}>
          <Pencil className="mr-1 h-4 w-4" />
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem
          className="relative"
          disabled={isDuplicating}
          onSelect={handleDuplicate}
        >
          <Copy className="mr-1 h-4 w-4" />
          Duplicate
          {isDuplicating && (
            <Loader className="ml-1 h-4 w-4 absolute right-2 animate-spin" />
          )}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="relative !text-destructive"
          disabled={isDeleting}
          onSelect={handleDelete}
        >
          <Trash2 className="mr-1 h-4 w-4 !text-destructive" />
          Delete
          {isDeleting && (
            <Loader className="ml-1 h-4 w-4 absolute right-2 animate-spin" />
          )}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
