import React, { useState } from "react";
import { FileText, CalendarDays } from "lucide-react";
import PageLayout from "@/components/page-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useGetAllReportsQuery } from "@/features/report/reportAPI";
import ReportTable from "./_component/report-table";
import BulkImportModal from "@/components/transaction/bulk-import-modal";
import ScheduleReportDrawer from "./_component/schedule-report-drawer";
import GenerateReportSection from "./_component/generate-report-section";

export default function Reports() {
    const { data: allReports } = useGetAllReportsQuery({ pageNumber: 1, pageSize: 1 });
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    return (
        <PageLayout 
            title="Reports" 
            subtitle="Generate and view financial reports" 
            addMarginTop={true} 
            rightAction={
                <BulkImportModal>
                    <Button variant="outline"><FileText className="mr-2 h-4 w-4"/> Import CSV</Button>
                </BulkImportModal>
            }
        >
            <div className="space-y-6">
                {/* Main Generation & Preview Section */}
                <GenerateReportSection />
                
                {/* History Section */}
                <Card className="border shadow-none overflow-hidden">
                    <CardContent className="pt-6">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 border-b mb-4 gap-4">
                            <div>
                                <h3 className="font-bold text-lg tracking-tight">Report history</h3>
                                <p className="text-sm text-muted-foreground font-medium">
                                    Access and manage your previously generated reports
                                </p>
                            </div>
                            <ScheduleReportDrawer 
                                open={isDrawerOpen}
                                onOpenChange={setIsDrawerOpen}
                                trigger={
                                    <Button variant="outline" className="rounded-xl h-10 px-4">
                                        <CalendarDays className="mr-2 h-4 w-4" />
                                        Report Settings
                                    </Button>
                                }
                            />
                        </div>
                        <ReportTable />
                    </CardContent>
                </Card>
            </div>
        </PageLayout>
    );
}
