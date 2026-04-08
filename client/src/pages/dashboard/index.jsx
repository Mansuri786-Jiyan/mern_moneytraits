import { useState } from "react";
import DashboardDataChart from "./dashboard-data-chart.jsx";
import DashboardSummary from "./dashboard-summary.jsx";
import PageLayout from "@/components/page-layout";
import ExpensePieChart from "./expense-pie-chart.jsx";
import DashboardRecentTransactions from "./dashboard-recent-transactions.jsx";
import BudgetOverviewWidget from "./_component/budget-overview-widget.jsx";
import BudgetAlertsWidget from "./_component/budget-alerts-widget.jsx";

const Dashboard = () => {
  const [dateRange, _setDateRange] = useState(null);

  return (
    <div className="w-full flex flex-col">
      <PageLayout
        className="space-y-6"
        renderPageHeader={
          <DashboardSummary
            dateRange={dateRange}
            setDateRange={_setDateRange}
          />
        }
      >
        <div className="w-full grid grid-cols-1 lg:grid-cols-6 gap-8">
          <div className="lg:col-span-4">
            <DashboardDataChart dateRange={dateRange} />
          </div>
          <div className="lg:col-span-2">
            <ExpensePieChart dateRange={dateRange} />
          </div>
        </div>

        <BudgetAlertsWidget />

        <div className="w-full">
          <BudgetOverviewWidget />
        </div>

        <div className="w-full mt-0">
          <DashboardRecentTransactions />
        </div>
      </PageLayout>
    </div>
  );
};

export default Dashboard;
