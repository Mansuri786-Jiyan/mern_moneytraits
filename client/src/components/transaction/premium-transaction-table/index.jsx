import React, { useState, useEffect, useMemo } from "react";
import { format } from "date-fns";
import {
  Search,
  Filter,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  TrendingDown,
  TrendingUp,
  Calendar,
  CreditCard,
  Repeat,
  Trash2,
  Pencil,
  Copy,
  Loader,
  CircleDot,
  RefreshCw,
  MoreVertical,
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
import { _TRANSACTION_FREQUENCY, _TRANSACTION_TYPE } from "@/constant";
import {
  useBulkDeleteTransactionMutation,
  useGetAllTransactionsQuery,
  useDeleteTransactionMutation,
  useDuplicateTransactionMutation,
} from "@/features/transaction/transactionAPI";
import { toast } from "sonner";
import useEditTransactionDrawer from "@/hooks/use-edit-transaction-drawer";

const PremiumTransactionTable = ({ pageSize = 10, isShowPagination = true, onFiltersChange }) => {
  const [filter, setFilter] = useState({
    type: undefined,
    recurringStatus: undefined,
    pageNumber: 1,
    pageSize: pageSize,
  });
  const [keyword, setKeyword] = useState("");
  const [selectedRows, setSelectedRows] = useState([]);

  // Hooks for actions
  const { onOpenDrawer } = useEditTransactionDrawer();
  const [duplicateTransaction, { isLoading: isDuplicating }] = useDuplicateTransactionMutation();
  const [deleteTransaction, { isLoading: isDeleting }] = useDeleteTransactionMutation();
  const [bulkDeleteTransaction, { isLoading: isBulkDeleting }] = useBulkDeleteTransactionMutation();

  const { data, isFetching } = useGetAllTransactionsQuery({
    keyword,
    type: filter.type,
    recurringStatus: filter.recurringStatus,
    pageNumber: filter.pageNumber,
    pageSize: filter.pageSize,
  });

  const transactions = data?.transactions || data?.data?.transactions || [];
  const pagination = {
    totalItems: data?.pagination?.totalCount || 0,
    totalPages: data?.pagination?.totalPages || 0,
    pageNumber: filter.pageNumber,
    pageSize: filter.pageSize,
  };

  // Notify parent about filters
  useEffect(() => {
    onFiltersChange?.({
      keyword,
      type: filter.type,
      recurringStatus: filter.recurringStatus,
    });
  }, [keyword, filter.type, filter.recurringStatus, onFiltersChange]);

  const toggleSelectAll = () => {
    if (selectedRows.length === transactions.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(transactions.map((t) => t._id || t.id));
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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/40 backdrop-blur-xl border border-white/10 p-4 rounded-2xl">
        <div className="relative flex-1 group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-white transition-colors" />
          <Input
            placeholder="Search transactions..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className="pl-10 h-11 bg-white/5 border-white/5 focus:border-white/20 text-white placeholder:text-slate-500 rounded-xl transition-all"
          />
        </div>
        
        <div className="flex items-center gap-3">
          <Select
            value={filter.type || "ALL"}
            onValueChange={(val) => setFilter(p => ({ ...p, type: val === "ALL" ? undefined : val, pageNumber: 1 }))}
          >
            <SelectTrigger className="h-11 w-[140px] bg-white/5 border-white/5 text-slate-300 rounded-xl focus:ring-0">
              <div className="flex items-center gap-2">
                <Filter className="h-3.5 w-3.5" />
                <SelectValue placeholder="All Types" />
              </div>
            </SelectTrigger>
            <SelectContent className="bg-slate-900 border-white/10 text-slate-300">
              <SelectItem value="ALL">All Types</SelectItem>
              <SelectItem value={_TRANSACTION_TYPE.INCOME}>Income</SelectItem>
              <SelectItem value={_TRANSACTION_TYPE.EXPENSE}>Expense</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={filter.recurringStatus || "ALL"}
            onValueChange={(val) => setFilter(p => ({ ...p, recurringStatus: val === "ALL" ? undefined : val, pageNumber: 1 }))}
          >
            <SelectTrigger className="h-11 w-[160px] bg-white/5 border-white/5 text-slate-300 rounded-xl focus:ring-0">
              <SelectValue placeholder="Frequency" />
            </SelectTrigger>
            <SelectContent className="bg-slate-900 border-white/10 text-slate-300">
              <SelectItem value="ALL">All Frequency</SelectItem>
              <SelectItem value="RECURRING">Recurring</SelectItem>
              <SelectItem value="NON_RECURRING">One-time</SelectItem>
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

      {/* Main Container */}
      <div className="bg-slate-900/40 backdrop-blur-2xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
        {/* DESKTOP TABLE VIEW */}
        <div className="hidden md:block overflow-x-auto relative">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 bg-white/[0.02] sticky top-0 backdrop-blur-md z-10">
                <th className="px-6 py-4 w-10">
                  <Checkbox
                    checked={selectedRows.length > 0 && selectedRows.length === transactions.length}
                    onCheckedChange={toggleSelectAll}
                    className="border-white/20 data-[state=checked]:bg-slate-100 data-[state=checked]:text-slate-900"
                  />
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Date Created</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Title</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Category</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Type</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider text-right">Amount</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Method</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 relative">
              {isFetching && (
                <div className="absolute inset-0 bg-slate-950/20 backdrop-blur-[1px] flex items-center justify-center z-20">
                  <Loader className="h-8 w-8 animate-spin text-slate-400" />
                </div>
              )}
              
              {transactions.length === 0 && !isFetching ? (
                <tr>
                  <td colSpan="8" className="px-6 py-20 text-center text-slate-500">
                    No transactions found
                  </td>
                </tr>
              ) : (
                transactions.map((tx) => (
                  <tr 
                    key={tx._id || tx.id}
                    className="hover:bg-white/[0.03] transition-colors group cursor-default"
                  >
                    <td className="px-6 py-4">
                      <Checkbox
                        checked={selectedRows.includes(tx._id || tx.id)}
                        onCheckedChange={() => toggleSelectRow(tx._id || tx.id)}
                        className="border-white/20 data-[state=checked]:bg-slate-100 data-[state=checked]:text-slate-900"
                      />
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-400">
                      {format(new Date(tx.createdAt), "MMM dd, yyyy")}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-white">{tx.title}</span>
                        {tx.isRecurring && (
                           <div className="flex items-center gap-1 mt-1">
                               <RefreshCw className="h-3 w-3 text-indigo-400" />
                               <span className="text-[10px] text-indigo-400/80 uppercase tracking-tighter">Recurring</span>
                           </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs text-slate-300 bg-white/5 px-2 py-1 rounded-md capitalize">
                        {tx.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <Badge className={cn(
                        "rounded-full px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider",
                        tx.type === _TRANSACTION_TYPE.INCOME 
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-[0_0_15px_-5px_rgba(16,185,129,0.3)]" 
                          : "bg-rose-500/10 text-rose-400 border border-rose-500/20 shadow-[0_0_15px_-5px_rgba(244,63,94,0.3)]"
                      )}>
                        {tx.type}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className={cn(
                        "text-sm font-bold flex items-center justify-end gap-1",
                        tx.type === _TRANSACTION_TYPE.INCOME ? "text-emerald-400" : "text-rose-400"
                      )}>
                        {tx.type === _TRANSACTION_TYPE.INCOME ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                        {tx.type === _TRANSACTION_TYPE.EXPENSE ? "-" : "+"}
                        {formatCurrency(tx.amount)}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                       <div className="flex items-center gap-2 text-slate-400 text-sm">
                          <CreditCard className="h-3.5 w-3.5 opacity-50" />
                          <span className="capitalize">{tx.paymentMethod?.replace("_", " ")?.toLowerCase()}</span>
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
        <div className="md:hidden divide-y divide-white/5">
           {isFetching && transactions.length === 0 && (
             <div className="py-20 flex justify-center">
               <Loader className="h-8 w-8 animate-spin text-slate-500" />
             </div>
           )}
           {transactions.length === 0 && !isFetching && (
             <div className="py-20 text-center text-slate-500 text-sm">
               No transactions found
             </div>
           )}
           {transactions.map((tx) => (
             <div 
               key={tx._id || tx.id} 
               className="p-5 space-y-4 hover:bg-white/[0.02] bg-white/[0.01] transition-colors relative group"
             >
               <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                     <Checkbox
                        checked={selectedRows.includes(tx._id || tx.id)}
                        onCheckedChange={() => toggleSelectRow(tx._id || tx.id)}
                        className="mt-1 border-white/20 data-[state=checked]:bg-slate-100 data-[state=checked]:text-slate-900"
                      />
                      <div className="space-y-1">
                        <h4 className="text-sm font-bold text-white leading-tight">{tx.title}</h4>
                        <div className="flex items-center gap-2">
                          <Badge className={cn(
                            "px-2 py-0 h-4 text-[9px] font-black uppercase",
                            tx.type === _TRANSACTION_TYPE.INCOME 
                              ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" 
                              : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                          )}>
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
                    <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block">Category</span>
                    <span className="text-xs text-slate-300 capitalize">{tx.category}</span>
                  </div>
                  <div className="space-y-1 text-right">
                    <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block">Amount</span>
                    <span className={cn(
                        "text-sm font-extrabold",
                        tx.type === _TRANSACTION_TYPE.INCOME ? "text-emerald-400" : "text-rose-400"
                      )}>
                        {tx.type === _TRANSACTION_TYPE.EXPENSE ? "-" : "+"}
                        {formatCurrency(tx.amount)}
                    </span>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block">Transaction Date</span>
                    <div className="flex items-center gap-1.5 text-slate-400">
                       <Calendar className="h-3 w-3 opacity-60" />
                       <span className="text-xs">{format(new Date(tx.date), "MMM dd, yyyy")}</span>
                    </div>
                  </div>
                  <div className="space-y-1 text-right">
                    <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block">Payment</span>
                    <div className="flex items-center justify-end gap-1.5 text-slate-400">
                       <CreditCard className="h-3 w-3 opacity-60" />
                       <span className="text-xs capitalize">{tx.paymentMethod?.replace("_", " ")?.toLowerCase()}</span>
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
        {isShowPagination && pagination.totalPages > 1 && (
          <div className="px-6 py-5 border-t border-white/5 bg-white/[0.02] flex items-center justify-between">
             <span className="text-xs text-slate-500">
               Page <span className="text-white">{pagination.pageNumber}</span> of {pagination.totalPages}
             </span>
             <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  disabled={pagination.pageNumber === 1 || isFetching}
                  onClick={() => setFilter(p => ({ ...p, pageNumber: p.pageNumber - 1 }))}
                  className="h-9 w-9 p-0 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <div className="flex items-center gap-1 px-1">
                   {[...Array(pagination.totalPages)].map((_, i) => {
                      const pNum = i + 1;
                      // Only show a few page numbers
                      if (pNum === 1 || pNum === pagination.totalPages || (pNum >= pagination.pageNumber - 1 && pNum <= pagination.pageNumber + 1)) {
                        return (
                          <button
                            key={pNum}
                            onClick={() => setFilter(p => ({ ...p, pageNumber: pNum }))}
                            className={cn(
                              "h-8 w-8 text-[11px] font-bold rounded-lg transition-all",
                              pagination.pageNumber === pNum 
                                ? "bg-white text-slate-950 shadow-lg shadow-white/10" 
                                : "text-slate-500 hover:text-white hover:bg-white/5"
                            )}
                          >
                            {pNum}
                          </button>
                        );
                      }
                      if (pNum === pagination.pageNumber - 2 || pNum === pagination.pageNumber + 2) {
                        return <span key={pNum} className="text-slate-600 px-1 text-[10px]">...</span>;
                      }
                      return null;
                   })}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  disabled={pagination.pageNumber === pagination.totalPages || isFetching}
                  onClick={() => setFilter(p => ({ ...p, pageNumber: p.pageNumber + 1 }))}
                  className="h-9 w-9 p-0 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg"
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
      <Button variant="ghost" className="h-8 w-8 p-0 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg">
        <MoreVertical className="h-4 w-4" />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end" className="w-48 bg-slate-900 border-white/10 shadow-2xl p-1.5 rounded-xl">
      <DropdownMenuItem 
        onClick={() => onAction("edit", tx._id || tx.id)}
        className="flex items-center gap-3 py-2.5 px-3 focus:bg-white/10 focus:text-white rounded-lg cursor-pointer transition-colors"
      >
        <Pencil className="h-4 w-4" />
        <span className="text-sm font-medium">Edit Transaction</span>
      </DropdownMenuItem>
      <DropdownMenuItem 
        onClick={() => onAction("duplicate", tx._id || tx.id)}
        className="flex items-center gap-3 py-2.5 px-3 focus:bg-white/10 focus:text-white rounded-lg cursor-pointer transition-colors"
      >
        <Copy className="h-4 w-4" />
        <span className="text-sm font-medium">Duplicate</span>
      </DropdownMenuItem>
      <DropdownMenuSeparator className="bg-white/5 my-1" />
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
