import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { formatCurrency } from "@/lib/format-currency";
import { Button } from "@/components/ui/button";
import { Edit2, Trash2, Calendar } from "lucide-react";
import { useDeleteGoalMutation, useUpdateGoalMutation } from "@/features/goal/goalAPI";
import { toast } from "sonner";
import { useState } from "react";
import AddGoalDialog from "./add-goal-dialog";

const GoalCard = ({ goal }) => {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [deleteGoal, { isLoading: isDeleting }] = useDeleteGoalMutation();
  
  const percentage = Math.min(Math.round((goal.currentAmount / goal.targetAmount) * 100), 100);
  const remaining = Math.max(goal.targetAmount - goal.currentAmount, 0);

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this goal?")) {
      await deleteGoal(goal._id);
      toast.success("Goal deleted successfully");
    }
  };

  return _jsxs(Card, {
    className: "border-gray-100 dark:border-border",
    children: [
      _jsxs(CardHeader, {
        className: "flex flex-row items-center justify-between space-y-0 pb-2",
        children: [
          _jsx(CardTitle, { className: "text-lg font-semibold", children: goal.name }),
          _jsxs("div", {
            className: "flex items-center gap-1",
            children: [
              _jsx(Button, {
                variant: "ghost",
                size: "icon",
                className: "h-8 w-8",
                onClick: () => setIsEditDialogOpen(true),
                children: _jsx(Edit2, { className: "h-3.5 w-3.5" })
              }),
              _jsx(Button, {
                variant: "ghost",
                size: "icon",
                className: "h-8 w-8 text-destructive",
                onClick: handleDelete,
                disabled: isDeleting,
                children: _jsx(Trash2, { className: "h-3.5 w-3.5" })
              })
            ]
          })
        ]
      }),
      _jsxs(CardContent, {
        children: [
          _jsxs("div", {
            className: "flex items-baseline gap-2 mb-4",
            children: [
              _jsx("span", { className: "text-2xl font-bold", children: formatCurrency(goal.currentAmount) }),
              _jsxs("span", { className: "text-sm text-muted-foreground", children: ["of ", formatCurrency(goal.targetAmount)] })
            ]
          }),
          _jsxs("div", {
            className: "space-y-4",
            children: [
              _jsxs("div", {
                className: "space-y-1.5",
                children: [
                  _jsxs("div", {
                    className: "flex items-center justify-between text-xs",
                    children: [
                      _jsxs("span", { className: "font-medium", children: [percentage, "% complete"] }),
                      _jsxs("span", { className: "text-muted-foreground", children: [formatCurrency(remaining), " more to go"] })
                    ]
                  }),
                  _jsx(Progress, { value: percentage, className: "h-2" })
                ]
              }),
              goal.deadline && (
                _jsxs("div", {
                  className: "flex items-center gap-2 text-xs text-muted-foreground",
                  children: [
                    _jsx(Calendar, { className: "h-3 w-3" }),
                    "Target date: ",
                    new Date(goal.deadline).toLocaleDateString()
                  ]
                })
              )
            ]
          }),
          _jsx(AddGoalDialog, {
            open: isEditDialogOpen,
            onOpenChange: setIsEditDialogOpen,
            editGoal: goal
          })
        ]
      })
    ]
  });
};

export default GoalCard;
