import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import PageLayout from "@/components/page-layout";
import AddTransactionDrawer from "@/components/transaction/add-transaction-drawer";
import TransactionTable from "@/components/transaction/transaction-table";
import ImportTransactionModal from "@/components/transaction/import-transaction-modal";
import TransactionStats from "./_component/transaction-stats";
import ExportButtons from "./_component/export-buttons";

import { useTypedSelector } from "@/app/hook";

export default function Transactions() {
  const { user } = useTypedSelector((state) => state.auth);
  console.log("Transactions Page: Active User:", user?.email);
  
  const [filters, setFilters] = useState({
    keyword: "",
    type: undefined,
    recurringStatus: undefined,
  });

  return (
    <PageLayout
      title="Transactions"
      subtitle="Manage and track all your transactions"
      addMarginTop={true}
      renderPageHeader={
        <div className="w-full max-w-[var(--max-width)] mx-auto pb-6">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
            <div className="space-y-1 text-center lg:text-left">
              <h2 className="text-2xl lg:text-4xl font-medium text-white">
                Transactions
              </h2>
              <p className="text-white/60 text-sm">
                Track and manage all your financial activity
              </p>
            </div>
            <div className="flex items-center gap-2 flex-wrap justify-center">
              <ExportButtons filters={filters} />
              <ImportTransactionModal />
              <AddTransactionDrawer />
            </div>
          </div>

          <div className="mt-8 no-print">
            <TransactionStats filters={filters} dark={true} />
          </div>
        </div>
      }
    >
      <Card className="border-0 shadow-none mt-4 bg-white">
        <CardContent className="pt-2">
          <div className="print-area">
            <TransactionTable 
              pageSize={20} 
              onFiltersChange={setFilters}
            />
          </div>
        </CardContent>
      </Card>
    </PageLayout>
  );
}
