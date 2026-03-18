import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useTypedSelector } from "@/app/hook";
import DashboardHeader from "./_component/dashboard-header.jsx";
import DashboardStats from "./_component/dashboard-stats.jsx";
const DashboardSummary = ({ dateRange, setDateRange, }) => {
    const { user } = useTypedSelector((state) => state.auth);
    return (_jsxs("div", { className: "w-full", children: [_jsx(DashboardHeader, { title: `Welcome back, ${user?.name || "Unknow"}`, subtitle: "This is your overview report for the selected period", dateRange: dateRange, setDateRange: setDateRange }), _jsx(DashboardStats, { dateRange: dateRange })] }));
};
export default DashboardSummary;
