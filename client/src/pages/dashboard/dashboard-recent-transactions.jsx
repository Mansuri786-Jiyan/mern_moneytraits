import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Link } from "react-router-dom";
import TransactionTable from "@/components/transaction/transaction-table";
import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle, } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { PROTECTED_ROUTES } from "@/routes/common/routePath";
const DashboardRecentTransactions = () => {
    return (_jsxs(Card, { className: "!shadow-none border-1 border-gray-100 dark:border-border", children: [_jsxs(CardHeader, { className: "!pb-0", children: [_jsx(CardTitle, { className: "text-xl", children: "Recent Transactions" }), _jsx(CardDescription, { children: "Showing all recent transactions" }), _jsx(CardAction, { children: _jsx(Button, { asChild: true, variant: "link", className: "!text-gray-700 dark:!text-gray-200 !font-normal", children: _jsx(Link, { to: PROTECTED_ROUTES.TRANSACTIONS, children: "View all" }) }) }), _jsx(Separator, { className: "mt-3 !bg-gray-100 dark:!bg-gray-800" })] }), _jsx(CardContent, { className: "pt-0", children: _jsx(TransactionTable, { pageSize: 10, isShowPagination: false }) })] }));
};
export default DashboardRecentTransactions;
