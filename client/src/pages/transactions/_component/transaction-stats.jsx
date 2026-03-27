import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useSummaryAnalyticsQuery } from "@/features/analytics/analyticsAPI";
import { formatCurrency } from "@/lib/format-currency";
import { TrendingUp, TrendingDown, Wallet, Receipt, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

const TransactionStats = ({ filters, dark = false }) => {
  const { data, isFetching } = useSummaryAnalyticsQuery({
    preset: "allTime",
  });

  const stats = data?.data;

  if (data) {
      console.log("TransactionStats: Received stats data:", stats);
  }

  if (isFetching) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className={cn("border shadow-none", dark && "bg-white/5 border-white/10")}>
            <CardContent className="pt-4 pb-3">
              <Skeleton className={cn("h-4 w-24 mb-4", dark && "bg-white/10")} />
              <Skeleton className={cn("h-8 w-32", dark && "bg-white/10")} />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const statItems = [
    {
      label: "Total income",
      value: stats?.totalIncome || 0,
      icon: TrendingUp,
      iconColor: dark ? "text-white/70" : "text-green-500",
      valueColor: dark ? "text-white" : "text-green-600",
      isCurrency: true,
    },
    {
      label: "Total expenses",
      value: stats?.totalExpenses || 0,
      icon: TrendingDown,
      iconColor: dark ? "text-white/70" : "text-red-500",
      valueColor: dark ? "text-white" : "text-red-600",
      isCurrency: true,
    },
    {
      label: "Net balance",
      value: stats?.availableBalance || 0,
      icon: Wallet,
      iconColor: dark ? "text-white/70" : "text-blue-500",
      valueColor: dark 
        ? "text-white" 
        : (stats?.availableBalance >= 0 ? "text-green-600" : "text-red-600"),
      isCurrency: true,
    },
    {
      label: "Total transactions",
      value: stats?.transactionCount || 0,
      icon: Receipt,
      iconColor: dark ? "text-white/70" : "text-purple-500",
      valueColor: dark ? "text-white" : "text-foreground",
      isCurrency: false,
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {statItems.map((item, index) => (
        <Card 
          key={index} 
          className={cn(
            "border shadow-none transition-all duration-200", 
            dark ? "bg-white/5 border-white/10 hover:bg-white/10" : "hover:border-primary/20"
          )}
        >
          <CardContent className="pt-4 pb-3">
            <div className="flex items-center justify-between mb-2">
              <p className={cn("text-xs lg:text-sm font-medium", dark ? "text-gray-300" : "text-muted-foreground")}>
                {item.label}
              </p>
              <div className={cn(
                "w-8 h-8 rounded-lg flex items-center justify-center transition-colors",
                dark ? "bg-white/10 text-white/70" : "bg-muted"
              )}>
                <item.icon className={cn("h-4 w-4", item.iconColor)} />
              </div>
            </div>
            <p className={cn("text-xl lg:text-2xl font-bold tracking-tight", item.valueColor)}>
              {item.isCurrency ? formatCurrency(item.value) : item.value?.toLocaleString()}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default TransactionStats;
