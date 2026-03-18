import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Fragment } from "react";
const PageHeader = ({ title, subtitle, rightAction, renderPageHeader }) => {
    return (_jsx("div", { className: "w-full pb-20 pt-4 px-5 lg:px-0 bg-[#1a1e2a] text-white", children: _jsx("div", { className: "w-full max-w-[var(--max-width)]  mx-auto", children: renderPageHeader
                ? _jsx(Fragment, { children: renderPageHeader })
                : (_jsxs("div", { className: "w-full flex flex-col gap-3 items-start justify-start lg:items-center lg:flex-row lg:justify-between", children: [(title || subtitle) && (_jsxs("div", { className: "space-y-1", children: [title && _jsx("h2", { className: "text-2xl lg:text-4xl font-medium", children: title }), subtitle && _jsx("p", { className: "text-white/60 text-sm", children: subtitle })] })), rightAction && rightAction] })) }) }));
};
export default PageHeader;
