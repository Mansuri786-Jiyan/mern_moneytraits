import React, { useMemo, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useGetAdminTransactionsQuery } from "@/features/admin/adminAPI";
import { Badge } from "@/components/ui/badge";
import { Loader, User as UserIcon, Calendar, ArrowUpRight, ArrowDownLeft, Search, Filter } from "lucide-react";
import { format } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

const AdminTransactions = () => {
    const { data, isLoading, isError } = useGetAdminTransactionsQuery();
    const [searchQuery, setSearchQuery] = useState("");

    const transactions = useMemo(() => {
        const _txs = data?.data ?? [];
        if (!searchQuery) return _txs;
        return _txs.filter(tx => 
            tx.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
            tx.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
            tx.userId?.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [data, searchQuery]);

    if (isLoading) {
        return (
            <div className="flex h-64 items-center justify-center">
                <Loader className="h-8 w-8 animate-spin text-emerald-500" />
            </div>
        );
    }

    if (isError) {
        return <p className="text-sm text-red-500 p-4 font-medium">Unable to load transactions</p>;
    }

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header & Controls */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-xl font-semibold text-slate-900 dark:text-white">All Transactions</h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Global ledger of platform financial activity.</p>
                </div>
                
                <div className="flex items-center gap-3 w-full sm:w-auto">
                    <div className="relative flex-1 sm:w-64">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
                        <input 
                            type="text" 
                            placeholder="Search names, categories..." 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="h-9 w-full rounded-full bg-white dark:bg-[#111] border border-slate-200 dark:border-white/10 pl-9 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-shadow shadow-sm"
                        />
                    </div>
                    <Button variant="outline" size="sm" className="h-9 rounded-full gap-2 border-slate-200 dark:border-white/10 bg-white dark:bg-[#111]">
                        <Filter className="h-4 w-4" /> Filters
                    </Button>
                </div>
            </div>

            {/* Table Container */}
            <div className="bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/5 rounded-2xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow className="border-slate-200 dark:border-white/5 hover:bg-transparent">
                                <TableHead className="font-semibold text-slate-600 dark:text-slate-400">User</TableHead>
                                <TableHead className="font-semibold text-slate-600 dark:text-slate-400">Transaction Details</TableHead>
                                <TableHead className="font-semibold text-slate-600 dark:text-slate-400">Date Logged</TableHead>
                                <TableHead className="font-semibold text-slate-600 dark:text-slate-400">Flow</TableHead>
                                <TableHead className="text-right font-semibold text-slate-600 dark:text-slate-400">Amount</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {transactions.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center text-slate-500 h-32">
                                        No transactions match your search.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                transactions.map((tx) => (
                                    <TableRow key={tx._id || tx.id} className="border-slate-100 dark:border-white/5 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                                        <TableCell>
                                            <div className="flex items-center gap-3 py-1">
                                                <Avatar className="h-9 w-9 border border-slate-200 dark:border-white/10">
                                                    <AvatarImage src={tx.userId?.profilePicture} />
                                                    <AvatarFallback className="bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300 text-xs font-semibold">
                                                        {tx.userId?.name?.substring(0, 2).toUpperCase() || <UserIcon className="h-4 w-4" />}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-medium text-slate-900 dark:text-white leading-none">{tx.userId?.name || "Unknown"}</span>
                                                    <span className="text-xs text-slate-500 mt-1">{tx.userId?.email}</span>
                                                </div>
                                            </div>
                                        </TableCell>
                                        
                                        <TableCell>
                                            <div className="flex flex-col">
                                                <span className="font-medium text-slate-900 dark:text-white">{tx.title}</span>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <span className="text-xs text-slate-500 uppercase tracking-widest font-semibold">{tx.category}</span>
                                                    <span className="text-[10px] bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-400 px-1.5 py-0.5 rounded uppercase opacity-70">Secured</span>
                                                </div>
                                            </div>
                                        </TableCell>
                                        
                                        <TableCell>
                                            <div className="flex flex-col gap-1 text-sm text-slate-600 dark:text-slate-400 font-medium">
                                                <span>{format(new Date(tx.date), "MMM d, yyyy")}</span>
                                                <span className="text-xs text-slate-400 dark:text-slate-500">{format(new Date(tx.createdAt || tx.date), "h:mm a")}</span>
                                            </div>
                                        </TableCell>
                                        
                                        <TableCell>
                                            <Badge 
                                                variant="outline" 
                                                className={`gap-1.5 px-2 py-0.5 border-none font-medium capitalize ${
                                                    tx.type === "INCOME" 
                                                    ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" 
                                                    : "bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400"
                                                }`}
                                            >
                                                {tx.type === "INCOME" ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownLeft className="h-3 w-3" />}
                                                {tx.type.toLowerCase()}
                                            </Badge>
                                        </TableCell>
                                        
                                        <TableCell className={`text-right font-bold tracking-tight text-base ${tx.type === "INCOME" ? "text-emerald-600 dark:text-emerald-400" : "text-slate-900 dark:text-white"}`}>
                                            {tx.type === "INCOME" ? "+" : "-"}₹{tx.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
                
                {/* Pagination Placeholder */}
                <div className="flex items-center justify-between border-t border-slate-200 dark:border-white/5 bg-slate-50/50 dark:bg-white/[0.01] px-6 py-3">
                    <p className="text-xs font-medium text-slate-500">Showing {Math.min(transactions.length, 10)} of {transactions.length} transactions</p>
                    <div className="flex gap-1 border border-slate-200 dark:border-white/5 rounded-lg overflow-hidden">
                        <Button variant="ghost" size="sm" disabled className="text-xs h-7 rounded-none border-r border-slate-200 dark:border-white/5">Prev</Button>
                        <Button variant="ghost" size="sm" disabled className="text-xs h-7 rounded-none">Next</Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminTransactions;
