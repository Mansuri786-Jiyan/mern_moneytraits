import { useTypedSelector } from "@/app/hook";
import DashboardHeader from "./_component/dashboard-header.jsx";
import DashboardStats from "./_component/dashboard-stats.jsx";

const DashboardSummary = ({ dateRange, setDateRange }) => {
  const { user } = useTypedSelector((state) => state.auth);

  return (
    <div className="w-full">
      <DashboardHeader
        title={`Welcome back, ${user?.name || "Unknown"}`}
        subtitle="This is your overview report for the selected period"
        dateRange={dateRange}
        setDateRange={setDateRange}
      />
      <DashboardStats dateRange={dateRange} />
    </div>
  );
};

export default DashboardSummary;
