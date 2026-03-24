import React, { useMemo } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useGetAdminTransactionsQuery } from "@/features/admin/adminAPI";
import { Badge } from "@/components/ui/badge";
import { Loader, User as UserIcon, Calendar, ArrowUpRight, ArrowDownLeft } from "lucide-react";
import { format } from "date-fns";

const AdminTransactions = () => {
    const { data, isLoading, isError } = useGetAdminTransactionsQuery();

    const transactions = useMemo(() => data?.data ?? [], [data]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center p-8">
                <Loader className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
        );
    }

    if (isError) {
        return <p className="text-sm text-red-500 p-4 font-medium">Unable to load transactions</p>;
    }

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Transaction</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {transactions.length === 0 ? (
                    <TableRow>
                        <TableCell colSpan={5} className="text-center text-muted-foreground h-24">
                            No transactions found
                        </TableCell>
                    </TableRow>
                ) : (
                    transactions.map((tx) => (
                        <TableRow key={tx.id}>
                            <TableCell>
                                <div className="flex items-center gap-2">
                                    <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center overflow-hidden border">
                                        {tx.userId?.profilePicture ? (
                                            <img src={tx.userId.profilePicture} alt={tx.userId.name} className="h-full w-full object-cover" />
                                        ) : (
                                            <UserIcon className="h-4 w-4 text-muted-foreground" />
                                        )}
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-sm font-medium leading-none">{tx.userId?.name || "Unknown User"}</span>
                                        <span className="text-[10px] text-muted-foreground lowercase">{tx.userId?.email}</span>
                                    </div>
                                </div>
                                <div className="mt-1">
                                    <Badge variant="secondary" className="text-[9px] px-1 py-0 font-normal opacity-50">PII Masked</Badge>
                                </div>
                            </TableCell>
                            <TableCell>
                                <div className="flex flex-col">
                                    <span className="font-medium">{tx.title}</span>
                                    <span className="text-[10px] text-muted-foreground uppercase">{tx.category}</span>
                                </div>
                            </TableCell>
                            <TableCell>
                                <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                                    <Calendar className="h-3 w-3" />
                                    {format(new Date(tx.date), "MMM d, yyyy")}
                                </div>
                            </TableCell>
                            <TableCell>
                                <Badge 
                                    variant="outline" 
                                    className={`gap-1 px-1.5 py-0.5 capitalize ${
                                        tx.type === "INCOME" 
                                        ? "text-green-600 bg-green-50 border-green-200" 
                                        : "text-red-600 bg-red-50 border-red-200"
                                    }`}
                                >
                                    {tx.type === "INCOME" ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownLeft className="h-3 w-3" />}
                                    {tx.type.toLowerCase()}
                                </Badge>
                            </TableCell>
                            <TableCell className={`text-right font-bold ${tx.type === "INCOME" ? "text-green-600" : "text-red-600"}`}>
                                {tx.type === "INCOME" ? "+" : "-"}₹{tx.amount.toLocaleString()}
                            </TableCell>
                        </TableRow>
                    ))
                )}
            </TableBody>
        </Table>
    );
};

export default AdminTransactions;
