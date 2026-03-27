import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, Printer, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { useSelector } from "react-redux";

const ExportButtons = ({ filters }) => {
  const [isExporting, setIsExporting] = useState(false);
  const { accessToken } = useSelector((state) => state.auth);

  const handleExportCSV = async () => {
    try {
      setIsExporting(true);
      
      const queryParams = new URLSearchParams();
      if (filters.keyword) queryParams.append("keyword", filters.keyword);
      if (filters.type) queryParams.append("type", filters.type);
      if (filters.recurringStatus) queryParams.append("recurringStatus", filters.recurringStatus);

      const response = await fetch(`${import.meta.env.VITE_API_URL}/transaction/export-all?${queryParams.toString()}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) throw new Error("Failed to fetch transactions for export");

      const result = await response.json();
      const transactions = result.data?.transactions || [];

      if (transactions.length === 0) {
        toast.info("No transactions found to export");
        return;
      }

      // Build CSV
      const headers = ["Date", "Title", "Category", "Type", "Amount (INR)", "Payment Method", "Recurring", "Description"];
      const rows = transactions.map(tx => [
        format(new Date(tx.date), "MMM dd yyyy"),
        `"${tx.title?.replace(/"/g, '""')}"`,
        tx.category,
        tx.type,
        tx.amount.toFixed(2),
        tx.paymentMethod || "",
        tx.isRecurring ? "Yes" : "No",
        `"${(tx.description || "").replace(/"/g, '""')}"`
      ]);

      const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
      
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `moneytraits-transactions-${format(new Date(), "yyyy-MM-dd")}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success("CSV exported successfully");
    } catch (error) {
      console.error("CSV Export Error:", error);
      toast.error("Failed to export transactions");
    } finally {
      setIsExporting(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={handleExportCSV}
        disabled={isExporting}
        className="!border-gray-500 !text-white !bg-transparent hover:!bg-white/10"
      >
        {isExporting ? (
          <Loader2 className="h-4 w-4 animate-spin mr-2" />
        ) : (
          <Download className="h-4 w-4 mr-2" />
        )}
        Export CSV
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={handlePrint}
        className="!border-gray-500 !text-white !bg-transparent hover:!bg-white/10"
      >
        <Printer className="h-4 w-4 mr-2" />
        Print
      </Button>
    </div>
  );
};

export default ExportButtons;
