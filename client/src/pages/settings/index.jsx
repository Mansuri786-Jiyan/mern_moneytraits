import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import PageLayout from "@/components/page-layout";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { PROTECTED_ROUTES } from "@/routes/common/routePath";
import { Link, Outlet, useLocation } from "react-router-dom";
const Settings = () => {
    const sidebarNavItems = [
        { title: "Account", href: PROTECTED_ROUTES.SETTINGS },
        { title: "Appearance", href: PROTECTED_ROUTES.SETTINGS_APPEARANCE },
        { title: "Billings", href: PROTECTED_ROUTES.SETTINGS_BILLING },
    ];
    return (_jsx(PageLayout, { title: "Settings", subtitle: "Manage your account settings and set e-mail preferences.", addMarginTop: true, children: _jsx(Card, { className: "border shadow-none", children: _jsx(CardContent, { children: _jsxs("div", { className: "flex flex-col space-y-8 lg:flex-row lg:space-x-12\r\n         lg:space-y-0 pb-10 pt-2", children: [_jsx("aside", { className: "mr-4 lg:w-1/5", children: _jsx(SidebarNav, { items: sidebarNavItems }) }), _jsx("div", { className: "flex-1 lg:max-w-2xl", children: _jsx(Outlet, {}) })] }) }) }) }));
};
function SidebarNav({ items }) {
    const { pathname } = useLocation();
    return (_jsx("nav", { className: "flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1", children: items.map((item) => (_jsx(Link, { to: item.href, className: cn(buttonVariants({ variant: "ghost" }), pathname === item.href
                ? "bg-muted hover:bg-muted"
                : "hover:bg-transparent hover:underline", "justify-start"), children: item.title }, item.href))) }));
}
export default Settings;
