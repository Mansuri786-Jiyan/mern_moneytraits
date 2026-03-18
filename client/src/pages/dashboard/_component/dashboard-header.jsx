import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { DateRangeSelect } from "@/components/date-range-select";
import AddTransactionDrawer from "@/components/transaction/add-transaction-drawer";
const DashboardHeader = ({ title, subtitle, dateRange, setDateRange }) => {
    return (_jsxs("div", { className: "flex flex-col lg:flex-row items-start justify-between space-y-7", children: [_jsxs("div", { className: "space-y-1", children: [_jsx("h2", { className: "text-2xl lg:text-4xl font-medium", children: title }), _jsx("p", { className: "text-white/60 text-sm", children: subtitle })] }), _jsxs("div", { className: "flex justify-end gap-4 mb-6", children: [_jsx(DateRangeSelect, { dateRange: dateRange || null, setDateRange: (range) => setDateRange?.(range) }), _jsx(AddTransactionDrawer, {})] })] }));
};
export default DashboardHeader;
