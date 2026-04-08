import React, { useState } from "react";
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

  return (
    <PageLayout
      title="Savings Goals"
      subtitle="Track and manage your long-term savings targets"
      rightAction={
        <Button onClick={() => setIsDialogOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Goal
        </Button>
      }
    >
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-[200px] w-full" />
          ))}
        </div>
      ) : goals.length === 0 ? (
        <EmptyState
          title="No goals set yet"
          description="Start saving for something big! Create your first goal to track progress."
          icon={Target}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {goals.map((goal) => (
            <GoalCard key={goal._id} goal={goal} />
          ))}
        </div>
      )}
      <AddGoalDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} />
    </PageLayout>
  );
};

export default GoalsPage;
