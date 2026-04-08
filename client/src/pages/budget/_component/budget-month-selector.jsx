import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const BudgetMonthSelector = ({ month, year, onChange }) => {
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 4 }, (_, i) => currentYear - 2 + i);

  const handleMonthChange = (val) => {
    onChange({ month: parseInt(val), year });
  };

  const handleYearChange = (val) => {
    onChange({ month, year: parseInt(val) });
  };

  const selectTriggerClass =
    "!bg-white/10 border-gray-600 !text-white h-9 min-w-[130px]";

  return (
    <div className="flex items-center gap-2 mt-4">
      <Select value={month.toString()} onValueChange={handleMonthChange}>
        <SelectTrigger className={selectTriggerClass}>
          <SelectValue placeholder="Month" />
        </SelectTrigger>
        <SelectContent>
          {months.map((name, index) => (
            <SelectItem key={index + 1} value={(index + 1).toString()}>
              {name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={year.toString()} onValueChange={handleYearChange}>
        <SelectTrigger className={selectTriggerClass}>
          <SelectValue placeholder="Year" />
        </SelectTrigger>
        <SelectContent>
          {years.map((y) => (
            <SelectItem key={y} value={y.toString()}>
              {y}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default BudgetMonthSelector;
