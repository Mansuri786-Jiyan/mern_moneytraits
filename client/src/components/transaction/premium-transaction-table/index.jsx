import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import {
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  TrendingDown,
  TrendingUp,
  Calendar,
  CreditCard,
  Trash2,
  Pencil,
  Copy,
  Loader,
  RefreshCw,
  MoreVertical,
  Mail,
  Download,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { formatCurrency } from "@/lib/format-currency";
import { _TRANSACTION_TYPE } from "@/constant";
import {
  useBulkDeleteTransactionMutation,
  useGetAllTransactionsQuery,
  useDeleteTransactionMutation,
  useDuplicateTransactionMutation,
} from "@/features/transaction/transactionAPI";
import { useGetCategoriesQuery } from "@/features/category/categoryAPI";
import {
  useSendReportNowMutation,
  useLazyGenerateReportQuery,
  useLazyExportTransactionsQuery,
} from "@/features/report/reportAPI";
import { useTypedSelector } from "@/app/hook";
import { Calendar as ShadcnCalendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { toast } from "sonner";
import useEditTransactionDrawer from "@/hooks/use-edit-transaction-drawer";

const PremiumTransactionTable = ({
  pageSize = 10,
  isShowPagination = true,
  onFiltersChange,
}) => {
  const [filter, setFilter] = useState({
    type: undefined,
    recurringStatus: undefined,
    category: undefined,
    pageNumber: 1,
    pageSize: pageSize,
  });
  const [keyword, setKeyword] = useState("");
  const [selectedRows, setSelectedRows] = useState([]);

  // Statement States
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [appliedFromDate, setAppliedFromDate] = useState(null);
  const [appliedToDate, setAppliedToDate] = useState(null);
  const [isSending, setIsSending] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [localPage, setLocalPage] = useState(1);

  const { accessToken, user } = useTypedSelector((state) => state.auth);
  const [sendReportNow] = useSendReportNowMutation();
  const [triggerExport] = useLazyExportTransactionsQuery();

  // Hooks for actions
  const { onOpenDrawer } = useEditTransactionDrawer();
  const [duplicateTransaction, { isLoading: isDuplicating }] =
    useDuplicateTransactionMutation();
  const [deleteTransaction, { isLoading: isDeleting }] = useDeleteTransactionMutation();
  const [bulkDeleteTransaction, { isLoading: isBulkDeleting }] =
    useBulkDeleteTransactionMutation();

  const { data: categoriesData } = useGetCategoriesQuery();
  const allCategories = categoriesData?.categories || [];

  const isDateFilterActive = !!(appliedFromDate || appliedToDate);

  const { data, isFetching } = useGetAllTransactionsQuery({
    keyword,
    type: filter.type,
    recurringStatus: filter.recurringStatus,
    category: filter.category,
    pageNumber: isDateFilterActive ? 1 : filter.pageNumber,
    pageSize: isDateFilterActive ? 1000 : filter.pageSize,
  });

  const transactions = data?.transactions || data?.data?.transactions || [];

  // Filter transactions locally
  const filteredTransactions = transactions.filter((tx) => {
    if (!appliedFromDate && !appliedToDate) return true;
    
    const txDate = new Date(tx.date);
    
    if (appliedFromDate) {
      const startOfApplied = new Date(appliedFromDate);
      startOfApplied.setHours(0, 0, 0, 0);
      if (txDate < startOfApplied) return false;
    }
    
    if (appliedToDate) {
      const endOfApplied = new Date(appliedToDate);
      endOfApplied.setHours(23, 59, 59, 999);
      if (txDate > endOfApplied) return false;
    }
    
    return true;
  });

  const localPageSize = pageSize;
  const totalItems = isDateFilterActive ? filteredTransactions.length : (data?.pagination?.totalCount || 0);
  const totalPages = isDateFilterActive ? Math.ceil(totalItems / localPageSize) : (data?.pagination?.totalPages || 0);

  const displayTransactions = isDateFilterActive
    ? filteredTransactions.slice((localPage - 1) * localPageSize, localPage * localPageSize)
    : filteredTransactions;

  const displayPagination = {
    totalItems,
    totalPages,
    pageNumber: isDateFilterActive ? localPage : filter.pageNumber,
    pageSize: localPageSize,
  };

  // Notify parent about filters
  useEffect(() => {
    onFiltersChange?.({
      keyword,
      type: filter.type,
      recurringStatus: filter.recurringStatus,
      category: filter.category,
    });
  }, [keyword, filter.type, filter.recurringStatus, filter.category, onFiltersChange]);

  // Reset local page on filter changes
  useEffect(() => {
    setLocalPage(1);
  }, [keyword, filter.type, filter.recurringStatus, filter.category, appliedFromDate, appliedToDate]);

  const handleSendEmail = async () => {
    if (!fromDate || !toDate) return;
    setIsSending(true);
    try {
      const fromBoundary = new Date(fromDate);
      fromBoundary.setHours(0, 0, 0, 0);

      const toBoundary = new Date(toDate);
      toBoundary.setHours(23, 59, 59, 999);

      await sendReportNow({
        from: fromBoundary.toISOString(),
        to: toBoundary.toISOString(),
      }).unwrap();
      toast.success(`Statement report sent to ${user?.email}`);
    } catch (error) {
      console.error("Send email error:", error);
      toast.error(error?.data?.message || "Failed to send report email");
    } finally {
      setIsSending(false);
    }
  };

  const handleExportCSV = async () => {
    if (!fromDate || !toDate) return;
    setIsDownloading(true);
    try {
      const fromBoundary = new Date(fromDate);
      fromBoundary.setHours(0, 0, 0, 0);

      const toBoundary = new Date(toDate);
      toBoundary.setHours(23, 59, 59, 999);

      const result = await triggerExport({
        from: fromBoundary.toISOString(),
        to: toBoundary.toISOString(),
      }).unwrap();

      const transactions = result.transactions || [];
      if (transactions.length === 0) {
        toast.info("No transactions found for the selected period.");
        return;
      }

      // Generate CSV Content
      const headers = "Date,Title,Type,Category,Amount (INR),Payment Method,Status\n";
      const rows = transactions.map((t) => {
        const dateStr = format(new Date(t.date), "yyyy-MM-dd");
        const title = `"${t.title.replace(/"/g, '""')}"`;
        const type = t.type;
        const category = `"${t.category.replace(/"/g, '""')}"`;
        const amount = (t.amount / 100).toFixed(2);
        const paymentMethod = t.paymentMethod || "CASH";
        const status = t.status || "COMPLETED";
        return `${dateStr},${title},${type},${category},${amount},${paymentMethod},${status}`;
      }).join("\n");

      const csvContent = headers + rows;
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `Moneytraits_Statement_${format(fromDate, "yyyyMMdd")}_to_${format(toDate, "yyyyMMdd")}.csv`);
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success("CSV file exported successfully!");
    } catch (error) {
      console.error("Export CSV error:", error);
      toast.error("Failed to generate CSV statement.");
    } finally {
      setIsDownloading(false);
    }
  };

  const toggleSelectAll = () => {
    if (selectedRows.length === displayTransactions.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(displayTransactions.map((t) => t._id || t.id));
    }
  };

  const toggleSelectRow = (id) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleBulkDelete = () => {
    if (selectedRows.length === 0) return;
    bulkDeleteTransaction(selectedRows)
      .unwrap()
      .then(() => {
        toast.success("Transactions deleted");
        setSelectedRows([]);
      })
      .catch((err) => toast.error(err.data?.message || "Failed to delete"));
  };

  const handleAction = async (action, transactionId) => {
    if (action === "edit") {
      onOpenDrawer(transactionId);
    } else if (action === "duplicate") {
      try {
        await duplicateTransaction(transactionId).unwrap();
        toast.success("Transaction duplicated");
      } catch (err) {
        toast.error(err.data?.message || "Failed to duplicate");
      }
    } else if (action === "delete") {
      try {
        await deleteTransaction(transactionId).unwrap();
        toast.success("Transaction deleted");
      } catch (err) {
        toast.error(err.data?.message || "Failed to delete");
      }
    }
  };

  return (
    <div className="w-full space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Search & Filters */}
      <div className="flex flex-col gap-4 bg-white/50 dark:bg-slate-900/40 backdrop-blur-xl border border-slate-200 dark:border-white/10 p-5 rounded-2xl shadow-sm">
        {/* Row 1: Search and Dropdowns */}
        <div className="flex flex-col lg:flex-row gap-3">
          <div className="relative flex-1 group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 dark:text-slate-400 group-focus-within:text-slate-900 dark:group-focus-within:text-white transition-colors" />
            <Input
              placeholder="Search transactions..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              className="pl-10 h-11 bg-slate-100 dark:bg-white/5 border-slate-200 dark:border-white/5 focus:border-slate-300 dark:focus:border-white/20 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 rounded-xl transition-all"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Select
              value={filter.type || "ALL"}
              onValueChange={(val) =>
                setFilter((p) => ({
                  ...p,
                  type: val === "ALL" ? undefined : val,
                  pageNumber: 1,
                }))
              }
            >
              <SelectTrigger className="h-11 w-[130px] bg-slate-100 dark:bg-white/5 border-slate-200 dark:border-white/5 text-slate-700 dark:text-slate-300 rounded-xl focus:ring-0 transition-colors">
                <div className="flex items-center gap-2">
                  <Filter className="h-3.5 w-3.5" />
                  <SelectValue placeholder="All Types" />
                </div>
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-slate-900 border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300">
                <SelectItem value="ALL">All Types</SelectItem>
                <SelectItem value={_TRANSACTION_TYPE.INCOME}>Income</SelectItem>
                <SelectItem value={_TRANSACTION_TYPE.EXPENSE}>Expense</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={filter.recurringStatus || "ALL"}
              onValueChange={(val) =>
                setFilter((p) => ({
                  ...p,
                  recurringStatus: val === "ALL" ? undefined : val,
                  pageNumber: 1,
                }))
              }
            >
              <SelectTrigger className="h-11 w-[140px] bg-slate-100 dark:bg-white/5 border-slate-200 dark:border-white/5 text-slate-700 dark:text-slate-300 rounded-xl focus:ring-0 transition-colors">
                <SelectValue placeholder="Frequency" />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-slate-900 border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300">
                <SelectItem value="ALL">All Frequency</SelectItem>
                <SelectItem value="RECURRING">Recurring</SelectItem>
                <SelectItem value="NON_RECURRING">One-time</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={filter.category || "ALL"}
              onValueChange={(val) =>
                setFilter((p) => ({
                  ...p,
                  category: val === "ALL" ? undefined : val,
                  pageNumber: 1,
                }))
              }
            >
              <SelectTrigger className="h-11 w-[160px] bg-slate-100 dark:bg-white/5 border-slate-200 dark:border-white/5 text-slate-700 dark:text-slate-300 rounded-xl focus:ring-0 transition-colors">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-slate-900 border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 max-h-[280px]">
                <SelectItem value="ALL">All Categories</SelectItem>
                {allCategories.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value}>
                    <div className="flex items-center gap-2">
                      {cat.color && (
                        <span
                          className="inline-block w-2 h-2 rounded-full shrink-0"
                          style={{ backgroundColor: cat.color }}
                        />
                      )}
                      <span className="capitalize">{cat.label}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {selectedRows.length > 0 && (
              <Button
                variant="destructive"
                size="sm"
                onClick={handleBulkDelete}
                disabled={isBulkDeleting}
                className="h-11 rounded-xl px-5 flex items-center gap-2 animate-in zoom-in-95"
              >
                <Trash2 className="h-4 w-4" />
                Delete {selectedRows.length}
              </Button>
            )}
          </div>
        </div>

        {/* Row 2: Custom Dates + Apply + Action Buttons */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 pt-3 border-t border-slate-200/50 dark:border-white/5">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="w-[150px]">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal h-10 rounded-xl bg-slate-100 dark:bg-white/5 border-slate-200 dark:border-white/5 text-slate-700 dark:text-slate-300",
                        !fromDate && "text-muted-foreground"
                      )}
                    >
                      <Calendar className="mr-2 h-3.5 w-3.5 text-slate-400" />
                      {fromDate ? format(fromDate, "MMM dd, yyyy") : "From Date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <ShadcnCalendar
                      mode="single"
                      selected={fromDate}
                      onSelect={setFromDate}
                      disabled={(date) => date > new Date()}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <span className="text-slate-400 dark:text-slate-600 text-xs">to</span>

              <div className="w-[150px]">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal h-10 rounded-xl bg-slate-100 dark:bg-white/5 border-slate-200 dark:border-white/5 text-slate-700 dark:text-slate-300",
                        !toDate && "text-muted-foreground"
                      )}
                    >
                      <Calendar className="mr-2 h-3.5 w-3.5 text-slate-400" />
                      {toDate ? format(toDate, "MMM dd, yyyy") : "To Date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <ShadcnCalendar
                      mode="single"
                      selected={toDate}
                      onSelect={setToDate}
                      disabled={(date) =>
                        date > new Date() || (fromDate && date < fromDate)
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <Button
              onClick={() => {
                setAppliedFromDate(fromDate);
                setAppliedToDate(toDate);
                setLocalPage(1);
              }}
              className="h-10 rounded-xl px-4 !text-white bg-emerald-600 hover:bg-emerald-500 shadow-sm transition-all"
            >
              Apply Filter
            </Button>

            {(appliedFromDate || appliedToDate) && (
              <Button
                variant="ghost"
                onClick={() => {
                  setFromDate(null);
                  setToDate(null);
                  setAppliedFromDate(null);
                  setAppliedToDate(null);
                  setLocalPage(1);
                }}
                className="h-10 rounded-xl px-3 text-xs text-rose-500 hover:text-rose-400 hover:bg-rose-500/10"
              >
                Clear Date Filter
              </Button>
            )}
          </div>

          <div className="flex items-center gap-3">
            <Button
              onClick={handleSendEmail}
              disabled={!fromDate || !toDate || isSending}
              className="flex-1 lg:flex-none h-10 rounded-xl px-4 !text-white bg-[#00bc7d] hover:bg-[#00bc7d]/90 shadow-md flex items-center justify-center gap-2 active:scale-95 transition-all"
            >
              {isSending ? (
                <Loader className="h-4 w-4 animate-spin" />
              ) : (
                <Mail className="h-4 w-4" />
              )}
              {isSending ? "Sending..." : "Email Report"}
            </Button>

            <Button
              onClick={handleExportCSV}
              disabled={!fromDate || !toDate || isDownloading}
              variant="outline"
              className="flex-1 lg:flex-none h-10 rounded-xl px-4 shadow-sm border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 flex items-center justify-center gap-2 active:scale-95 transition-all"
            >
              {isDownloading ? (
                <Loader className="h-4 w-4 animate-spin" />
              ) : (
                <Download className="h-4 w-4" />
              )}
              {isDownloading ? "Exporting..." : "Export CSV"}
            </Button>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="bg-white/80 dark:bg-slate-900/40 backdrop-blur-2xl border border-slate-200 dark:border-white/10 rounded-2xl overflow-hidden shadow-xl dark:shadow-2xl">
        {/* DESKTOP TABLE VIEW */}
        <div className="hidden md:block overflow-x-auto relative">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-white/5 bg-slate-50/50 dark:bg-white/[0.02] sticky top-0 backdrop-blur-md z-10">
                <th className="px-6 py-4 w-10">
                  <Checkbox
                    checked={
                      selectedRows.length > 0 &&
                      selectedRows.length === displayTransactions.length
                    }
                    onCheckedChange={toggleSelectAll}
                    className="border-slate-400 dark:border-white/30 data-[state=checked]:bg-slate-900 dark:data-[state=checked]:bg-slate-100 data-[state=checked]:text-white dark:data-[state=checked]:text-slate-900"
                  />
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Date Created
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Title
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider text-right">
                  Amount
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Method
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider text-center">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-white/5 relative">
              {isFetching && (
                <tr className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
                  <td
                    colSpan={8}
                    className="bg-white/20 dark:bg-slate-950/20 backdrop-blur-[1px] flex items-center justify-center h-full w-full border-none"
                  >
                    <Loader className="h-8 w-8 animate-spin text-slate-500 dark:text-slate-400" />
                  </td>
                </tr>
              )}

              {displayTransactions.length === 0 && !isFetching ? (
                <tr>
                  <td colSpan="8" className="px-6 py-32 text-center">
                    <div className="flex flex-col items-center justify-center space-y-4">
                      <div className="h-20 w-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center">
                        <CreditCard className="h-10 w-10 text-slate-400 dark:text-slate-500" />
                      </div>
                      <div className="space-y-1">
                        <h3 className="text-xl font-bold text-slate-700 dark:text-slate-200">No Transactions Yet</h3>
                        <p className="text-slate-500 dark:text-slate-400 text-sm max-w-sm mx-auto">
                          You haven't logged any transactions. Click "Add Transaction" or "Scan Receipt" above to start building your financial dashboard!
                        </p>
                      </div>
                    </div>
                  </td>
                </tr>
              ) : (
                displayTransactions.map((tx) => (
                  <tr
                    key={tx._id || tx.id}
                    className="hover:bg-slate-50 dark:hover:bg-white/[0.03] transition-colors group cursor-default"
                  >
                    <td className="px-6 py-4">
                      <Checkbox
                        checked={selectedRows.includes(tx._id || tx.id)}
                        onCheckedChange={() => toggleSelectRow(tx._id || tx.id)}
                        className="border-slate-400 dark:border-white/30 data-[state=checked]:bg-slate-900 dark:data-[state=checked]:bg-slate-100 data-[state=checked]:text-white dark:data-[state=checked]:text-slate-900"
                      />
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-400">
                      {format(new Date(tx.createdAt), "MMM dd, yyyy")}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-slate-900 dark:text-white">
                          {tx.title}
                        </span>
                        {tx.isRecurring && (
                          <div className="flex items-center gap-1 mt-1">
                            <RefreshCw className="h-3 w-3 text-indigo-400" />
                            <span className="text-[10px] text-indigo-400/80 uppercase tracking-tighter">
                              Recurring
                            </span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-white/5 px-2 py-1 rounded-md capitalize">
                        {tx.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <Badge
                        className={cn(
                          "rounded-full px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider",
                          tx.type === _TRANSACTION_TYPE.INCOME
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-[0_0_15px_-5px_rgba(16,185,129,0.3)]"
                            : "bg-rose-500/10 text-rose-400 border border-rose-500/20 shadow-[0_0_15px_-5px_rgba(244,63,94,0.3)]"
                        )}
                      >
                        {tx.type}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div
                        className={cn(
                          "text-sm font-bold flex items-center justify-end gap-1",
                          tx.type === _TRANSACTION_TYPE.INCOME
                            ? "text-emerald-400"
                            : "text-rose-400"
                        )}
                      >
                        {tx.type === _TRANSACTION_TYPE.INCOME ? (
                          <TrendingUp className="h-3 w-3" />
                        ) : (
                          <TrendingDown className="h-3 w-3" />
                        )}
                        {tx.type === _TRANSACTION_TYPE.EXPENSE ? "-" : "+"}
                        {formatCurrency(tx.amount)}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-sm">
                        <CreditCard className="h-3.5 w-3.5 opacity-50" />
                        <span className="capitalize">
                          {tx.paymentMethod?.replace("_", " ")?.toLowerCase()}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <DropdownAction
                        tx={tx}
                        onAction={handleAction}
                        isLoading={isDeleting || isDuplicating}
                      />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* MOBILE CARD VIEW */}
        <div className="md:hidden divide-y divide-slate-100 dark:divide-white/5">
          {isFetching && displayTransactions.length === 0 && (
            <div className="py-20 flex justify-center">
              <Loader className="h-8 w-8 animate-spin text-slate-500" />
            </div>
          )}
          {displayTransactions.length === 0 && !isFetching && (
            <div className="py-24 px-6 text-center flex flex-col items-center justify-center space-y-4">
              <div className="h-16 w-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center">
                <CreditCard className="h-8 w-8 text-slate-400 dark:text-slate-500" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-slate-700 dark:text-slate-200">No Transactions Yet</h3>
                <p className="text-slate-500 dark:text-slate-400 text-xs">
                  Click the add button above to start logging your expenses!
                </p>
              </div>
            </div>
          )}
          {displayTransactions.map((tx) => (
            <div
              key={tx._id || tx.id}
              className="p-5 space-y-4 hover:bg-slate-50 dark:hover:bg-white/[0.02] bg-white dark:bg-white/[0.01] transition-colors relative group"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <Checkbox
                    checked={selectedRows.includes(tx._id || tx.id)}
                    onCheckedChange={() => toggleSelectRow(tx._id || tx.id)}
                    className="mt-1 border-slate-400 dark:border-white/30 data-[state=checked]:bg-slate-900 dark:data-[state=checked]:bg-slate-100 data-[state=checked]:text-white dark:data-[state=checked]:text-slate-900"
                  />
                  <div className="space-y-1">
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white leading-tight">
                      {tx.title}
                    </h4>
                    <div className="flex items-center gap-2">
                      <Badge
                        className={cn(
                          "px-2 py-0 h-4 text-[9px] font-black uppercase",
                          tx.type === _TRANSACTION_TYPE.INCOME
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                            : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                        )}
                      >
                        {tx.type}
                      </Badge>
                      <span className="text-[10px] text-slate-500 font-medium tracking-wide">
                        {format(new Date(tx.createdAt), "MMM dd, yyyy")}
                      </span>
                    </div>
                  </div>
                </div>
                <DropdownAction
                  tx={tx}
                  onAction={handleAction}
                  isLoading={isDeleting || isDuplicating}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest block">
                    Category
                  </span>
                  <span className="text-xs text-slate-600 dark:text-slate-300 capitalize">
                    {tx.category}
                  </span>
                </div>
                <div className="space-y-1 text-right">
                  <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block">
                    Amount
                  </span>
                  <span
                    className={cn(
                      "text-sm font-extrabold",
                      tx.type === _TRANSACTION_TYPE.INCOME ? "text-emerald-400" : "text-rose-400"
                    )}
                  >
                    {tx.type === _TRANSACTION_TYPE.EXPENSE ? "-" : "+"}
                    {formatCurrency(tx.amount)}
                  </span>
                </div>
                <div className="space-y-1">
                  <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest block">
                    Transaction Date
                  </span>
                  <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                    <Calendar className="h-3 w-3 opacity-70 dark:opacity-60" />
                    <span className="text-xs">
                      {format(new Date(tx.date), "MMM dd, yyyy")}
                    </span>
                  </div>
                </div>
                <div className="space-y-1 text-right">
                  <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest block">
                    Payment
                  </span>
                  <div className="flex items-center justify-end gap-1.5 text-slate-500 dark:text-slate-400">
                    <CreditCard className="h-3 w-3 opacity-70 dark:opacity-60" />
                    <span className="text-xs capitalize">
                      {tx.paymentMethod?.replace("_", " ")?.toLowerCase()}
                    </span>
                  </div>
                </div>
              </div>

              {tx.isRecurring && (
                <div className="pt-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-bold uppercase">
                    <RefreshCw className="h-3 w-3" />
                    {tx.recurringInterval} Recurring
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* PAGINATION */}
        {isShowPagination && displayPagination.totalPages > 1 && (
          <div className="px-6 py-5 border-t border-slate-100 dark:border-white/5 bg-slate-50/30 dark:bg-white/[0.02] flex items-center justify-between">
            <span className="text-xs text-slate-500 dark:text-slate-500">
              Page{" "}
              <span className="text-slate-900 dark:text-white">
                {displayPagination.pageNumber}
              </span>{" "}
              of {displayPagination.totalPages}
            </span>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                disabled={displayPagination.pageNumber === 1 || isFetching}
                onClick={() =>
                  isDateFilterActive
                    ? setLocalPage((p) => p - 1)
                    : setFilter((p) => ({ ...p, pageNumber: p.pageNumber - 1 }))
                }
                className="h-9 w-9 p-0 text-slate-400 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 rounded-lg"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <div className="flex items-center gap-1 px-1">
                {[...Array(displayPagination.totalPages)].map((_, i) => {
                  const pNum = i + 1;
                  // Only show a few page numbers
                  if (
                    pNum === 1 ||
                    pNum === displayPagination.totalPages ||
                    (pNum >= displayPagination.pageNumber - 1 &&
                      pNum <= displayPagination.pageNumber + 1)
                  ) {
                    return (
                      <button
                        key={pNum}
                        onClick={() =>
                          isDateFilterActive
                            ? setLocalPage(pNum)
                            : setFilter((p) => ({ ...p, pageNumber: pNum }))
                        }
                        className={cn(
                          "h-8 w-8 text-[11px] font-bold rounded-lg transition-all",
                          displayPagination.pageNumber === pNum
                            ? "bg-slate-900 dark:bg-white text-white dark:text-slate-950 shadow-lg shadow-slate-200 dark:shadow-white/10"
                            : "text-slate-400 dark:text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5"
                        )}
                      >
                        {pNum}
                      </button>
                    );
                  }
                  if (
                    pNum === displayPagination.pageNumber - 2 ||
                    pNum === displayPagination.pageNumber + 2
                  ) {
                    return (
                      <span key={pNum} className="text-slate-400 px-1 text-[10px]">
                        ...
                      </span>
                    );
                  }
                  return null;
                })}
              </div>
              <Button
                variant="ghost"
                size="sm"
                disabled={
                  displayPagination.pageNumber === displayPagination.totalPages ||
                  isFetching
                }
                onClick={() =>
                  isDateFilterActive
                    ? setLocalPage((p) => p + 1)
                    : setFilter((p) => ({ ...p, pageNumber: p.pageNumber + 1 }))
                }
                className="h-9 w-9 p-0 text-slate-400 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 rounded-lg"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const DropdownAction = ({ tx, onAction, isLoading }) => (
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button
        variant="ghost"
        className="h-8 w-8 p-0 text-slate-400 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 rounded-lg"
      >
        <MoreVertical className="h-4 w-4" />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent
      align="end"
      className="w-48 bg-white dark:bg-slate-900 border-slate-200 dark:border-white/10 shadow-xl dark:shadow-2xl p-1.5 rounded-xl"
    >
      <DropdownMenuItem
        onClick={() => onAction("edit", tx._id || tx.id)}
        className="flex items-center gap-3 py-2.5 px-3 focus:bg-slate-100 dark:focus:bg-white/10 text-slate-700 dark:text-slate-300 focus:text-slate-900 dark:focus:text-white rounded-lg cursor-pointer transition-colors"
      >
        <Pencil className="h-4 w-4" />
        <span className="text-sm font-medium">Edit Transaction</span>
      </DropdownMenuItem>
      <DropdownMenuItem
        onClick={() => onAction("duplicate", tx._id || tx.id)}
        className="flex items-center gap-3 py-2.5 px-3 focus:bg-slate-100 dark:focus:bg-white/10 text-slate-700 dark:text-slate-300 focus:text-slate-900 dark:focus:text-white rounded-lg cursor-pointer transition-colors"
      >
        <Copy className="h-4 w-4" />
        <span className="text-sm font-medium">Duplicate</span>
      </DropdownMenuItem>
      <DropdownMenuSeparator className="bg-slate-100 dark:bg-white/5 my-1" />
      <DropdownMenuItem
        onClick={() => onAction("delete", tx._id || tx.id)}
        className="flex items-center gap-3 py-2.5 px-3 focus:bg-rose-500/20 text-rose-500 focus:text-rose-400 rounded-lg cursor-pointer transition-colors"
      >
        <Trash2 className="h-4 w-4" />
        <span className="text-sm font-medium">Delete Forever</span>
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
);

export default PremiumTransactionTable;
