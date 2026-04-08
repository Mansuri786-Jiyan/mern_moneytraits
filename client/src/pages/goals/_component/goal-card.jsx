import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { formatCurrency } from "@/lib/format-currency";
import { Button } from "@/components/ui/button";
import { Edit2, Trash2, Calendar } from "lucide-react";
import {
  useDeleteGoalMutation,
  useUpdateGoalMutation,
} from "@/features/goal/goalAPI";
import { toast } from "sonner";
import AddGoalDialog from "./add-goal-dialog";

const GoalCard = ({ goal }) => {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [deleteGoal, { isLoading: isDeleting }] = useDeleteGoalMutation();

  const percentage = Math.min(
    Math.round((goal.currentAmount / goal.targetAmount) * 100),
    100
  );
  const remaining = Math.max(goal.targetAmount - goal.currentAmount, 0);

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this goal?")) {
      await deleteGoal(goal._id);
      toast.success("Goal deleted successfully");
    }
  };

  return (
    <Card className="border-gray-100 dark:border-border">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-semibold">{goal.name}</CardTitle>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => setIsEditDialogOpen(true)}
          >
            <Edit2 className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-destructive"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-baseline gap-2 mb-4">
          <span className="text-2xl font-bold">
            {formatCurrency(goal.currentAmount)}
          </span>
          <span className="text-sm text-muted-foreground">
            of {formatCurrency(goal.targetAmount)}
          </span>
        </div>
        <div className="space-y-4">
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium">{percentage}% complete</span>
              <span className="text-muted-foreground">
                {formatCurrency(remaining)} more to go
              </span>
            </div>
            <Progress value={percentage} className="h-2" />
          </div>
          {goal.deadline && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Calendar className="h-3 w-3" />
              Target date: {new Date(goal.deadline).toLocaleDateString()}
            </div>
          )}
        </div>
        <AddGoalDialog
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          editGoal={goal}
        />
      </CardContent>
    </Card>
  );
};

export default GoalCard;
