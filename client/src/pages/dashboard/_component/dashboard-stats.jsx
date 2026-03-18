import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useSummaryAnalyticsQuery } from "@/features/analytics/analyticsAPI";
import SummaryCard from "./summary-card.jsx";
const DashboardStats = ({ dateRange }) => {
    const { data, isFetching } = useSummaryAnalyticsQuery({ preset: dateRange?.value }, { skip: !dateRange });
    const summaryData = data?.data;
    return (_jsx("div", { className: "flex flex-row items-center", children: _jsxs("div", { className: "flex-1 lg:flex-[1] grid grid-cols-1 lg:grid-cols-4 gap-4", children: [_jsx(SummaryCard, { title: "Available Balance", value: summaryData?.availableBalance, dateRange: dateRange, percentageChange: summaryData?.percentageChange?.balance, isLoading: isFetching, cardType: "balance" }), _jsx(SummaryCard, { title: "Total Income", value: summaryData?.totalIncome, percentageChange: summaryData?.percentageChange?.income, dateRange: dateRange, isLoading: isFetching, cardType: "income" }), _jsx(SummaryCard, { title: "Total Expenses", value: summaryData?.totalExpenses, dateRange: dateRange, percentageChange: summaryData?.percentageChange?.expenses, isLoading: isFetching, cardType: "expenses" }), _jsx(SummaryCard, { title: "Savings Rate", value: summaryData?.savingRate?.percentage, expenseRatio: summaryData?.savingRate?.expenseRatio, isPercentageValue: true, dateRange: dateRange, isLoading: isFetching, cardType: "savings" })] }) }));
};
export default DashboardStats;
