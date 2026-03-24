import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from "react";
import { format } from "date-fns";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import { useIsMobile } from "@/hooks/use-mobile";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, } from "@/components/ui/card";
import { ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent, } from "@/components/ui/chart";
import { EmptyState } from "@/components/empty-state";
import { TrendingUpIcon, TrendingDownIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency } from "@/lib/format-currency";
import { useChartAnalyticsQuery } from "@/features/analytics/analyticsAPI";
const COLORS = ["var(--primary)", "var(--color-destructive)"];
const TRANSACTION_TYPES = ["income", "expenses"];
const chartConfig = {
    income: {
        label: "Income",
        color: COLORS[0],
    },
    expenses: {
        label: "Expenses",
        color: COLORS[1],
    },
};
const DashboardDataChart = (props) => {
    const { dateRange } = props;
    const isMobile = useIsMobile();
    const { data, isFetching } = useChartAnalyticsQuery({
        preset: dateRange?.value,
    });
    const chartData = data?.data?.chartData || [];
    const totalExpenseCount = data?.data?.totalExpenseCount || 0;
    const totalIncomeCount = data?.data?.totalIncomeCount || 0;
    if (isFetching) {
        return _jsx(ChartSkeleton, {});
    }
    return (_jsxs(Card, {
        className: "!shadow-none border-1 border-gray-100 dark:border-border !pt-0", children: [_jsxs(CardHeader, {
            className: "flex flex-col items-stretch !space-y-0 border-b border-gray-100\r\n      dark:border-border !p-0 pr-1 sm:flex-row", children: [_jsxs("div", { className: "flex flex-1 flex-col justify-center gap-1 px-6 py-0 sm:py-0", children: [_jsx(CardTitle, { className: "text-lg", children: "Transaction Overview" }), _jsx(CardDescription, { children: _jsxs("span", { children: ["Showing total transactions ", dateRange?.label] }) })] }), _jsx("div", {
                className: "flex", children: TRANSACTION_TYPES.map((key) => {
                    const chart = key;
                    return (_jsxs("div", {
                        className: "flex flex-1 flex-col justify-center gap-1 px-6 py-4 text-center even:border-l \r\n                sm:border-l border-gray-100 dark:border-border sm:px-4 sm:py-6 min-w-36", children: [_jsxs("span", { className: "w-full block text-xs text-muted-foreground", children: ["No of ", chartConfig[chart].label] }), _jsxs("span", {
                            className: "flex items-center justify-center gap-2 text-lg font-semibold leading-none sm:text-3xl", children: [key === TRANSACTION_TYPES[0] ? (_jsx(TrendingUpIcon, { className: "size-3 ml-2 text-primary" })) : (_jsx(TrendingDownIcon, { className: "size-3 ml-2 text-destructive" })), key === TRANSACTION_TYPES[0]
                                ? totalIncomeCount
                                : totalExpenseCount]
                        })]
                    }, chart));
                })
            })]
        }), _jsx(CardContent, {
            className: "px-2 pt-2 sm:px-6 sm:pt-2 h-[300px]", children: chartData?.length === 0 ? (_jsx(EmptyState, { title: "No transaction data", description: "There are no transactions recorded for this period." })) : (_jsx(ChartContainer, {
                config: chartConfig, className: "aspect-auto h-[300px] w-full", children: _jsxs(AreaChart, {
                    data: chartData || [], children: [_jsxs("defs", { children: [_jsxs("linearGradient", { id: "incomeGradient", x1: "0", y1: "0", x2: "0", y2: "1", children: [_jsx("stop", { offset: "5%", stopColor: COLORS[0], stopOpacity: 1.0 }), _jsx("stop", { offset: "95%", stopColor: COLORS[0], stopOpacity: 0.1 })] }), _jsxs("linearGradient", { id: "expensesGradient", x1: "0", y1: "0", x2: "0", y2: "1", children: [_jsx("stop", { offset: "5%", stopColor: COLORS[1], stopOpacity: 0.8 }), _jsx("stop", { offset: "95%", stopColor: COLORS[1], stopOpacity: 0.1 })] })] }), _jsx(CartesianGrid, { strokeDasharray: "3 3" }), _jsx(XAxis, { dataKey: "date", tickLine: false, axisLine: false, tickMargin: 8, minTickGap: isMobile ? 20 : 25, tickFormatter: (value) => format(new Date(value), isMobile ? "MMM d" : "MMMM d, yyyy") }), _jsx(ChartTooltip, {
                        cursor: {
                            stroke: "#94a3b8",
                            strokeWidth: 1,
                            strokeDasharray: "3 3",
                        }, content: _jsx(ChartTooltipContent, {
                            labelFormatter: (value) => format(new Date(value), "MMM d, yyyy"), indicator: "line", formatter: (value, name) => {
                                const isExpense = name === "expenses";
                                const color = isExpense ? COLORS[1] : COLORS[0];
                                return [
                                    _jsx("span", {
                                        style: { color }, children: formatCurrency(Number(value), {
                                            showSign: true,
                                            compact: true,
                                            isExpense,
                                        })
                                    }, name),
                                    isExpense ? "Expenses" : "Income",
                                ];
                            }
                        })
                    }), _jsx(Area, { dataKey: "expenses", stackId: "1", type: "step", fill: "url(#expensesGradient)", stroke: COLORS[1], className: "drop-shadow-sm" }), _jsx(Area, { dataKey: "income", stackId: "1", type: "step", fill: "url(#incomeGradient)", stroke: COLORS[0] }), _jsx(ChartLegend, { verticalAlign: "bottom", content: _jsx(ChartLegendContent, {}) })]
                })
            }))
        })]
    }));
};
const ChartSkeleton = () => (_jsxs(Card, { className: "!shadow-none border-1 border-gray-100 dark:border-border !pt-0", children: [_jsxs(CardHeader, { className: "flex flex-col items-stretch !space-y-0 border-b border-gray-100 dark:border-border !p-0 pr-1 sm:flex-row", children: [_jsxs("div", { className: "flex flex-1 flex-col justify-center gap-1 px-6 py-0 sm:py-0", children: [_jsx(Skeleton, { className: "h-6 w-48" }), _jsx(Skeleton, { className: "h-4 w-32 mt-1" })] }), _jsx("div", { className: "flex", children: [1, 2].map((i) => (_jsxs("div", { className: "flex flex-1 flex-col justify-center gap-1 px-6 py-4 text-center even:border-l \r\n            sm:border-l border-gray-100 dark:border-border sm:px-4 sm:py-6 min-w-36", children: [_jsx(Skeleton, { className: "h-4 w-20 mx-auto" }), _jsx(Skeleton, { className: "h-8 w-24 mx-auto mt-1 sm:h-12" })] }, i))) })] }), _jsx(CardContent, { className: "px-2 pt-2 sm:px-6 sm:pt-2 h-[280px]", children: _jsx(Skeleton, { className: "h-full w-full" }) })] }));
export default DashboardDataChart;
