import React from "react";
import { useGetAllTransactionsQuery } from "@/features/transaction/transactionAPI";
import { Receipt } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const TransactionStatsBar = () => {
  const { data, isFetching } = useGetAllTransactionsQuery({
    pageNumber: 1,
    pageSize: 1, // minimal payload — we only need totalCount from pagination
  });

  const totalCount = data?.pagination?.totalCount ?? 0;

  if (isFetching) {
    return (
      <div className="flex">
        <Skeleton className="h-24 w-56 bg-white/10 rounded-xl" />
      </div>
    );
  }

  return (
    <div className="flex">
      <div className="!border-none !gap-0 !bg-white/5 rounded-xl p-4 pr-8 transition-all hover:bg-white/10 flex items-center gap-4">
        <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
          <Receipt className="h-5 w-5 text-white/70" />
        </div>
        <div>
          <p className="text-[13px] text-gray-300 font-medium mb-1">
            Transactions
          </p>
          <p className="text-3xl font-bold text-white leading-none">
            {totalCount.toLocaleString()}
          </p>
          <p className="text-xs text-gray-400 mt-1">Total recorded</p>
        </div>
      </div>
    </div>
  );
};

export default TransactionStatsBar;
