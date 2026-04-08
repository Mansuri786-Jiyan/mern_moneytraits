import React, { useState } from "react";
import { FileText } from "lucide-react";
import { useGetAllReportsQuery } from "@/features/report/reportAPI";
import EmptyState from "@/components/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import ScheduleReportDrawer from "./reports/schedule-report-drawer";
import { DataTable } from "@/components/data-table";
import { reportColumns } from "./reports/column";

const ReportHistorySection = () => {
  const [filter, setFilter] = useState({
    pageNumber: 1,
    pageSize: 5,
  });
  const [scheduleOpen, setScheduleOpen] = useState(false);

  const { data, isFetching } = useGetAllReportsQuery(filter);
  const reports = data?.reports || [];
  const pagination = data?.pagination;

  const handlePageChange = (pageNumber) => {
    setFilter((prev) => ({ ...prev, pageNumber }));
  };

  const handlePageSizeChange = (pageSize) => {
    setFilter((prev) => ({ ...prev, pageSize, pageNumber: 1 }));
  };

  const TableSkeleton = () => (
    <div className="space-y-3">
      {[1, 2, 3].map((i) => (
        <Skeleton key={i} className="h-12 w-full" />
      ))}
    </div>
  );

  return (
    <div className="mt-4">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground">
            Report history
          </h3>
          <p className="text-sm text-muted-foreground">
            Your monthly auto-generated reports and custom exports
          </p>
        </div>
        <ScheduleReportDrawer
          open={scheduleOpen}
          onOpenChange={setScheduleOpen}
          trigger={
            <Button
              variant="outline"
              size="sm"
              onClick={() => setScheduleOpen(true)}
            >
              Schedule reports
            </Button>
          }
        />
      </div>

      {isFetching ? (
        <TableSkeleton />
      ) : reports.length === 0 ? (
        <div className="py-12 border rounded-2xl bg-muted/10">
          <EmptyState
            title="No reports yet"
            description="Enable monthly reports or generate a custom report above to see them here."
            icon={FileText}
          />
        </div>
      ) : (
        <div className="space-y-4">
          <DataTable
            data={reports}
            columns={reportColumns}
            showSearch={false}
            isLoading={isFetching}
            pagination={{
              totalItems: pagination?.totalCount || 0,
              totalPages: pagination?.totalPages || 0,
              pageNumber: filter.pageNumber,
              pageSize: filter.pageSize,
            }}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
          />
        </div>
      )}
    </div>
  );
};

export default ReportHistorySection;
