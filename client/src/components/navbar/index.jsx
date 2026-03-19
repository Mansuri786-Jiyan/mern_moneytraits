import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from "react";
import { Menu } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import { PROTECTED_ROUTES } from "@/routes/common/routePath";
import { cn } from "@/lib/utils";
import Logo from "../logo/logo.jsx";
import { Button } from "../ui/button.jsx";
import { Sheet, SheetContent } from "../ui/sheet.jsx";
import { UserNav } from "./user-nav.jsx";
import LogoutDialog from "./logout-dialog.jsx";
import { useTypedSelector } from "@/app/hook";
const Navbar = () => {
    const { pathname } = useLocation();
    const { user } = useTypedSelector((state) => state.auth);
    const [isOpen, setIsOpen] = useState(false);
    const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);
    const routes = user?.role === "ADMIN"
        ? [
            {
                href: PROTECTED_ROUTES.ADMIN,
                label: "Admin",
            },
            {
                href: PROTECTED_ROUTES.SETTINGS,
                label: "Settings",
            },
        ]
        : [
            {
                href: PROTECTED_ROUTES.OVERVIEW,
                label: "Overview",
            },
            {
                href: PROTECTED_ROUTES.TRANSACTIONS,
                label: "Transactions",
            },
            {
                href: PROTECTED_ROUTES.REPORTS,
                label: "Reports",
            },
            {
                href: PROTECTED_ROUTES.SETTINGS,
                label: "Settings",
            },
        ];
    return (_jsxs(_Fragment, { children: [_jsx("header", { className: cn("w-full px-4 py-3 pb-3 lg:px-14 bg-[var(--secondary-dark-color)] text-white ", pathname === PROTECTED_ROUTES.OVERVIEW && "!pb-3"), children: _jsx("div", { className: "w-full flex h-14 max-w-[var(--max-width)] items-center mx-auto", children: _jsxs("div", { className: "w-full flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center gap-4", children: [_jsx(Button, { variant: "ghost", size: "icon", className: "inline-flex md:hidden !cursor-pointer\r\n               !bg-white/10 !text-white hover:bg-white/10", onClick: () => setIsOpen(true), children: _jsx(Menu, { className: "h-6 w-6" }) }), _jsx(Logo, {})] }), _jsx("nav", { className: "hidden md:flex items-center gap-x-2 overflow-x-auto", children: routes?.map((route) => (_jsx(Button, { size: "sm", variant: "ghost", className: cn(`w-full lg:w-auto font-normal py-4.5
                     hover:text-white border-none
                     text-white/60 focus:bg-white/30
                     transtion !bg-transparent !text-[14.5px]
                     `, pathname === route.href && "text-white"), asChild: true, children: _jsx(NavLink, { to: route.href, children: route.label }) }, route.href))) }), _jsx(Sheet, { open: isOpen, onOpenChange: setIsOpen, children: _jsx(SheetContent, { side: "left", className: "bg-white", children: _jsx("nav", { className: "flex flex-col gap-y-2 pt-9", children: routes?.map((route) => (_jsx(Button, { size: "sm", variant: "ghost", className: cn(`w-full font-normal py-4.5
                       hover:bg-white/10 hover:text-black border-none
                       text-black/70 focus:bg-white/30
                       transtion !bg-transparent justify-start`, pathname === route.href && "!bg-black/10 text-black"), asChild: true, children: _jsx(NavLink, { to: route.href, children: route.label }) }, route.href))) }) }) }), _jsx("div", { className: "flex items-center space-x-4", children: _jsx(UserNav, { userName: user?.name || "", profilePicture: user?.profilePicture || "", onLogout: () => setIsLogoutDialogOpen(true) }) })] }) }) }), _jsx(LogoutDialog, { isOpen: isLogoutDialogOpen, setIsOpen: setIsLogoutDialogOpen })] }));
};
export default Navbar;
