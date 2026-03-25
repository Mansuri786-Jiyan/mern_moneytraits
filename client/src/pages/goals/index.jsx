import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import PageLayout from "@/components/page-layout";
import { Button } from "@/components/ui/button";
import { Plus, Target } from "lucide-react";
import { useGetAllGoalsQuery } from "@/features/goal/goalAPI";
import GoalCard from "./_component/goal-card";
import AddGoalDialog from "./_component/add-goal-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/empty-state";

const GoalsPage = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { data: goalsResponse, isLoading } = useGetAllGoalsQuery();
  const goals = goalsResponse?.data || [];

  return _jsxs(PageLayout, {
    title: "Savings Goals",
    subtitle: "Track and manage your long-term savings targets",
    rightAction: _jsxs(Button, {
      onClick: () => setIsDialogOpen(true),
      className: "gap-2",
      children: [
        _jsx(Plus, { className: "h-4 w-4" }),
        "Add Goal"
      ]
    }),
    children: [
      isLoading ? (
        _jsx("div", {
          className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6",
          children: [1, 2, 3].map((i) => (
            _jsx(Skeleton, { className: "h-[200px] w-full" }, i)
          ))
        })
      ) : goals.length === 0 ? (
        _jsx(EmptyState, {
          title: "No goals set yet",
          description: "Start saving for something big! Create your first goal to track progress.",
          icon: Target
        })
      ) : (
        _jsx("div", {
          className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6",
          children: goals.map((goal) => (
            _jsx(GoalCard, { goal: goal }, goal._id)
          ))
        })
      ),
      _jsx(AddGoalDialog, {
        open: isDialogOpen,
        onOpenChange: setIsDialogOpen
      })
    ]
  });
};

export default GoalsPage;
