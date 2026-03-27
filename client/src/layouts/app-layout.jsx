import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { Outlet } from "react-router-dom";
import Navbar from "@/components/navbar";
import EditTransactionDrawer from "@/components/transaction/edit-transaction-drawer";
import AiAdvisor from "@/components/ai-advisor";
import ChatBot from "@/components/chatbot";

const AppLayout = () => {
    return (_jsxs(_Fragment, { children: [
        _jsxs("div", { 
            className: "min-h-screen pb-10", 
            children: [
                _jsx(Navbar, {}), 
                _jsx("main", { 
                    className: "w-full max-w-full", 
                    children: _jsx(Outlet, {}) 
                })
            ] 
        }), 
        _jsx(EditTransactionDrawer, {}), 
        _jsx(AiAdvisor, {}), 
        _jsx(ChatBot, {})
    ] }));
};
export default AppLayout;
