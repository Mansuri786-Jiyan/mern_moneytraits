import React from "react";
import {
  MoreHorizontal,
  Pencil,
  Trash2,
  Loader,
  Target,
  CheckCircle2,
} from "lucide-react";
import { formatCurrency } from "@/lib/format-currency";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
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

const GoalCard = ({ goal, onEdit, onDelete, isDeleting }) => {
  const { name, targetAmount, currentAmount, deadline, status } = goal;
  const percentage = Math.min(
    Math.round((currentAmount / targetAmount) * 100),
    100
  );
  const isCompleted = status === "COMPLETED";
  const remaining = Math.max(targetAmount - currentAmount, 0);

  const getProgressColor = (pct, completed) => {
    if (completed) return "[&>div]:bg-green-500";
    if (pct >= 80) return "[&>div]:bg-amber-500";
    return "[&>div]:bg-primary";
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
          <div
            className={cn(
              "p-1.5 rounded-lg",
              isCompleted
                ? "bg-green-100 dark:bg-green-900/30"
                : "bg-primary/10"
            )}
          >
            {isCompleted ? (
              <CheckCircle2 className="h-4 w-4 text-green-500" />
            ) : (
              <Target className="h-4 w-4 text-primary" />
            )}
          </div>
          <CardTitle className="text-sm font-medium">{name}</CardTitle>
          {isCompleted && (
            <Badge className="text-[10px] h-4 px-1 bg-green-500 text-white">
              Achieved
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
            <DropdownMenuItem onClick={() => onEdit(goal)}>
              <Pencil className="mr-2 h-4 w-4" />
              Edit goal
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-red-600"
              onClick={() => onDelete(goal._id)}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Progress
            value={percentage}
            className={cn("h-2", getProgressColor(percentage, isCompleted))}
          />
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">
              Saved: {formatCurrency(currentAmount)}
            </span>
            <span>Goal: {formatCurrency(targetAmount)}</span>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div>
            {isCompleted ? (
              <p className="text-sm font-medium text-green-500">
                Goal achieved! 🎉
              </p>
            ) : (
              <p className="text-sm text-muted-foreground">
                {formatCurrency(remaining)} to go
              </p>
            )}
            {deadline && (
              <p className="text-xs text-muted-foreground mt-0.5">
                Deadline: {format(new Date(deadline), "dd MMM yyyy")}
              </p>
            )}
          </div>
          <p
            className={cn(
              "text-sm font-bold",
              isCompleted
                ? "text-green-500"
                : percentage >= 80
                ? "text-amber-500"
                : "text-primary"
            )}
          >
            {percentage}%
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default GoalCard;
