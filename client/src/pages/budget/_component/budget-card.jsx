import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { MoreHorizontal, Pencil, Trash2, Loader } from "lucide-react";
import { formatCurrency } from "@/lib/format-currency";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const BudgetCard = ({ budget, onEdit, onDelete, isDeleting }) => {
  const { category, limitAmount, spent, remaining, percentage, isOverBudget } = budget;

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
    <Card className="relative overflow-hidden">
      {isDeleting && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/50 dark:bg-black/50 backdrop-blur-[1px]">
          <Loader className="h-6 w-6 animate-spin text-primary" />
        </div>
      )}
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div className="flex items-center gap-2">
          <CardTitle className="text-sm font-medium">
            {capitalize(category)}
          </CardTitle>
          {isOverBudget && (
            <Badge variant="destructive" className="text-[10px] h-4 px-1">
              Over budget
            </Badge>
          )}
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onEdit(budget)}>
              <Pencil className="mr-2 h-4 w-4" />
              Edit limit
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-red-600"
              onClick={() => onDelete(budget._id)}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Progress value={percentage} className={cn("h-2", getProgressColor(percentage))} />
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">
              Spent: {formatCurrency(spent)}
            </span>
            <span>Limit: {formatCurrency(limitAmount)}</span>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div>
            {isOverBudget ? (
              <p className="text-sm font-medium text-red-500">
                Over by {formatCurrency(spent - limitAmount)}
              </p>
            ) : (
              <p className="text-sm text-muted-foreground">
                {formatCurrency(remaining)} remaining
              </p>
            )}
          </div>
          <p className={cn("text-sm font-bold", getPercentageColor(percentage))}>
            {percentage}%
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default BudgetCard;
