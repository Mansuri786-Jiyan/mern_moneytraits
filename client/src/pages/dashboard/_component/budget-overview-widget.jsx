import React from "react";
import { Link } from "react-router-dom";
import { formatCurrency } from "@/lib/format-currency";
import { PROTECTED_ROUTES } from "@/routes/common/routePath";
import { useGetAllBudgetsQuery, useGetBudgetSummaryQuery } from "@/features/budget/budgetAPI";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardAction,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

const BudgetOverviewWidget = () => {
  const currentDate = new Date();
  const month = currentDate.getMonth() + 1;
  const year = currentDate.getFullYear();

  const { data: budgetsData, isLoading: isLoadingBudgets } = useGetAllBudgetsQuery({ month, year });
  const { data: summaryData, isLoading: isLoadingSummary } = useGetBudgetSummaryQuery();

  const budgets = budgetsData?.budgets || [];
  const summary = budgetsData?.summary || summaryData?.data?.summary || { totalBudgeted: 0 };

  if (isLoadingBudgets || isLoadingSummary) {
    return (
      <Card className="!shadow-none border-gray-100 dark:border-border">
        <CardHeader>
          <Skeleton className="h-6 w-1/3" />
          <Skeleton className="h-4 w-1/2 mt-2" />
        </CardHeader>
        <CardContent className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-10 w-full" />
          ))}
        </CardContent>
      </Card>
    );
  }

  if (budgets.length === 0) return null;

  const topBudgets = [...budgets]
    .sort((a, b) => b.percentage - a.percentage)
    .slice(0, 3);

  const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

  const getProgressColor = (pct) => {
    if (pct >= 100) return "[&>div]:bg-red-500";
    if (pct >= 80) return "[&>div]:bg-amber-500";
    return "[&>div]:bg-primary";
  };

  const getPercentageColor = (pct) => {
    if (pct >= 100) return "text-red-500";
    if (pct >= 80) return "text-amber-500";
    return "text-primary";
  };

  return (
    <Card className="!shadow-none border-gray-100 dark:border-border">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-lg">Budget overview</CardTitle>
          <CardDescription>This month's top spending categories</CardDescription>
        </div>
        <CardAction>
          <Link
            to={PROTECTED_ROUTES.BUDGET}
            className="text-sm text-primary hover:underline"
          >
            View all
          </Link>
        </CardAction>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          {topBudgets.map((budget) => (
            <div key={budget._id} className="space-y-1">
              <div className="flex justify-between items-center text-sm">
                <span className="font-medium">{capitalize(budget.category)}</span>
                <span className={cn("font-bold", getPercentageColor(budget.percentage))}>
                  {budget.percentage}%
                </span>
              </div>
              <Progress 
                value={budget.percentage} 
                className={cn("h-2", getProgressColor(budget.percentage))} 
              />
            </div>
          ))}
        </div>
        <Separator />
        <div className="flex justify-between items-center pt-1">
          <span className="text-xs text-muted-foreground">Total budgeted</span>
          <span className="text-xs font-medium">{formatCurrency(summary.totalBudgeted)}</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default BudgetOverviewWidget;
