import React, { useState } from "react";
import { format } from "date-fns";
import { 
  Calendar as CalendarIcon, 
  FileText, 
  Sparkles, 
  Loader, 
  Mail, 
  Download,
  X
} from "lucide-react";
import { useTypedSelector } from "@/app/hook";
import { useSendReportNowMutation } from "@/features/report/reportAPI";
import { formatCurrency } from "@/lib/format-currency";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerTrigger,
  DrawerClose,
} from "@/components/ui/drawer";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const GenerateReportDrawer = () => {
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [reportData, setReportData] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const { accessToken, user } = useTypedSelector((state) => state.auth);
  const [sendReportNow] = useSendReportNowMutation();

  const handleGenerate = async () => {
    if (!fromDate || !toDate) return;
    if (fromDate > toDate) {
      toast.error("From date must be before to date");
      return;
    }

    setIsGenerating(true);
    setReportData(null);

    try {
      const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8010/api';
      const url = `${baseUrl}/report/generate?from=${fromDate.toISOString()}&to=${toDate.toISOString()}`;
      
      const res = await fetch(url, {
        headers: { 
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      });

      const json = await res.json();

      if (!res.ok) {
        toast.error(json.message || "No transactions in this period");
        setIsGenerating(false);
        return;
      }

      setReportData(json.data);
      toast.success("Report generated!");
    } catch (error) {
      console.error("Generate report error:", error);
      toast.error("Failed to generate report. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSendEmail = async () => {
    if (!fromDate || !toDate) return;
    setIsSending(true);
    try {
      await sendReportNow({
        from: fromDate.toISOString(),
        to: toDate.toISOString()
      }).unwrap();
      toast.success(`Report sent to ${user?.email}`);
    } catch (error) {
      console.error("Send email error:", error);
      toast.error(error?.data?.message || "Failed to send report email");
    } finally {
      setIsSending(false);
    }
  };

  const handlePrintPDF = () => {
    if (!reportData) return;

    const printArea = document.createElement("div");
    printArea.id = "report-print-area";
    printArea.style.fontFamily = "Arial, sans-serif";
    printArea.style.padding = "40px";
    printArea.innerHTML = `
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #00bc7d; margin: 0; font-size: 32px;">Moneytraits</h1>
        <p style="color: #666; font-size: 14px; margin-top: 5px;">Your personal finance companion</p>
      </div>
      <h2 style="border-bottom: 2px solid #eee; padding-bottom: 10px; margin-bottom: 20px;">Financial Report — ${reportData.period}</h2>
      
      <div style="margin-bottom: 30px;">
        <p><strong>Generated for:</strong> ${user?.name} (${user?.email})</p>
        <p><strong>Date range:</strong> ${reportData.period}</p>
      </div>

      <table style="width: 100%; border-collapse: collapse; margin-top: 20px; border: 1px solid #ddd;">
        <tr style="background-color: #f9f9f9;">
          <th style="border: 1px solid #ddd; padding: 12px; text-align: left;">Category</th>
          <th style="border: 1px solid #ddd; padding: 12px; text-align: left;">Details</th>
        </tr>
        <tr>
          <td style="border: 1px solid #ddd; padding: 12px;"><strong>Total Income</strong></td>
          <td style="border: 1px solid #ddd; padding: 12px; color: #22c55e; font-weight: bold;">${formatCurrency(reportData.summary.income)}</td>
        </tr>
        <tr>
          <td style="border: 1px solid #ddd; padding: 12px;"><strong>Total Expenses</strong></td>
          <td style="border: 1px solid #ddd; padding: 12px; color: #ef4444; font-weight: bold;">${formatCurrency(reportData.summary.expenses)}</td>
        </tr>
        <tr>
          <td style="border: 1px solid #ddd; padding: 12px;"><strong>Net Balance</strong></td>
          <td style="border: 1px solid #ddd; padding: 12px; font-weight: bold;">${formatCurrency(reportData.summary.balance)}</td>
        </tr>
        <tr>
          <td style="border: 1px solid #ddd; padding: 12px;"><strong>Savings Rate</strong></td>
          <td style="border: 1px solid #ddd; padding: 12px;">${reportData.summary.savingsRate}%</td>
        </tr>
      </table>

      ${reportData.summary.topCategories.length > 0 ? `
        <h3 style="margin-top: 30px; margin-bottom: 15px;">Top Spending Categories</h3>
        <table style="width: 100%; border-collapse: collapse; border: 1px solid #ddd;">
          <thead>
            <tr style="background-color: #f9f9f9;">
              <th style="border: 1px solid #ddd; padding: 12px; text-align: left;">Category</th>
              <th style="border: 1px solid #ddd; padding: 12px; text-align: center;">Percentage</th>
              <th style="border: 1px solid #ddd; padding: 12px; text-align: right;">Amount</th>
            </tr>
          </thead>
          <tbody>
            ${reportData.summary.topCategories.map(cat => `
              <tr>
                <td style="border: 1px solid #ddd; padding: 12px; text-transform: capitalize;">${cat.name}</td>
                <td style="border: 1px solid #ddd; padding: 12px; text-align: center;">${cat.percent}%</td>
                <td style="border: 1px solid #ddd; padding: 12px; text-align: right;">${formatCurrency(cat.amount)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      ` : ''}

      ${reportData.insights && reportData.insights.length > 0 ? `
        <h3 style="margin-top: 30px; margin-bottom: 15px;">AI Insights</h3>
        <ul style="padding-left: 20px; color: #444;">
          ${reportData.insights.map(insight => `
            <li style="margin-bottom: 8px;">${insight}</li>
          `).join('')}
        </ul>
      ` : ''}

      <div style="margin-top: 50px; text-align: center; color: #888; font-size: 11px; border-top: 1px solid #eee; padding-top: 20px;">
        <p>© ${new Date().getFullYear()} Moneytraits - Secure Personal Finance Management</p>
        <p>Generated on ${format(new Date(), "MMMM dd, yyyy")}</p>
      </div>
    `;

    document.body.appendChild(printArea);
    window.print();
    
    window.onafterprint = () => {
      document.getElementById('report-print-area')?.remove();
    };
  };

  return (
    <Drawer direction="right">
      <DrawerTrigger asChild>
        <Button 
          variant="outline"
          className="!shadow-none !cursor-pointer !border-gray-500 !text-white !bg-transparent hover:!bg-white/5"
        >
          <FileText className="!w-5 !h-5 mr-2" />
          Generate Report
        </Button>
      </DrawerTrigger>
      <DrawerContent className="h-full ml-auto max-w-lg focus:outline-none">
        <DrawerHeader className="relative pr-10">
          <DrawerTitle className="text-2xl font-bold flex items-center gap-2">
            Generate report
          </DrawerTitle>
          <DrawerDescription>
            Select a date range to generate, preview, email or download your financial report.
          </DrawerDescription>
          <DrawerClose asChild>
            <Button variant="ghost" size="icon" className="absolute right-4 top-4 rounded-full">
              <X className="h-4 w-4" />
            </Button>
          </DrawerClose>
        </DrawerHeader>

        <div className="flex-1 overflow-y-auto px-6 py-4 custom-scrollbar">
          {/* Section 1 - Date Range Selection */}
          <div className="space-y-4">
            <div className="flex gap-3">
              <div className="flex-1 space-y-2">
                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">From date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal h-11 rounded-xl",
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

              <div className="flex-1 space-y-2">
                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">To date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal h-11 rounded-xl",
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
            </div>

            <Button
              onClick={handleGenerate}
              disabled={!fromDate || !toDate || isGenerating}
              className="w-full h-11 px-6 rounded-xl !text-white shadow-lg active:scale-95 transition-all"
            >
              {isGenerating ? (
                <Loader className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Sparkles className="h-4 w-4 mr-2" />
              )}
              {isGenerating ? "Generating..." : "Generate report"}
            </Button>
          </div>

          {/* Section 2 - Report Preview */}
          {reportData && (
            <div className="mt-8 border-t pt-6 animate-in fade-in slide-in-from-top-4 duration-500">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="font-semibold text-foreground tracking-tight">{reportData.period}</p>
                  <p className="text-xs text-muted-foreground">Report snapshot</p>
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="rounded-xl h-9 px-3"
                    onClick={handleSendEmail}
                    disabled={isSending}
                  >
                    {isSending ? (
                      <Loader className="h-3.5 w-3.5 animate-spin mr-1.5" />
                    ) : (
                      <Mail className="h-3.5 w-3.5 mr-1.5" />
                    )}
                    {isSending ? "Sending..." : "Send to email"}
                  </Button>
                  <Button 
                    size="sm" 
                    className="!text-white rounded-xl h-9 px-3 shadow-sm"
                    onClick={handlePrintPDF}
                  >
                    <Download className="h-3.5 w-3.5 mr-1.5" />
                    Download PDF
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mt-3">
                {[
                  { label: "Income", value: formatCurrency(reportData.summary.income), color: "text-green-500" },
                  { label: "Expenses", value: formatCurrency(reportData.summary.expenses), color: "text-red-500" },
                  { label: "Balance", value: formatCurrency(reportData.summary.balance), color: "text-blue-500" },
                  { label: "Savings rate", value: `${reportData.summary.savingsRate}%`, color: "text-purple-500" },
                ].map((item, idx) => (
                  <div key={idx} className="p-3 rounded-lg bg-muted/30 border border-muted/50 group hover:bg-muted/50 transition-all">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground opacity-70">{item.label}</p>
                    <p className={cn("text-base font-black mt-0.5", item.color)}>{item.value}</p>
                  </div>
                ))}
              </div>

              {/* Top Categories */}
              <div className="mt-6">
                <p className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-3">Top spending categories</p>
                <div className="space-y-1">
                  {reportData.summary.topCategories.map(cat => (
                    <div key={cat.name} className="flex justify-between items-center py-2.5 px-1 border-b border-muted/50 last:border-0 text-sm group transition-all">
                      <span className="capitalize font-medium text-foreground/80 group-hover:translate-x-0.5 transition-transform">{cat.name}</span>
                      <div className="flex items-center gap-4">
                        <span className="text-[10px] font-bold text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                          {cat.percent}%
                        </span>
                        <span className="font-bold text-foreground">
                          {formatCurrency(cat.amount)}
                        </span>
                      </div>
                    </div>
                  ))}
                  {reportData.summary.topCategories.length === 0 && (
                    <p className="text-sm text-muted-foreground py-4 italic text-center">No category data for this period</p>
                  )}
                </div>
              </div>

              {/* AI Insights */}
              {reportData.insights && reportData.insights.length > 0 && (
                <div className="mt-8 space-y-3">
                  <div className="flex items-center gap-2">
                    <p className="text-xs font-black uppercase tracking-widest text-primary/70">AI Financial Insights</p>
                    <div className="h-px flex-1 bg-primary/20" />
                  </div>
                  <div className="p-4 rounded-xl bg-primary/5 border border-primary/20 relative overflow-hidden group">
                    <div className="absolute -top-4 -right-4 w-12 h-12 bg-primary/5 rounded-full blur-xl group-hover:scale-150 transition-transform duration-700" />
                    <ul className="space-y-2.5 relative z-10">
                      {reportData.insights.map((insight, i) => (
                        <li key={i} className="text-[13px] text-foreground/80 flex gap-2.5 leading-relaxed">
                          <Sparkles className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
                          <span className="font-medium">{insight}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default GenerateReportDrawer;
