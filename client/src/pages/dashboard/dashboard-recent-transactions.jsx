import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Link } from "react-router-dom";
import PremiumTransactionTable from "@/components/transaction/premium-transaction-table/index.jsx";
import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle, } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { PROTECTED_ROUTES } from "@/routes/common/routePath";
import { EmptyState } from "@/components/empty-state";
import { PlusCircleIcon } from "lucide-react";
import { useGetAllTransactionsQuery } from "@/features/transaction/transactionAPI";
import AddTransactionDrawer from "@/components/transaction/add-transaction-drawer";

const DashboardRecentTransactions = () => {
    const { data: transactionData } = useGetAllTransactionsQuery({ pageNumber: 1, pageSize: 1 });
    const isTransactionsEmpty = transactionData?.pagination?.totalCount === 0;

    return (_jsxs("div", {
        className: "bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-700",
        children: [
            _jsxs("div", {
                className: "flex items-center justify-between p-6 pb-2",
                children: [
                    _jsxs("div", {
                        className: "space-y-1",
                        children: [
                            _jsx("h3", { className: "text-xl font-bold text-white", children: "Recent Transactions" }),
                            _jsx("p", { className: "text-slate-400 text-sm font-medium", children: "Showing your latest activity" })
                        ]
                    }),
                    _jsx(Button, { asChild: true, variant: "ghost", className: "text-indigo-400 hover:text-indigo-300 hover:bg-indigo-500/10 font-bold text-sm", children: _jsx(Link, { to: PROTECTED_ROUTES.TRANSACTIONS, children: "View all" }) })
                ]
            }),
            _jsx("div", {
                className: "px-2 pb-2",
                children: isTransactionsEmpty ? (
                    _jsxs("div", { className: "flex flex-col items-center justify-center py-12", children: [
                        _jsx(EmptyState, { title: "No transactions yet", description: "Add your first transaction to start tracking your finances", icon: PlusCircleIcon }),
                        _jsx("div", { className: "mt-6", children: _jsx(AddTransactionDrawer, {}) })
                    ] })
                ) : (
                    _jsx(PremiumTransactionTable, { pageSize: 10, isShowPagination: false })
                )
            })
        ]
    }));
};
export default DashboardRecentTransactions;
