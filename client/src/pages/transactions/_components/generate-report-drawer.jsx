import React, { useState } from "react";
import { format } from "date-fns";
import {
  Calendar as CalendarIcon,
  FileText,
  Sparkles,
  Loader,
  Mail,
  Download,
  X,
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
  const [isSending, setIsSending] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const { accessToken, user } = useTypedSelector((state) => state.auth);
  const [sendReportNow] = useSendReportNowMutation();

  const handleSendEmail = async () => {
    if (!fromDate || !toDate) return;
    setIsSending(true);
    try {
      await sendReportNow({
        from: fromDate.toISOString(),
        to: toDate.toISOString(),
      }).unwrap();
      toast.success(`Report sent to ${user?.email}`);
    } catch (error) {
      console.error("Send email error:", error);
      toast.error(error?.data?.message || "Failed to send report email");
    } finally {
      setIsSending(false);
    }
  };

  const handlePrintPDF = async () => {
    if (!fromDate || !toDate) return;
    setIsDownloading(true);
    try {
      const baseUrl =
        import.meta.env.VITE_API_URL || "http://localhost:8010/api";
      const url = `${baseUrl}/report/generate?from=${fromDate.toISOString()}&to=${toDate.toISOString()}`;

      const res = await fetch(url, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });

      const json = await res.json();
      if (!res.ok) {
        toast.error(json.message || "No transactions in this period");
        setIsDownloading(false);
        return;
      }

      const activeReportData = json.data;
      setReportData(activeReportData);

      setTimeout(() => {
        const printArea = document.createElement("div");
        printArea.id = "report-print-area";
        printArea.style.fontFamily = "Arial, sans-serif";
        printArea.style.padding = "40px";
        printArea.innerHTML = `
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #00bc7d; margin: 0; font-size: 32px;">Moneytraits</h1>
            <p style="color: #666; font-size: 14px; margin-top: 5px;">Your personal finance companion</p>
          </div>
          <h2 style="border-bottom: 2px solid #eee; padding-bottom: 10px; margin-bottom: 20px;">Financial Report — ${
            activeReportData.period
          }</h2>
          
          <div style="margin-bottom: 30px;">
            <p><strong>Generated for:</strong> ${user?.name} (${user?.email})</p>
            <p><strong>Date range:</strong> ${activeReportData.period}</p>
          </div>

          <table style="width: 100%; border-collapse: collapse; margin-top: 20px; border: 1px solid #ddd;">
            <tr style="background-color: #f9f9f9;">
              <th style="border: 1px solid #ddd; padding: 12px; text-align: left;">Category</th>
              <th style="border: 1px solid #ddd; padding: 12px; text-align: left;">Details</th>
            </tr>
            <tr>
              <td style="border: 1px solid #ddd; padding: 12px;"><strong>Total Income</strong></td>
              <td style="border: 1px solid #ddd; padding: 12px; color: #22c55e; font-weight: bold;">${formatCurrency(
                activeReportData.summary.income
              )}</td>
            </tr>
            <tr>
              <td style="border: 1px solid #ddd; padding: 12px;"><strong>Total Expenses</strong></td>
              <td style="border: 1px solid #ddd; padding: 12px; color: #ef4444; font-weight: bold;">${formatCurrency(
                activeReportData.summary.expenses
              )}</td>
            </tr>
            <tr>
              <td style="border: 1px solid #ddd; padding: 12px;"><strong>Net Balance</strong></td>
              <td style="border: 1px solid #ddd; padding: 12px; font-weight: bold;">${formatCurrency(
                activeReportData.summary.balance
              )}</td>
            </tr>
            <tr>
              <td style="border: 1px solid #ddd; padding: 12px;"><strong>Savings Rate</strong></td>
              <td style="border: 1px solid #ddd; padding: 12px;">${
                activeReportData.summary.savingsRate
              }%</td>
            </tr>
          </table>

          ${
            activeReportData.summary.topCategories.length > 0
              ? `
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
                ${activeReportData.summary.topCategories
                  .map(
                    (cat) => `
                  <tr>
                    <td style="border: 1px solid #ddd; padding: 12px; text-transform: capitalize;">${cat.name}</td>
                    <td style="border: 1px solid #ddd; padding: 12px; text-align: center;">${cat.percent}%</td>
                    <td style="border: 1px solid #ddd; padding: 12px; text-align: right;">${formatCurrency(
                      cat.amount
                    )}</td>
                  </tr>
                `
                  )
                  .join("")}
              </tbody>
            </table>
          `
              : ""
          }

          ${
            activeReportData.insights && activeReportData.insights.length > 0
              ? `
            <h3 style="margin-top: 30px; margin-bottom: 15px;">AI Insights</h3>
            <ul style="padding-left: 20px; color: #444;">
              ${activeReportData.insights
                .map(
                  (insight) => `
                <li style="margin-bottom: 8px;">${insight}</li>
              `
                )
                .join("")}
            </ul>
          `
              : ""
          }

          <div style="margin-top: 50px; text-align: center; color: #888; font-size: 11px; border-top: 1px solid #eee; padding-top: 20px;">
            <p>© ${new Date().getFullYear()} Moneytraits - Secure Personal Finance Management</p>
            <p>Generated on ${format(new Date(), "MMMM dd, yyyy")}</p>
          </div>
        `;

        document.body.appendChild(printArea);
        window.print();
        setIsDownloading(false);

        window.onafterprint = () => {
          document.getElementById("report-print-area")?.remove();
        };
      }, 500);

    } catch (error) {
      console.error("Print PDF error:", error);
      toast.error("Failed to generate PDF statement.");
      setIsDownloading(false);
    }
  };

  return (
    <Drawer direction="right">
      <DrawerTrigger asChild>
        <Button
          variant="outline"
          className="!shadow-none !cursor-pointer !border-gray-500 !text-white !bg-transparent hover:!bg-white/5"
        >
          <FileText className="!w-5 !h-5 mr-2" />
          Statement Options
        </Button>
      </DrawerTrigger>
      <DrawerContent className="h-full ml-auto max-w-lg focus:outline-none">
        <DrawerHeader className="relative pr-10">
          <DrawerTitle className="text-2xl font-bold flex items-center gap-2">
            Statement Options
          </DrawerTitle>
          <DrawerDescription>
            Select a custom date range to email or download your financial statement.
          </DrawerDescription>
          <DrawerClose asChild>
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-4 top-4 rounded-full"
            >
              <X className="h-4 w-4" />
            </Button>
          </DrawerClose>
        </DrawerHeader>

        <div className="flex-1 overflow-y-auto px-6 py-4 custom-scrollbar">
          {/* Section 1 - Date Range Selection */}
          <div className="space-y-4">
            <div className="flex gap-3">
              <div className="flex-1 space-y-2">
                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  From date
                </Label>
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
                      {fromDate
                        ? format(fromDate, "MMM dd, yyyy")
                        : "Pick a date"}
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
                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  To date
                </Label>
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
                      disabled={(date) =>
                        date > new Date() || (fromDate && date < fromDate)
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div className="flex flex-col gap-3 mt-4">
              <Button
                onClick={handleSendEmail}
                disabled={!fromDate || !toDate || isSending}
                className="w-full h-11 px-6 rounded-xl !text-white bg-primary shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                {isSending ? (
                  <Loader className="h-4 w-4 animate-spin" />
                ) : (
                  <Mail className="h-4 w-4" />
                )}
                {isSending ? "Sending Email..." : "Email Statement"}
              </Button>

              <Button
                onClick={handlePrintPDF}
                disabled={!fromDate || !toDate || isDownloading}
                variant="outline"
                className="w-full h-11 px-6 rounded-xl shadow-sm active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                {isDownloading ? (
                  <Loader className="h-4 w-4 animate-spin" />
                ) : (
                  <Download className="h-4 w-4" />
                )}
                {isDownloading ? "Preparing PDF..." : "Download PDF"}
              </Button>
            </div>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default GenerateReportDrawer;
