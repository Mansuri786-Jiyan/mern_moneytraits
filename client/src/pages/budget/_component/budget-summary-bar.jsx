import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency } from "@/lib/format-currency";
import { cn } from "@/lib/utils";

const SummaryCard = ({
  title,
  value,
  isCurrency = true,
  isDestructive = false,
}) => (
  <Card className="!border-none !border-0 !gap-0 !bg-white/5">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 !pb-3">
      <CardTitle className="text-[15px] text-gray-300 font-medium">
        {title}
      </CardTitle>
    </CardHeader>
    <CardContent className="space-y-1">
      <div
        className={cn(
          "text-3xl font-bold text-white",
          isDestructive && "text-red-400"
        )}
      >
        {isCurrency ? formatCurrency(value) : value}
      </div>
      {!isCurrency && <p className="text-xs text-gray-400">categories</p>}
    </CardContent>
  </Card>
);

const BudgetSummaryBar = ({ summary, isLoading }) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-28 bg-white/5 border-0" />
        ))}
      </div>
    );
  }

  const { totalBudgeted, totalSpent, totalRemaining, budgetsOverLimit } =
    summary;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
      <SummaryCard title="Total budgeted" value={totalBudgeted} />
      <SummaryCard title="Total spent" value={totalSpent} />
      <SummaryCard title="Remaining" value={totalRemaining} />
      <SummaryCard
        title="Over budget"
        value={budgetsOverLimit}
        isCurrency={false}
        isDestructive={budgetsOverLimit > 0}
      />
    </div>
  );
};

export default BudgetSummaryBar;
