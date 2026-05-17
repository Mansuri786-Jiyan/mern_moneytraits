import React, { useState } from "react";
import { format } from "date-fns";
import {
  Calendar as CalendarIcon,
  FileText,
  Sparkles,
  Loader,
  Mail,
  Download,
} from "lucide-react";
import { useTypedSelector } from "@/app/hook";
import { useLazyGenerateReportQuery, useSendReportNowMutation, useLazyExportTransactionsQuery } from "@/features/report/reportAPI";
import { formatCurrency } from "@/lib/format-currency";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const GenerateReportSection = () => {
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [reportData, setReportData] = useState(null);
  const [isSending, setIsSending] = useState(false);

  const { user } = useTypedSelector((state) => state.auth);
  const [triggerGenerate] = useLazyGenerateReportQuery();
  const [triggerExport] = useLazyExportTransactionsQuery();
  const [sendReportNow] = useSendReportNowMutation();

  const handleSendEmail = async () => {
    if (!fromDate || !toDate) return;
    setIsSending(true);
    try {
      const fromBoundary = new Date(fromDate);
      fromBoundary.setHours(0, 0, 0, 0);

      const toBoundary = new Date(toDate);
      toBoundary.setHours(23, 59, 59, 999);

      const result = await sendReportNow({
        from: fromBoundary.toISOString(),
        to: toBoundary.toISOString(),
      }).unwrap();
      toast.success(result.message || `Report sent to ${user?.email}`);
    } catch (error) {
      console.error("Send email error:", error);
      toast.error(error?.data?.message || "Failed to send report email");
    } finally {
      setIsSending(false);
    }
  };

  const handleExportCSV = async () => {
    if (!fromDate || !toDate) return;
    setIsDownloading(true);
    try {
      const fromBoundary = new Date(fromDate);
      fromBoundary.setHours(0, 0, 0, 0);

      const toBoundary = new Date(toDate);
      toBoundary.setHours(23, 59, 59, 999);

      const result = await triggerExport({
        from: fromBoundary.toISOString(),
        to: toBoundary.toISOString(),
      }).unwrap();

      const transactions = result.transactions || [];
      if (transactions.length === 0) {
        toast.info("No transactions found for the selected period.");
        return;
      }

      // Generate CSV Content
      const headers = "Date,Title,Type,Category,Amount (INR),Payment Method,Status\n";
      const rows = transactions.map((t) => {
        const dateStr = format(new Date(t.date), "yyyy-MM-dd");
        const title = `"${t.title.replace(/"/g, '""')}"`;
        const type = t.type;
        const category = `"${t.category.replace(/"/g, '""')}"`;
        const amount = (t.amount / 100).toFixed(2);
        const paymentMethod = t.paymentMethod || "CASH";
        const status = t.status || "COMPLETED";
        return `${dateStr},${title},${type},${category},${amount},${paymentMethod},${status}`;
      }).join("\n");

      const csvContent = headers + rows;
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `Moneytraits_Statement_${format(fromDate, "yyyyMMdd")}_to_${format(toDate, "yyyyMMdd")}.csv`);
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success("CSV file exported successfully!");
    } catch (error) {
      console.error("Export CSV error:", error);
      toast.error("Failed to generate CSV report.");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{
        __html: `
        @media screen {
          .print-only { display: none !important; }
        }
        @media print {
          .no-print { display: none !important; }
          .print-only { 
            display: block !important; 
            visibility: visible !important;
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            background: white !important;
            padding: 20px;
          }
          body { visibility: hidden !important; background: white !important; }
          .print-only, .print-only * { visibility: visible !important; }
        }
      `}} />

      <Card className="border shadow-none mb-6 overflow-hidden">
        <CardHeader className="bg-muted/30 border-b !pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                Generate custom report
              </CardTitle>
              <CardDescription>
                Select a date range to analyze your financial activity
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="flex flex-wrap items-end gap-4">
            <div className="flex flex-col gap-2">
              <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">From date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-[200px] justify-start text-left font-normal h-11 rounded-xl",
                      !fromDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {fromDate ? format(fromDate, "MMM dd, yyyy") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={fromDate}
                    onSelect={setFromDate}
                    disabled={(date) => date > new Date()}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="flex flex-col gap-2">
              <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">To date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-[200px] justify-start text-left font-normal h-11 rounded-xl",
                      !toDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {toDate ? format(toDate, "MMM dd, yyyy") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={toDate}
                    onSelect={setToDate}
                    disabled={(date) => date > new Date() || (fromDate && date < fromDate)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="flex gap-3 ml-auto">
              <Button
                onClick={handleSendEmail}
                disabled={!fromDate || !toDate || isSending}
                className="h-11 px-5 rounded-xl !text-white bg-primary shadow-lg active:scale-95 transition-all flex items-center gap-2"
              >
                {isSending ? (
                  <Loader className="h-4 w-4 animate-spin" />
                ) : (
                  <Mail className="h-4 w-4" />
                )}
                {isSending ? "Sending..." : "Email Report"}
              </Button>

              <Button
                onClick={handleExportCSV}
                disabled={!fromDate || !toDate || isDownloading}
                variant="outline"
                className="h-11 px-5 rounded-xl shadow-sm active:scale-95 transition-all flex items-center gap-2"
              >
                {isDownloading ? (
                  <Loader className="h-4 w-4 animate-spin" />
                ) : (
                  <Download className="h-4 w-4" />
                )}
                {isDownloading ? "Exporting..." : "Export CSV"}
              </Button>
            </div>
          </div>

        </CardContent>
      </Card>

      {reportData && (
        <div id="report-print-area" className="print-only">
          <div style={{ textAlign: "center", marginBottom: "40px" }}>
            <h1 style={{ fontSize: "32px", fontWeight: "900", color: "#16a34a", margin: "0" }}>Moneytraits</h1>
            <p style={{ fontSize: "14px", color: "#666", marginTop: "5px" }}>Your personal financial companion</p>
          </div>

          <div style={{ marginBottom: "30px", borderBottom: "2px solid #eee", paddingBottom: "10px" }}>
            <h2 style={{ fontSize: "20px", fontWeight: "700" }}>Financial Report: {reportData.period}</h2>
            <p style={{ fontSize: "12px", color: "#888" }}>Generated for: {user?.name} ({user?.email})</p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "40px" }}>
            <div style={{ padding: "15px", border: "1px solid #eee", borderRadius: "10px" }}>
              <p style={{ fontSize: "10px", fontWeight: "bold", textTransform: "uppercase", color: "#888", marginBottom: "5px" }}>Total Income</p>
              <p style={{ fontSize: "24px", fontWeight: "900", color: "#22c55e", margin: "0" }}>{formatCurrency(reportData.summary?.income || 0)}</p>
            </div>
            <div style={{ padding: "15px", border: "1px solid #eee", borderRadius: "10px" }}>
              <p style={{ fontSize: "10px", fontWeight: "bold", textTransform: "uppercase", color: "#888", marginBottom: "5px" }}>Total Expenses</p>
              <p style={{ fontSize: "24px", fontWeight: "900", color: "#ef4444", margin: "0" }}>{formatCurrency(reportData.summary?.expenses || 0)}</p>
            </div>
            <div style={{ padding: "15px", border: "1px solid #eee", borderRadius: "10px" }}>
              <p style={{ fontSize: "10px", fontWeight: "bold", textTransform: "uppercase", color: "#888", marginBottom: "5px" }}>Net Balance</p>
              <p style={{ fontSize: "24px", fontWeight: "900", color: "#3b82f6", margin: "0" }}>{formatCurrency(reportData.summary?.balance || 0)}</p>
            </div>
            <div style={{ padding: "15px", border: "1px solid #eee", borderRadius: "10px" }}>
              <p style={{ fontSize: "10px", fontWeight: "bold", textTransform: "uppercase", color: "#888", marginBottom: "5px" }}>Savings Rate</p>
              <p style={{ fontSize: "24px", fontWeight: "900", color: "#a855f7", margin: "0" }}>{reportData.summary?.savingsRate || 0}%</p>
            </div>
          </div>

          <div style={{ marginBottom: "40px" }}>
            <h3 style={{ fontSize: "16px", fontWeight: "700", borderBottom: "1px solid #eee", paddingBottom: "10px", marginBottom: "15px" }}>Top Spending Categories</h3>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ textAlign: "left", fontSize: "12px", color: "#888" }}>
                  <th style={{ padding: "10px 0", borderBottom: "1px solid #eee" }}>Category</th>
                  <th style={{ padding: "10px 0", borderBottom: "1px solid #eee" }}>Percentage</th>
                  <th style={{ padding: "10px 0", borderBottom: "1px solid #eee", textAlign: "right" }}>Amount</th>
                </tr>
              </thead>
              <tbody>
                {reportData.summary?.topCategories?.map(cat => (
                  <tr key={cat.name} style={{ fontSize: "14px" }}>
                    <td style={{ padding: "12px 0", borderBottom: "1px solid #f9f9f9", textTransform: "capitalize", fontWeight: "600" }}>{cat.name}</td>
                    <td style={{ padding: "12px 0", borderBottom: "1px solid #f9f9f9" }}>{cat.percent}%</td>
                    <td style={{ padding: "12px 0", borderBottom: "1px solid #f9f9f9", textAlign: "right", fontWeight: "700" }}>{formatCurrency(cat.amount)}</td>
                  </tr>
                )) || <tr><td colSpan="3" style={{ padding: "20px", textAlign: "center", color: "#888" }}>No categories found</td></tr>}
              </tbody>
            </table>
          </div>

          {reportData.insights && reportData.insights.length > 0 && (
            <div style={{ padding: "20px", background: "#f8fafc", borderRadius: "15px", border: "1px solid #e2e8f0" }}>
              <h3 style={{ fontSize: "14px", fontWeight: "800", color: "#0f172a", marginBottom: "15px", display: "flex", alignItems: "center", gap: "10px" }}>AI Financial Insights</h3>
              <div style={{ fontSize: "13px", lineHeight: "1.6", color: "#334155" }}>
                {reportData.insights.map((insight, i) => (
                  <div key={i} style={{ marginBottom: "10px", display: "flex", gap: "10px" }}>
                    <span style={{ color: "#16a34a" }}>•</span>
                    <span>{insight}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div style={{ marginTop: "60px", paddingTop: "20px", borderTop: "1px solid #eee", textAlign: "center", fontSize: "10px", color: "#999" }}>
            <p>Generated on {format(new Date(), "MMMM dd, yyyy HH:mm")}</p>
            <p>© {new Date().getFullYear()} Moneytraits - Secure Personal Finance Management</p>
          </div>
        </div>
      )}
    </>
  );
};

export default GenerateReportSection;
