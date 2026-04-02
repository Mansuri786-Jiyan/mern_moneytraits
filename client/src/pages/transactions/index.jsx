import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import PageLayout from "@/components/page-layout";
import AddTransactionDrawer from "@/components/transaction/add-transaction-drawer";
import PremiumTransactionTable from "@/components/transaction/premium-transaction-table/index.jsx";
import ImportTransactionModal from "@/components/transaction/import-transaction-modal";

import GenerateReportDrawer from "./_components/generate-report-drawer";
import ReportHistorySection from "./_components/report-history-section";
import ExportButtons from "./_component/export-buttons";
import { cn } from "@/lib/utils";

export default function Transactions() {
  const [activeTab, setActiveTab] = useState("transactions");
  const [filters, setFilters] = useState({
    keyword: "",
    type: undefined,
    recurringStatus: undefined,
  });

  return (
    <PageLayout
      addMarginTop={true}
      renderPageHeader={
        <div className="w-full max-w-[var(--max-width)] mx-auto pb-6 px-4 lg:px-0">
          <div className="flex flex-col lg:flex-row items-start justify-between gap-6 mb-8">
            <div className="space-y-1">
              <h2 className="text-2xl lg:text-4xl font-bold tracking-tight text-white">
                Transactions
              </h2>
              <p className="text-white/60 text-sm lg:text-base">
                Manage your financial activity and generate insights
              </p>
            </div>
            <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
              <GenerateReportDrawer />
              <ImportTransactionModal />
              <AddTransactionDrawer />
            </div>
          </div>


          <div className="flex gap-1 mt-8 bg-white/10 p-1 rounded-xl w-fit">
            <button
              onClick={() => setActiveTab("transactions")}
              className={cn(
                "px-6 py-2 rounded-lg text-sm font-semibold transition-all duration-200",
                activeTab === "transactions"
                  ? "bg-white text-gray-900 shadow-lg"
                  : "text-white/60 hover:text-white hover:bg-white/5"
              )}
            >
              Transactions
            </button>
            <button
              onClick={() => setActiveTab("reports")}
              className={cn(
                "px-6 py-2 rounded-lg text-sm font-semibold transition-all duration-200",
                activeTab === "reports"
                  ? "bg-white text-gray-900 shadow-lg"
                  : "text-white/60 hover:text-white hover:bg-white/5"
              )}
            >
              Reports
            </button>
          </div>
        </div>
      }
    >
      {activeTab === "transactions" ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between px-4 sm:px-0 pt-4">
            <h3 className="text-lg font-bold text-white/90">Transaction History</h3>
            <ExportButtons filters={filters} />
          </div>
          <div className="print-area">
            <PremiumTransactionTable 
              pageSize={20} 
              onFiltersChange={setFilters}
            />
          </div>
        </div>
      ) : (
        <Card className="border shadow-none mt-4 rounded-2xl overflow-hidden animate-in fade-in duration-500 bg-card text-card-foreground">
          <CardContent className="p-6">
            <ReportHistorySection />
          </CardContent>
        </Card>
      )}
    </PageLayout>
  );
}
