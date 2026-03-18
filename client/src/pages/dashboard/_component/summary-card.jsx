import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import CountUp from "react-countup";
import { TrendingDownIcon, TrendingUpIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/format-currency";
import { formatPercentage } from "@/lib/format-percentage";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { DateRangeEnum } from "@/components/date-range-select";
const getCardStatus = (value, cardType, expenseRatio) => {
    if (cardType === "savings") {
        if (value === 0) {
            return {
                label: "No Savings Record",
                color: "text-gray-400",
                Icon: TrendingDownIcon,
            };
        }
        // Check savings percentage first
        if (value < 10) {
            return {
                label: "Low Savings",
                color: "text-red-400",
                Icon: TrendingDownIcon,
                description: `Only ${value.toFixed(1)}% saved`,
            };
        }
        if (value < 20) {
            return {
                label: "Moderate",
                color: "text-yellow-400",
                Icon: TrendingDownIcon,
                description: `${expenseRatio?.toFixed(0)}% spent`,
            };
        }
        // High savings → check if expense ratio is unusually high for warning
        if (expenseRatio && expenseRatio > 75) {
            return {
                label: "High Spend",
                color: "text-red-400",
                Icon: TrendingDownIcon,
                description: `${expenseRatio.toFixed(0)}% spent`,
            };
        }
        if (expenseRatio && expenseRatio > 60) {
            return {
                label: "Warning: High Spend",
                color: "text-orange-400",
                Icon: TrendingDownIcon,
                description: `${expenseRatio.toFixed(0)}% spent`,
            };
        }
        return {
            label: "Good Savings",
            color: "text-green-400",
            Icon: TrendingUpIcon,
        };
    }
    if (value === 0) {
        const typeLabel = cardType === "income"
            ? "Income"
            : cardType === "expenses"
                ? "Expenses"
                : "Balance";
        return {
            label: `No ${typeLabel}`,
            color: "text-gray-400",
            Icon: TrendingDownIcon,
            description: ``,
        };
    }
    // For balance card when negative
    if (cardType === "balance" && value < 0) {
        return {
            label: "Overdrawn",
            color: "text-red-400",
            Icon: TrendingDownIcon,
            description: "Balance is negative",
        };
    }
    return {
        label: "",
        color: "",
        Icon: TrendingDownIcon,
    };
};
const getTrendDirection = (value, cardType) => {
    if (cardType === "expenses") {
        // For expenses, lower is better
        return value <= 0 ? "positive" : "negative";
    }
    // For income and balance, higher is better
    return value >= 0 ? "positive" : "negative";
};
const SummaryCard = ({ title, value = 0, dateRange, percentageChange, isPercentageValue, isLoading, expenseRatio, cardType = "balance", }) => {
    const status = getCardStatus(value, cardType, expenseRatio);
    const showTrend = percentageChange !== undefined &&
        percentageChange !== null &&
        cardType !== "savings";
    const trendDirection = showTrend && percentageChange !== 0
        ? getTrendDirection(percentageChange, cardType)
        : null;
    if (isLoading) {
        return (_jsxs(Card, { className: "!border-none !border-0 !gap-0 !bg-white/5", children: [_jsx(CardHeader, { className: "flex flex-row items-center justify-between space-y-0 !pb-5", children: _jsx(Skeleton, { className: "h-4 w-24 bg-white/30" }) }), _jsxs(CardContent, { className: "space-y-8", children: [_jsx(Skeleton, { className: "h-10.5 w-full bg-white/30" }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Skeleton, { className: "h-3 w-12 bg-white/30" }), _jsx(Skeleton, { className: "h-3 w-16 bg-white/30" })] })] })] }));
    }
    const formatCountupValue = (val) => {
        return isPercentageValue
            ? formatPercentage(val, { decimalPlaces: 1 })
            : formatCurrency(val, {
                isExpense: cardType === "expenses",
                showSign: cardType === "balance" && val < 0,
            });
    };
    return (_jsxs(Card, { className: "!border-none !border-0 !gap-0 !bg-white/5", children: [_jsx(CardHeader, { className: "flex flex-row items-center justify-between space-y-0 !pb-5", children: _jsx(CardTitle, { className: "text-[15px] text-gray-300 font-medium", children: title }) }), _jsxs(CardContent, { className: "space-y-5", children: [_jsx("div", { className: cn("text-4xl font-bold", cardType === "balance" && value < 0 ? "text-red-400" : "text-white"), children: _jsx(CountUp, { start: 0, end: value, preserveValue: true, decimals: 2, decimalPlaces: 2, formattingFn: formatCountupValue }) }), _jsx("div", { className: "text-sm text-muted-foreground mt-2", children: cardType === "savings" ? (_jsxs("div", { className: "flex items-center gap-1.5", children: [_jsx(status.Icon, { className: cn("size-3.5", status.color) }), _jsxs("span", { className: status.color, children: [status.label, " ", value !== 0 && `(${formatPercentage(value)})`] }), status.description && (_jsxs("span", { className: "text-gray-400 ml-1", children: ["\u2022 ", status.description] }))] })) : dateRange?.value === DateRangeEnum.ALL_TIME ? (_jsxs("span", { className: "text-gray-400", children: ["Showing ", dateRange?.label] })) : value === 0 || status.label ? (_jsxs("div", { className: "flex items-center gap-1.5", children: [_jsx(status.Icon, { className: cn("size-3.5", status.color) }), _jsx("span", { className: status.color, children: status.label }), status.description && (_jsxs("span", { className: "text-gray-400", children: ["\u2022 ", status.description] })), !status.description && (_jsxs("span", { className: "text-gray-400", children: ["\u2022 ", dateRange?.label] }))] })) : showTrend ? (_jsxs("div", { className: "flex items-center gap-1.5", children: [percentageChange !== 0 && (_jsxs("div", { className: cn("flex items-center gap-0.5", trendDirection === "positive"
                                        ? "text-green-500"
                                        : "text-red-500"), children: [trendDirection === "positive" ? (_jsx(TrendingUpIcon, { className: "size-3" })) : (_jsx(TrendingDownIcon, { className: "size-3" })), _jsx("span", { children: formatPercentage(percentageChange || 0, {
                                                showSign: percentageChange !== 0,
                                                isExpense: cardType === "expenses",
                                                decimalPlaces: 1,
                                            }) })] })), percentageChange === 0 && (_jsxs("div", { className: "flex items-center gap-0.5 text-gray-400", children: [_jsx(TrendingDownIcon, { className: "size-3" }), _jsx("span", { children: formatPercentage(0, {
                                                showSign: false,
                                                decimalPlaces: 1,
                                            }) })] })), _jsxs("span", { className: "text-gray-400", children: ["\u2022 ", dateRange?.label] })] })) : null })] })] }));
};
export default SummaryCard;
