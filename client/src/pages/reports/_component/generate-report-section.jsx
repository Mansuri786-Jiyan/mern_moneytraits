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
import { useLazyGenerateReportQuery, useSendReportNowMutation } from "@/features/report/reportAPI";
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
  const [reportData, setReportData] = useState(null);
  const [isSending, setIsSending] = useState(false);

  const { user } = useTypedSelector((state) => state.auth);
  const [triggerGenerate, { isFetching: isGenerating }] = useLazyGenerateReportQuery();
  const [sendReportNow] = useSendReportNowMutation();

  const handleGenerate = async () => {
    if (!fromDate || !toDate) return;
    if (fromDate > toDate) {
      toast.error("From date cannot be after To date");
      return;
    }

    try {
      const result = await triggerGenerate({
        from: fromDate.toISOString(),
        to: toDate.toISOString(),
      }).unwrap();
      
      setReportData(result);
      toast.success("Report generated successfully!");
    } catch (error) {
      console.error("Generate report error:", error);
      toast.error(error?.data?.message || "Failed to generate report. Make sure dates have transactions.");
    }
  };

  const handleSendEmail = async () => {
    if (!fromDate || !toDate) return;
    setIsSending(true);
    try {
      const result = await sendReportNow({
        from: fromDate.toISOString(),
        to: toDate.toISOString(),
      }).unwrap();
      toast.success(result.message || `Report sent to ${user?.email}`);
    } catch (error) {
      console.error("Send email error:", error);
      toast.error(error?.data?.message || "Failed to send report email");
    } finally {
      setIsSending(false);
    }
  };

  const handleDownloadPDF = () => {
    window.print();
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
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

            <Button
              onClick={handleGenerate}
              disabled={!fromDate || !toDate || isGenerating}
              className="h-11 px-6 rounded-xl !text-white shadow-lg active:scale-95 transition-all ml-auto"
            >
              {isGenerating ? (
                <Loader className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Sparkles className="h-4 w-4 mr-2" />
              )}
              {isGenerating ? "Generating..." : "Generate report"}
            </Button>
          </div>

          {reportData && (
            <div className="mt-8 border-t pt-8 animate-in fade-in slide-in-from-top-4 duration-500">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <div>
                  <h3 className="text-xl font-black tracking-tight text-foreground">
                    Report Preview — {reportData.period}
                  </h3>
                  <p className="text-sm text-muted-foreground">Generated analysis for your selected period</p>
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="rounded-xl h-10 px-4"
                    onClick={handleSendEmail}
                    disabled={isSending}
                  >
                    {isSending ? (
                      <Loader className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      <Mail className="h-4 w-4 mr-2" />
                    )}
                    {isSending ? "Sending..." : "Send to email"}
                  </Button>
                  <Button 
                    size="sm" 
                    className="!text-white rounded-xl h-10 px-4 shadow-md"
                    onClick={handleDownloadPDF}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download PDF
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { label: "Total income", value: formatCurrency(reportData.summary?.income || 0), color: "text-green-500" },
                  { label: "Total expenses", value: formatCurrency(reportData.summary?.expenses || 0), color: "text-red-500" },
                  { label: "Net balance", value: formatCurrency(reportData.summary?.balance || 0), color: "text-blue-500" },
                  { label: "Savings rate", value: `${reportData.summary?.savingsRate || 0}%`, color: "text-purple-500" },
                ].map((item, idx) => (
                  <div key={idx} className="p-4 rounded-2xl border bg-muted/10 group hover:bg-muted/20 transition-all">
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-70">{item.label}</p>
                    <p className={cn("text-xl font-black mt-1", item.color)}>{item.value}</p>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <p className="text-xs font-black uppercase tracking-widest text-muted-foreground">Top spending categories</p>
                    <div className="h-px flex-1 bg-border/40" />
                  </div>
                  <div className="space-y-1">
                    {reportData.summary?.topCategories?.map((cat) => (
                      <div
                        key={cat.name}
                        className="flex items-center justify-between p-3 rounded-xl hover:bg-muted/30 transition-all group"
                      >
                        <span className="capitalize text-sm font-bold group-hover:translate-x-1 transition-transform">{cat.name}</span>
                        <div className="flex items-center gap-4">
                          <span className="text-[10px] font-black text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                            {cat.percent}%
                          </span>
                          <span className="text-sm font-black whitespace-nowrap">
                            {formatCurrency(cat.amount)}
                          </span>
                        </div>
                      </div>
                    )) || <p className="text-sm text-muted-foreground py-4">No categories found</p>}
                  </div>
                </div>

                {reportData.insights && reportData.insights.length > 0 && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <p className="text-xs font-black uppercase tracking-widest text-primary/70">AI Financial Insights</p>
                      <div className="h-px flex-1 bg-primary/20" />
                    </div>
                    <div className="p-5 rounded-2xl bg-primary/5 border border-primary/10 relative overflow-hidden group">
                      <div className="absolute -top-6 -right-6 w-24 h-24 bg-primary/5 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
                      <ul className="space-y-3 relative z-10">
                        {reportData.insights.map((insight, i) => (
                          <li key={i} className="text-sm text-foreground/80 flex gap-3 leading-relaxed">
                            <Sparkles className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                            <span className="font-medium">{insight}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
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
