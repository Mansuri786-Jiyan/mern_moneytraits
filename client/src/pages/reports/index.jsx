import { jsx as _jsx } from "react/jsx-runtime";
import { Card, CardContent, } from "@/components/ui/card";
import PageLayout from "@/components/page-layout";
import ScheduleReportDrawer from "./_component/schedule-report-drawer.jsx";
import ReportTable from "./_component/report-table.jsx";
export default function Reports() {
    return (_jsx(PageLayout, { title: "Report History", subtitle: "View and manage your financial reports", addMarginTop: true, rightAction: _jsx(ScheduleReportDrawer, {}), children: _jsx(Card, { className: "border shadow-none", children: _jsx(CardContent, { children: _jsx(ReportTable, {}) }) }) }));
}
