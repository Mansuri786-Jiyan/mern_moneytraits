import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { cn } from "@/lib/utils";
import PageHeader from "./page-header.jsx";
const PageLayout = ({ children, className, title, subtitle, rightAction, showHeader = true, addMarginTop = false, renderPageHeader, }) => {
    return (_jsxs("div", { children: [showHeader && (_jsx(PageHeader, { title: title, subtitle: subtitle, rightAction: rightAction, renderPageHeader: renderPageHeader })), _jsx("div", { className: cn("w-full max-w-[var(--max-width)] mx-auto pt-8", addMarginTop && "-mt-20", className), children: children })] }));
};
export default PageLayout;
