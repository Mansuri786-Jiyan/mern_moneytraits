import React from "react";
import { useGetForecastQuery } from "@/features/analytics/analyticsAPI";
import { formatCurrency } from "@/lib/format-currency";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardAction,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown, Minus, AlertTriangle } from "lucide-react";
import {
  Bar,
  Line,
  ComposedChart,
  CartesianGrid,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Cell,
  Tooltip,
} from "recharts";

const TrendIndicator = ({ trend }) => {
  switch (trend) {
    case "increase":
      return <TrendingUp className="w-4 h-4 text-red-500" />;
    case "decrease":
      return <TrendingDown className="w-4 h-4 text-green-500" />;
    case "stable":
      return <Minus className="w-4 h-4 text-gray-400" />;
    default:
      return null;
  }
};

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white dark:bg-card border border-border/60 p-3 rounded-xl shadow-xl backdrop-blur-md">
        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">
          {label}
        </p>
        <div className="flex items-center gap-2">
          <div
            className={cn(
              "w-2 h-2 rounded-full",
              data.isForecast ? "bg-[#8b5cf6]" : "bg-[#22c55e]"
            )}
          />
          <p className="text-sm font-bold">{formatCurrency(data.amount)}</p>
        </div>
        <p className="text-[10px] text-muted-foreground mt-1 font-medium">
          {data.isForecast ? "Predicted Spending" : "Actual Spending"}
        </p>
      </div>
    );
  }
  return null;
};

const SpendingForecast = () => {
  const { data: response, isFetching, error } = useGetForecastQuery();
  const forecastData = response?.data;
  const predictions = forecastData?.predictions || [];
  const monthlyHistory = forecastData?.monthlyHistory || [];

  // Prepare chart data: Ensure at least 3-6 months, fill 0s, oldest first
  const sortedHistory = [...monthlyHistory].sort(
    (a, b) => new Date(a.month) - new Date(b.month)
  );

  const chartData = sortedHistory.map((h) => ({
    name: h.month.split(" ")[0], // Only month name
    fullName: h.month,
    amount: Object.values(h.categories).reduce((a, b) => a + Number(b), 0),
    isForecast: false,
  }));

  // Ensure minimum 3 months of history for visual balance if available
  // If we have history, add the forecast month
  if (forecastData?.totalPredicted > 0) {
    chartData.push({
      name: "Predicted",
      fullName: forecastData.forecastMonth,
      amount: forecastData.totalPredicted,
      isForecast: true,
    });
  }

  // Define colors
  const ACTUAL_COLOR = "#22c55e"; // Green
  const FORECAST_COLOR = "#8b5cf6"; // Purple

  if (isFetching) {
    return (
      <Card className="!shadow-none border-1 border-gray-100 dark:border-border">
        <CardHeader>
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-64 mt-2" />
        </CardHeader>
        <CardContent className="space-y-6">
          <Skeleton className="h-[220px] w-full rounded-2xl" />
          <div className="grid grid-cols-2 gap-3">
            <Skeleton className="h-20 w-full rounded-xl" />
            <Skeleton className="h-20 w-full rounded-xl" />
          </div>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-12 w-full rounded-xl" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error || !forecastData || predictions.length === 0) {
    return (
      <Card className="!shadow-none border-1 border-gray-100 dark:border-border">
        <CardHeader>
          <CardTitle className="text-lg">AI spending forecast</CardTitle>
          <CardDescription>Predicted expenses for next month</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-muted-foreground text-sm">
              Limited data available. Add more transactions for better
              predictions.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const diff = forecastData.totalPredicted - forecastData.lastMonthActual;

  return (
    <Card className="!shadow-none border-1 border-gray-100 dark:border-border font-sans overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between pb-0">
        <div>
          <CardTitle className="text-lg">AI spending forecast</CardTitle>
          <CardDescription>
            Predicted expenses for {forecastData.forecastMonth}
          </CardDescription>
        </div>
        <CardAction>
          <Badge className="text-[10px] bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400 px-2 py-0.5 rounded-full border border-purple-100 dark:border-purple-800/40">
            Premium Insight
          </Badge>
        </CardAction>
      </CardHeader>

      <CardContent className="space-y-6 pt-6">
        {/* Premium Chart */}
        <div className="space-y-2">
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest pl-1">
            Spending Trend (Past vs Forecast)
          </p>
          <div className="h-[220px] w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart
                data={chartData}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="0%"
                      stopColor="var(--primary)"
                      stopOpacity={0.8}
                    />
                    <stop
                      offset="100%"
                      stopColor="var(--primary)"
                      stopOpacity={0.2}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="var(--border)"
                  opacity={0.3}
                />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  fontSize={10}
                  fontWeight={600}
                  tickMargin={12}
                  className="fill-muted-foreground"
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  fontSize={10}
                  tickFormatter={(val) => `₹${val / 1000}k`}
                  className="fill-muted-foreground"
                />
                <Tooltip
                  content={<CustomTooltip />}
                  cursor={{ fill: "var(--muted)", opacity: 0.1 }}
                />

                <Bar
                  dataKey="amount"
                  barSize={35}
                  radius={[6, 6, 0, 0]}
                  animationDuration={1500}
                >
                  {chartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.isForecast ? FORECAST_COLOR : ACTUAL_COLOR}
                      fillOpacity={entry.isForecast ? 0.8 : 0.7}
                    />
                  ))}
                </Bar>

                <Line
                  type="monotone"
                  dataKey="amount"
                  stroke="var(--primary)"
                  strokeWidth={2.5}
                  dot={{ r: 4, strokeWidth: 2, fill: "var(--background)" }}
                  activeDot={{ r: 6, strokeWidth: 2, fill: "var(--primary)" }}
                  animationDuration={2000}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="p-4 rounded-2xl bg-muted/20 border border-border/30 group hover:border-primary/30 transition-all duration-300">
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold opacity-70">
              Predicted Total
            </p>
            <p className="text-2xl font-black text-foreground mt-1 group-hover:scale-105 transition-transform origin-left">
              {formatCurrency(forecastData.totalPredicted)}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-muted/20 border border-border/30 group hover:border-primary/30 transition-all duration-300">
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold opacity-70">
              vs Last Month
            </p>
            <div className="flex items-center gap-2 mt-1 group-hover:scale-105 transition-transform origin-left">
              <TrendIndicator
                trend={
                  diff > 0 ? "increase" : diff < 0 ? "decrease" : "stable"
                }
              />
              <p
                className={cn(
                  "text-2xl font-black",
                  diff > 0
                    ? "text-red-500"
                    : diff < 0
                    ? "text-green-500"
                    : "text-foreground"
                )}
              >
                {formatCurrency(Math.abs(diff))}
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-4 pt-2">
          <div className="flex items-center justify-between px-1">
            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest leading-none">
              Category Analysis
            </p>
            <div className="h-px flex-1 bg-border/40 mx-3" />
          </div>

          <div className="grid grid-cols-1 gap-1">
            {predictions.map((p) => {
              const isOverBudget = p.budgetLimit && p.predicted > p.budgetLimit;

              return (
                <div
                  key={p.category}
                  className="group p-4 rounded-2xl hover:bg-muted/40 transition-all duration-300 border border-transparent hover:border-border/60"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-muted flex items-center justify-center text-lg shadow-sm group-hover:scale-110 transition-transform">
                        {p.category === "food"
                          ? "🍔"
                          : p.category === "groceries"
                          ? "🛒"
                          : p.category === "transportation"
                          ? "🚗"
                          : "📦"}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-bold capitalize leading-none mb-1">
                          {p.category}
                        </span>
                        <div className="flex items-center gap-1.5 opacity-70">
                          <TrendIndicator trend={p.trend} />
                          <span className="text-[9px] font-black tracking-tighter uppercase whitespace-nowrap">
                            {p.confidence}% confidence
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-black leading-none mb-1">
                        {formatCurrency(p.predicted)}
                      </p>
                      {isOverBudget ? (
                        <span className="text-[9px] text-red-500 font-bold flex items-center justify-end gap-0.5 animate-pulse">
                          <AlertTriangle className="w-2.5 h-2.5" />
                          RISK
                        </span>
                      ) : (
                        <span className="text-[9px] text-green-500 font-bold uppercase tracking-widest opacity-60 group-hover:opacity-100 transition-opacity">
                          On track
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="relative h-1.5 bg-muted/60 rounded-full overflow-hidden mb-3">
                    <div
                      className={cn(
                        "absolute left-0 top-0 h-full rounded-full transition-all duration-1000",
                        isOverBudget ? "bg-red-500" : "bg-primary"
                      )}
                      style={{
                        width: `${Math.min(
                          100,
                          (p.predicted / forecastData.totalPredicted) * 100
                        )}%`,
                      }}
                    />
                  </div>

                  <p className="text-[11px] text-muted-foreground/80 leading-relaxed font-medium group-hover:text-foreground/90 transition-colors">
                    {p.reasoning}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="p-4 bg-muted/20 rounded-2xl border border-border/40">
          <p className="text-[10px] text-center text-muted-foreground font-medium leading-relaxed italic">
            "This AI forecast predicts your spending based on 6 months of
            historical behavior. The purple bar represents the upcoming month's
            projection."
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default SpendingForecast;
