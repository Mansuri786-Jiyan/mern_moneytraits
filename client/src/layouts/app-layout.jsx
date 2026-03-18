import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import Navbar from "@/components/navbar";
import { Outlet } from "react-router-dom";
import EditTransactionDrawer from "@/components/transaction/edit-transaction-drawer";
const AppLayout = () => {
    return (_jsxs(_Fragment, { children: [_jsxs("div", { className: "min-h-screen pb-10", children: [_jsx(Navbar, {}), _jsx("main", { className: "w-full max-w-full", children: _jsx(Outlet, {}) })] }), _jsx(EditTransactionDrawer, {})] }));
};
export default AppLayout;
