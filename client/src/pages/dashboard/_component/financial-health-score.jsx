import React from "react";
import { cn } from "@/lib/utils";
import { useSummaryAnalyticsQuery } from "@/features/analytics/analyticsAPI";
import { useGetBudgetSummaryQuery, useGetAllBudgetsQuery } from "@/features/budget/budgetAPI";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { EmptyState } from "@/components/empty-state";

const computeHealthScore = (summaryData, budgetData) => {
  if (!summaryData) return null;

  const budgetSummary = budgetData?.summary;
  const totalBudgets = budgetData?.budgets?.length || 0;

  // FACTOR 1: Savings Rate (max 40 pts)
  const savingsRate = summaryData.savingRate.percentage;
  let savingsPoints = 0;
  let savingsStatus = "poor";
  if (savingsRate >= 30) {
    savingsPoints = 40;
    savingsStatus = "excellent";
  } else if (savingsRate >= 20) {
    savingsPoints = 30;
    savingsStatus = "good";
  } else if (savingsRate >= 10) {
    savingsPoints = 20;
    savingsStatus = "fair";
  } else if (savingsRate >= 0) {
    savingsPoints = 10;
    savingsStatus = "poor";
  }

  const savingsDesc =
    savingsRate < 0
      ? "Spending more than you earn"
      : `Saving ${savingsRate.toFixed(0)}% of income — ${savingsStatus}`;

  // FACTOR 2: Expense Ratio (max 25 pts)
  const expenseRatio = summaryData.savingRate.expenseRatio;
  let expensePoints = 0;
  let expenseStatus = "poor";
  if (expenseRatio <= 50) {
    expensePoints = 25;
    expenseStatus = "excellent";
  } else if (expenseRatio <= 65) {
    expensePoints = 18;
    expenseStatus = "good";
  } else if (expenseRatio <= 80) {
    expensePoints = 10;
    expenseStatus = "fair";
  } else if (expenseRatio <= 100) {
    expensePoints = 5;
    expenseStatus = "poor";
  }

  const expenseDesc =
    expenseRatio > 100
      ? "Expenses exceed income"
      : `Spending ${expenseRatio.toFixed(0)}% of income — ${
          expenseStatus === "excellent" || expenseStatus === "good"
            ? expenseStatus
            : "high"
        }`;

  // FACTOR 3: Budget Discipline (max 20 pts)
  let budgetPoints = 10; // Default neutral if no budgets
  let budgetStatus = "fair";
  let budgetDesc = "No budgets set yet";

  if (totalBudgets > 0) {
    const overLimit = budgetSummary?.budgetsOverLimit || 0;
    const overLimitRatio = overLimit / totalBudgets;

    if (overLimit === 0) {
      budgetPoints = 20;
      budgetStatus = "excellent";
      budgetDesc = "0 over limit — perfect";
    } else if (overLimitRatio <= 0.25) {
      budgetPoints = 15;
      budgetStatus = "good";
      budgetDesc = "Few categories over limit";
    } else if (overLimitRatio <= 0.50) {
      budgetPoints = 8;
      budgetStatus = "fair";
      budgetDesc = "Half categories over limit";
    } else {
      budgetPoints = 0;
      budgetStatus = "poor";
      budgetDesc = "Most categories over limit";
    }
  }

  // FACTOR 4: Activity Score (max 15 pts)
  const txCount = summaryData.transactionCount;
  let activityPoints = 0;
  let activityStatus = "poor";
  if (txCount >= 20) {
    activityPoints = 15;
    activityStatus = "excellent";
  } else if (txCount >= 10) {
    activityPoints = 10;
    activityStatus = "good";
  } else if (txCount >= 5) {
    activityPoints = 6;
    activityStatus = "fair";
  } else if (txCount >= 1) {
    activityPoints = 3;
    activityStatus = "poor";
  }

  const activityDesc =
    txCount >= 10
      ? "Active tracking"
      : txCount > 0
      ? "Minimal tracking"
      : "No activity logged";

  const totalScore =
    savingsPoints + expensePoints + budgetPoints + activityPoints;

  let label = "Critical";
  let color = "#ef4444"; // red-500
  if (totalScore >= 80) {
    label = "Excellent";
    color = "#22c55e";
  } else if (totalScore >= 60) {
    label = "Good";
    color = "#84cc16";
  } else if (totalScore >= 40) {
    label = "Fair";
    color = "#f59e0b";
  } else if (totalScore >= 20) {
    label = "Needs work";
    color = "#f97316";
  }

  return {
    score: totalScore,
    label,
    color,
    factors: [
      {
        name: "Savings rate",
        points: savingsPoints,
        maxPoints: 40,
        description: savingsDesc,
        status: savingsStatus,
      },
      {
        name: "Expense ratio",
        points: expensePoints,
        maxPoints: 25,
        description: expenseDesc,
        status: expenseStatus,
      },
      {
        name: "Budget discipline",
        points: budgetPoints,
        maxPoints: 20,
        description: budgetDesc,
        status: budgetStatus,
      },
      {
        name: "Activity score",
        points: activityPoints,
        maxPoints: 15,
        description: activityDesc,
        status: activityStatus,
      },
    ],
  };
};

const getTip = (factorName) => {
  const tips = {
    "Savings rate":
      "Try to save at least 20% of your income each month for long-term financial health.",
    "Expense ratio":
      "Keep your expenses below 80% of income to maintain a healthy balance.",
    "Budget discipline":
      "Set budgets for your top spending categories and try not to exceed them.",
    "Activity score":
      "Log at least 10 transactions per month for better financial tracking.",
  };
  return tips[factorName] || "Keep tracking your finances to improve your score!";
};

const FinancialHealthScore = ({ dateRange }) => {
  const { data: summaryResponse, isFetching: isSummaryLoading } =
    useSummaryAnalyticsQuery({ preset: dateRange?.value }, { skip: !dateRange });

  const { data: budgetResponse, isFetching: isBudgetLoading } =
    useGetAllBudgetsQuery({
      month: new Date().getMonth() + 1,
      year: new Date().getFullYear(),
    });

  const isLoading = isSummaryLoading || isBudgetLoading;
  const summaryData = summaryResponse?.data;
  const budgetData = budgetResponse;

  if (isLoading) {
    return (
      <Card className="!shadow-none border border-gray-100 dark:border-border">
        <CardHeader>
          <Skeleton className="h-6 w-1/3" />
          <Skeleton className="h-4 w-1/2 mt-2" />
        </CardHeader>
        <CardContent className="flex flex-col items-center space-y-6">
          <Skeleton className="w-32 h-32 rounded-full" />
          <div className="w-full space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!summaryData) {
    return (
      <Card className="!shadow-none border border-gray-100 dark:border-border">
        <CardContent className="pt-6">
          <EmptyState
            title="No data yet"
            description="Add transactions to see your financial health score"
          />
        </CardContent>
      </Card>
    );
  }

  const healthData = computeHealthScore(summaryData, budgetData);
  if (!healthData) return null;

  const { score, label, color, factors } = healthData;
  const circumference = 2 * Math.PI * 54;
  const strokeDasharray = `${(score / 100) * circumference} ${circumference}`;

  const weakestFactor = factors.reduce((min, f) =>
    f.points / f.maxPoints < min.points / min.maxPoints ? f : min
  );

  const getStatusColor = (status) => {
    const colors = {
      excellent: "[&>div]:bg-green-500",
      good: "[&>div]:bg-lime-500",
      fair: "[&>div]:bg-amber-500",
      poor: "[&>div]:bg-red-500",
    };
    return colors[status] || "[&>div]:bg-gray-400";
  };

  return (
    <Card className="!shadow-none border border-gray-100 dark:border-border">
      <CardHeader>
        <CardTitle className="text-lg">Financial health score</CardTitle>
        <CardDescription>
          Based on your {dateRange?.label || "recent"} activity
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Score Circle */}
        <div className="flex flex-col items-center mb-8">
          <svg width="140" height="140" viewBox="0 0 140 140">
            <circle
              cx="70"
              cy="70"
              r="54"
              fill="none"
              stroke="#e5e7eb"
              strokeWidth="10"
            />
            <circle
              cx="70"
              cy="70"
              r="54"
              fill="none"
              stroke={color}
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray={strokeDasharray}
              strokeDashoffset={circumference * 0.25}
              style={{ transition: "stroke-dasharray 1s ease-in-out" }}
            />
            <text
              x="70"
              y="62"
              textAnchor="middle"
              fontSize="28"
              fontWeight="700"
              fill={color}
            >
              {score}
            </text>
            <text x="70" y="80" textAnchor="middle" fontSize="11" fill="#6b7280">
              out of 100
            </text>
          </svg>
          <p
            style={{ color }}
            className="text-xl font-semibold text-center mt-1"
          >
            {label}
          </p>
        </div>

        {/* Factors Breakdown */}
        <div className="space-y-4">
          {factors.map((factor, index) => (
            <div
              key={index}
              className="flex flex-col py-2 border-b border-gray-100 dark:border-border last:border-0"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium">{factor.name}</span>
                <span className="text-sm text-muted-foreground">
                  {factor.points}/{factor.maxPoints}
                </span>
              </div>
              <div className="text-xs text-muted-foreground mb-1.5">
                {factor.description}
              </div>
              <Progress
                value={(factor.points / factor.maxPoints) * 100}
                className={cn("h-1.5", getStatusColor(factor.status))}
              />
            </div>
          ))}
        </div>

        {/* Bottom Tip */}
        <div className="mt-6 p-3 rounded-lg bg-muted text-xs text-muted-foreground">
          Tip: {getTip(weakestFactor.name)}
        </div>
      </CardContent>
    </Card>
  );
};

export default FinancialHealthScore;
