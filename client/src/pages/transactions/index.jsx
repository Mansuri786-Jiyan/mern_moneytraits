import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Card, CardContent } from "@/components/ui/card";
import PageLayout from "@/components/page-layout";
import AddTransactionDrawer from "@/components/transaction/add-transaction-drawer";
import TransactionTable from "@/components/transaction/transaction-table";
import ImportTransactionModal from "@/components/transaction/import-transaction-modal";
export default function Transactions() {
  return _jsx(PageLayout, {
    title: "All Transactions",
    subtitle: "Showing all transactions",
    addMarginTop: true,
    rightAction: _jsxs("div", {
      className: "flex items-center gap-2",
      children: [
        _jsx(ImportTransactionModal, {}),
        _jsx(AddTransactionDrawer, {}),
      ],
    }),
    children: _jsx(Card, {
      className: "border-0 shadow-none",
      children: _jsx(CardContent, {
        className: "pt-2",
        children: _jsx(TransactionTable, { pageSize: 20 }),
      }),
    }),
  });
}
