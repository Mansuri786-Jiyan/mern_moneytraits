import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { format, subDays, subMonths, subYears, startOfMonth, startOfYear, endOfDay, } from "date-fns";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger, } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { ChevronDownIcon } from "lucide-react";
export const DateRangeEnum = {
    LAST_30_DAYS: "30days",
    LAST_MONTH: "lastMonth",
    LAST_3_MONTHS: "last3Months",
    LAST_YEAR: "lastYear",
    THIS_MONTH: "thisMonth",
    THIS_YEAR: "thisYear",
    ALL_TIME: "allTime",
    CUSTOM: "custom",
};
const now = new Date();
const today = endOfDay(now);
const presets = [
    {
        label: "Last 30 Days",
        value: DateRangeEnum.LAST_30_DAYS,
        getRange: () => ({
            from: subDays(today, 29),
            to: today,
            value: DateRangeEnum.LAST_30_DAYS,
            label: "for Past 30 Days",
        }),
    },
    {
        label: "Last Month",
        value: DateRangeEnum.LAST_MONTH,
        getRange: () => ({
            from: startOfMonth(subMonths(today, 1)),
            to: startOfMonth(today),
            value: DateRangeEnum.LAST_MONTH,
            label: "for Last Month",
        }),
    },
    {
        label: "Last 3 Months",
        value: DateRangeEnum.LAST_3_MONTHS,
        getRange: () => ({
            from: startOfMonth(subMonths(today, 3)),
            to: startOfMonth(today),
            value: DateRangeEnum.LAST_3_MONTHS,
            label: "for Past 3 Months",
        }),
    },
    {
        label: "Last Year",
        value: DateRangeEnum.LAST_YEAR,
        getRange: () => ({
            from: startOfYear(subYears(today, 1)),
            to: startOfYear(today),
            value: DateRangeEnum.LAST_YEAR,
            label: "for Past Year",
        }),
    },
    {
        label: "This Month",
        value: DateRangeEnum.THIS_MONTH,
        getRange: () => ({
            from: startOfMonth(today),
            to: today,
            value: DateRangeEnum.THIS_MONTH,
            label: "for This Month",
        }),
    },
    {
        label: "This Year",
        value: DateRangeEnum.THIS_YEAR,
        getRange: () => ({
            from: startOfYear(today),
            to: today,
            value: DateRangeEnum.THIS_YEAR,
            label: "for This Year",
        }),
    },
    {
        label: "All Time",
        value: DateRangeEnum.ALL_TIME,
        getRange: () => ({
            from: null,
            to: null,
            value: DateRangeEnum.ALL_TIME,
            label: "across All Time",
        }),
    },
];
export const DateRangeSelect = ({ dateRange, setDateRange, defaultRange = DateRangeEnum.LAST_30_DAYS, }) => {
    const [open, setOpen] = useState(false);
    const displayText = dateRange
        ? presets.find((p) => p.value === dateRange.value)?.label ||
            (dateRange.from
                ? `${format(dateRange.from, "MMM dd, y")} - ${dateRange.to ? format(dateRange.to, "MMM dd, y") : "Present"}`
                : "Select a duration")
        : "Select a duration";
    // Set default range on initial render
    useEffect(() => {
        if (!dateRange) {
            const defaultPreset = presets.find((p) => p.value === defaultRange);
            if (defaultPreset) {
                setDateRange(defaultPreset.getRange());
            }
        }
    }, [dateRange, defaultRange, setDateRange]);
    return (_jsxs(Popover, { open: open, onOpenChange: setOpen, children: [_jsx(PopoverTrigger, { asChild: true, children: _jsxs(Button, { variant: "outline", className: cn(`w-[200px] flex items-center justify-between text-left font-normal !bg-[var(--secondary-dark-color)]
            border-gray-700 !text-white !cursor-pointer`, !dateRange && "text-muted-foreground"), children: [displayText, _jsx(ChevronDownIcon, { className: "ml-2 h-4 w-4 opacity-50" })] }) }), _jsx(PopoverContent, { className: "w-auto p-0", align: "start", children: _jsx("div", { className: "grid py-1", children: presets.map((preset) => (_jsx(Button, { variant: "ghost", className: cn("justify-start text-left", dateRange?.value === preset.value && "bg-accent"), onClick: () => {
                            setDateRange(preset.getRange());
                            setOpen(false);
                        }, children: preset.label }, preset.value))) }) })] }));
};
