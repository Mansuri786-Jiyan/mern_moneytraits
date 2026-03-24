import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from "react";
import { Label, Pie, PieChart, Cell } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, } from "@/components/ui/card";
import { ChartContainer, ChartLegend, ChartTooltip, ChartTooltipContent, } from "@/components/ui/chart";
import { formatCurrency } from "@/lib/format-currency";
import { Skeleton } from "@/components/ui/skeleton";
import { formatPercentage } from "@/lib/format-percentage";
import { EmptyState } from "@/components/empty-state";
import { useExpensePieChartBreakdownQuery } from "@/features/analytics/analyticsAPI";
const COLORS = [
    "var(--color-chart-1)",
    "var(--color-chart-2)",
    "var(--color-chart-3)",
    "var(--color-chart-4)",
];
// Create chart config for shadcn UI chart
const chartConfig = {
    amount: {
        label: "Amount",
    },
};
const ExpensePieChart = (props) => {
    const { dateRange } = props;
    const { data, isFetching } = useExpensePieChartBreakdownQuery({
        preset: dateRange?.value,
    });
    const categories = data?.data?.breakdown || [];
    const totalSpent = data?.data?.totalSpent || 0;
    if (isFetching) {
        return _jsx(PieChartSkeleton, {});
    }
    // Custom legend component
    const CustomLegend = () => {
        return (_jsx("div", { className: "grid grid-cols-1 gap-x-4 gap-y-2 mt-4", children: categories.map((entry, index) => (_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("div", { className: "h-3 w-3 rounded-full", style: { backgroundColor: COLORS[index % COLORS.length] } }), _jsxs("div", { className: "flex justify-between w-full", children: [_jsx("span", { className: "text-xs font-medium truncate capitalize", children: entry.name }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("span", { className: "text-xs text-muted-foreground whitespace-nowrap", children: formatCurrency(entry.value) }), _jsxs("span", { className: "text-xs text-muted-foreground/60", children: ["(", formatPercentage(entry.percentage, { decimalPlaces: 0 }), ")"] })] })] })] }, `legend-${index}`))) }));
    };
    return (_jsxs(Card, {
        className: "!shadow-none border-1 border-gray-100 dark:border-border", children: [_jsxs(CardHeader, { className: "pb-2", children: [_jsx(CardTitle, { className: "text-lg", children: "Expenses Breakdown" }), _jsxs(CardDescription, { children: ["Total expenses ", dateRange?.label] })] }), _jsx(CardContent, {
            className: "h-[313px]", children: _jsx("div", {
                className: " w-full", children: categories?.length === 0 ? (_jsx(EmptyState, { title: "No expenses found", description: "There are no expenses recorded for this period." })) : (_jsx(ChartContainer, {
                    config: chartConfig, className: "mx-auto aspect-square h-[300px]", children: _jsxs(PieChart, {
                        children: [_jsx(ChartTooltip, { cursor: false, content: _jsx(ChartTooltipContent, {}) }), _jsxs(Pie, {
                            data: categories, dataKey: "value", nameKey: "name", innerRadius: 60, outerRadius: 80, paddingAngle: 2, strokeWidth: 2, stroke: "#fff", children: [categories.map((_, index) => (_jsx(Cell, { fill: COLORS[index % COLORS.length] }, `cell-${index}`))), _jsx(Label, {
                                content: ({ viewBox }) => {
                                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                                        return (_jsxs("text", { x: viewBox.cx, y: viewBox.cy, textAnchor: "middle", dominantBaseline: "middle", children: [_jsxs("tspan", { x: viewBox.cx, y: viewBox.cy, className: "fill-foreground text-2xl font-bold", children: ["$", totalSpent.toLocaleString()] }), _jsx("tspan", { x: viewBox.cx, y: (viewBox.cy || 0) + 20, className: "fill-muted-foreground text-xs", children: "Total Spent" })] }));
                                    }
                                }
                            })]
                        }), _jsx(ChartLegend, { content: _jsx(CustomLegend, {}) })]
                    })
                }))
            })
        })]
    }));
};
const PieChartSkeleton = () => (_jsxs(Card, { className: "!shadow-none border-1 border-gray-100 dark:border-border", children: [_jsxs(CardHeader, { className: "pb-2", children: [_jsx(Skeleton, { className: "h-6 w-48" }), _jsx(Skeleton, { className: "h-4 w-32 mt-1" })] }), _jsxs(CardContent, { className: "h-[313px]", children: [_jsx("div", { className: "w-full flex items-center justify-center", children: _jsxs("div", { className: "relative w-[200px] h-[200px]", children: [_jsx(Skeleton, { className: "rounded-full w-full h-full" }), _jsxs("div", { className: "absolute inset-0 flex flex-col items-center justify-center", children: [_jsx(Skeleton, { className: "h-8 w-24 mb-2" }), _jsx(Skeleton, { className: "h-4 w-16" })] })] }) }), _jsx("div", { className: "mt-0 space-y-2", children: [1, 2, 3, 4].map((i) => (_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Skeleton, { className: "h-3 w-3 rounded-full" }), _jsx(Skeleton, { className: "h-4 w-20" })] }), _jsx(Skeleton, { className: "h-4 w-12" })] }, i))) })] })] }));
export default ExpensePieChart;
