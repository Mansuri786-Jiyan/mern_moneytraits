import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle, } from "@/components/ui/drawer";
import TransactionForm from "./transaction-form.jsx";
import useEditTransactionDrawer from "@/hooks/use-edit-transaction-drawer";
const EditTransactionDrawer = () => {
    const { open, transactionId, onCloseDrawer } = useEditTransactionDrawer();
    return (_jsx(Drawer, { open: open, onOpenChange: onCloseDrawer, direction: "right", children: _jsxs(DrawerContent, { className: "max-w-md overflow-hidden overflow-y-auto", children: [_jsxs(DrawerHeader, { children: [_jsx(DrawerTitle, { className: "text-xl font-semibold", children: "Edit Transaction" }), _jsx(DrawerDescription, { children: "Edit a transaction to track your finances" })] }), _jsx(TransactionForm, { isEdit: true, transactionId: transactionId, onCloseDrawer: onCloseDrawer })] }) }));
};
export default EditTransactionDrawer;
