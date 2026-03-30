import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import DashboardDataChart from "./dashboard-data-chart.jsx";
import DashboardSummary from "./dashboard-summary.jsx";
import PageLayout from "@/components/page-layout";
//import ExpenseBreakDown from "./expense-breakdown";
import ExpensePieChart from "./expense-pie-chart.jsx";
import DashboardRecentTransactions from "./dashboard-recent-transactions.jsx";
import BudgetOverviewWidget from "./_component/budget-overview-widget.jsx";
import BudgetAlertsWidget from "./_component/budget-alerts-widget.jsx";
import SpendingForecast from "./_component/spending-forecast.jsx";
import { useState } from "react";
const Dashboard = () => {
  const [dateRange, _setDateRange] = useState(null);
  return _jsx("div", {
    className: "w-full flex flex-col",
    children: _jsxs(PageLayout, {
      className: "space-y-6",
      renderPageHeader: _jsx(DashboardSummary, {
        dateRange: dateRange,
        setDateRange: _setDateRange,
      }),
      children: [
        _jsxs("div", {
          className: "w-full grid grid-cols-1 lg:grid-cols-6 gap-8",
          children: [
            _jsx("div", {
              className: "lg:col-span-4",
              children: _jsx(DashboardDataChart, { dateRange: dateRange }),
            }),
            _jsx("div", {
              className: "lg:col-span-2",
              children: _jsx(ExpensePieChart, { dateRange: dateRange }),
            }),
          ],
        }),
        _jsx(BudgetAlertsWidget, {}),
        _jsxs("div", {
          className: "w-full grid grid-cols-1 lg:grid-cols-2 gap-8",
          children: [
            _jsx(SpendingForecast, {}),
            _jsx(BudgetOverviewWidget, {}),
          ],
        }),
        _jsx("div", {
          className: "w-full mt-0",
          children: _jsx(DashboardRecentTransactions, {}),
        }),
      ],
    }),
  });
};
export default Dashboard;
