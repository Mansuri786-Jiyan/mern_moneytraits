import React, { useState } from "react";
import { CopyPlus, ArrowRightLeft, Landmark, Banknote, CalendarDays, Download, Mail, RefreshCw, FileText } from "lucide-react";
import PageLayout from "@/components/page-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useGenerateReportQuery, useEmailReportMutation, useGetAllReportsQuery } from "@/features/report/reportAPI";
import ReportTable from "./_component/report-table";
import { toast } from "sonner";
import { formatCurrency } from "@/lib/format-currency";
import BulkImportModal from "@/components/transaction/bulk-import-modal";
import { EmptyState } from "@/components/empty-state";
import ScheduleReportDrawer from "./_component/schedule-report-drawer";

export default function Reports() {
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    
    const { data: allReports } = useGetAllReportsQuery({ pageNumber: 1, pageSize: 1 });
    const isReportsEmpty = allReports?.pagination?.totalCount === 0;

    const [generateReport, { data: reportData, isLoading: isGenerating }] = useGenerateReportQuery();
    const [emailReport, { isLoading: isEmailing }] = useEmailReportMutation();

    const handleGenerate = async () => {
        if (!fromDate || !toDate) {
            toast.error("Please select both dates.");
            return;
        }
        try {
            await generateReport({ from: fromDate, to: toDate }).unwrap();
            toast.success("Report generated successfully!");
        } catch (error) {
            toast.error(error?.data?.message || "Failed to generate report.");
        }
    };

    const handleEmail = async () => {
        if (!fromDate || !toDate) {
            toast.error("Please select a date range first.");
            return;
        }
        try {
            await emailReport({ from: fromDate, to: toDate }).unwrap();
            toast.success("Report emailed to your registered address!");
        } catch (error) {
            toast.error(error?.data?.message || "Failed to email report.");
        }
    };

    const handleDownload = () => {
        if (!reportData?.summary) {
            toast.error("Generate a report first to download it.");
            return;
        }
        
        const { summary, transactions } = reportData;
        let csvContent = "data:text/csv;charset=utf-8,";
        
        // Summary Section
        csvContent += "FINANCIAL SUMMARY\n";
        csvContent += "Metric,Value\n";
        csvContent += `Income,"${summary.income}"\n`;
        csvContent += `Expenses,"${summary.expenses}"\n`;
        csvContent += `Balance,"${summary.balance}"\n`;
        csvContent += `Savings Rate,${summary.savingsRate}%\n\n`;
        
        // Categories Section
        csvContent += "TOP SPENDING CATEGORIES\n";
        csvContent += "Category,Amount,Percentage\n";
        summary.topCategories?.forEach(cat => {
            csvContent += `"${cat.name}","${cat.amount}",${cat.percent}%\n`;
        });
        csvContent += "\n";

        // Transactions Section
        if (transactions && transactions.length > 0) {
            csvContent += "DETAILED TRANSACTIONS\n";
            csvContent += "Date,Title,Amount,Type,Category,Description\n";
            transactions.forEach(t => {
                const date = new Date(t.date).toLocaleDateString();
                const category = t.category?.name || t.category || "N/A";
                csvContent += `${date},"${t.title}",${t.amount},${t.type},"${category}","${t.description || ""}"\n`;
            });
        }

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `financial_report_${fromDate}_to_${toDate}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        toast.success("Detailed report downloaded!");
    };

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
                
                {/* Generate Report Section */}
                <Card className="border shadow-none">
                    <CardHeader className="pb-4">
                        <CardTitle className="text-base flex items-center gap-2">
                            <FileText className="h-5 w-5 text-primary" />
                            Generate Report
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
                            <div className="space-y-2">
                                <Label htmlFor="from">From</Label>
                                <div className="relative">
                                    <Input 
                                        id="from" 
                                        type="date" 
                                        value={fromDate}
                                        onChange={(e) => setFromDate(e.target.value)}
                                        className="pl-10 h-11 bg-muted/30" 
                                    />
                                    <CalendarDays className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="to">To</Label>
                                <div className="relative">
                                    <Input 
                                        id="to" 
                                        type="date" 
                                        value={toDate}
                                        onChange={(e) => setToDate(e.target.value)}
                                        className="pl-10 h-11 bg-muted/30" 
                                    />
                                    <CalendarDays className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                                </div>
                            </div>
                            <div className="col-span-1 md:col-span-2 flex gap-2 w-full justify-end md:justify-start lg:justify-end">
                                <Button 
                                    className="h-11 shadow-sm gap-2 min-w-32 bg-emerald-500 hover:bg-emerald-600 text-white"
                                    onClick={handleGenerate}
                                    disabled={isGenerating}
                                >
                                    <RefreshCw className={`h-4 w-4 ${isGenerating ? 'animate-spin' : ''}`} />
                                    Generate
                                </Button>
                                <Button 
                                    variant="outline" 
                                    className="h-11 shadow-sm gap-2"
                                    onClick={handleEmail}
                                    disabled={isEmailing}
                                >
                                    <Mail className="h-4 w-4" />
                                    Email
                                </Button>
                                <Button 
                                    variant="outline" 
                                    className="h-11 shadow-sm gap-2"
                                    onClick={handleDownload}
                                >
                                    <Download className="h-4 w-4" />
                                    Download
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Report Results Section */}
                <Card className="border shadow-none">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-base font-medium">Report Results</CardTitle>
                        {reportData?.summary && <span className="text-xs text-muted-foreground cursor-pointer hover:underline">Close</span>}
                    </CardHeader>
                    <CardContent>
                        {reportData?.summary ? (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
                                <Card className="bg-emerald-500/10 border-0 shadow-none">
                                    <CardHeader className="pb-2">
                                        <CardDescription className="flex items-center gap-1"><ArrowRightLeft className="h-3 w-3 -rotate-45 text-emerald-500"/> Income</CardDescription>
                                        <CardTitle className="text-2xl text-emerald-500">{formatCurrency(reportData.summary.income)}</CardTitle>
                                    </CardHeader>
                                </Card>
                                <Card className="bg-red-500/10 border-0 shadow-none">
                                    <CardHeader className="pb-2">
                                        <CardDescription className="flex items-center gap-1"><ArrowRightLeft className="h-3 w-3 rotate-45 text-red-500"/> Expenses</CardDescription>
                                        <CardTitle className="text-2xl text-red-500">{formatCurrency(reportData.summary.expenses)}</CardTitle>
                                    </CardHeader>
                                </Card>
                                <Card className="bg-blue-500/10 border-0 shadow-none">
                                    <CardHeader className="pb-2">
                                        <CardDescription className="flex items-center gap-1"><Landmark className="h-3 w-3 text-blue-500"/> Savings Rate</CardDescription>
                                        <CardTitle className="text-2xl text-blue-500">{reportData.summary.savingsRate}%</CardTitle>
                                    </CardHeader>
                                </Card>
                            </div>
                        ) : (
                            <div className="py-8 text-center text-muted-foreground text-sm">
                                No reports generated yet
                            </div>
                        )}
                    </CardContent>
                </Card>

                {isReportsEmpty ? (
                    <Card className="border shadow-none py-12 flex flex-col items-center justify-center">
                        <EmptyState 
                            title="No reports yet" 
                            description="Your monthly financial reports will appear here automatically. Enable reports in settings to get started." 
                            icon={FileText} 
                        />
                        <div className="mt-4">
                            <Button onClick={() => setIsDrawerOpen(true)}>Go to Report Settings</Button>
                        </div>
                    </Card>
                ) : (
                    <Card className="border shadow-none">
                        <CardHeader className="pb-0 pt-6 px-6">
                            <CardTitle className="text-base font-medium">Report History</CardTitle>
                        </CardHeader>
                        <CardContent className="pt-4 px-0 pb-0">
                            <ReportTable />
                        </CardContent>
                    </Card>
                )}
                <ScheduleReportDrawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen} />
            </div>
        </PageLayout>
    );
}
