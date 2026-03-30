import React, { useState } from "react";
import { PlusIcon, PiggyBank, Target } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

import PageLayout from "@/components/page-layout";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/empty-state";

import { useGetAllBudgetsQuery, useDeleteBudgetMutation } from "@/features/budget/budgetAPI";
import { useGetAllGoalsQuery, useDeleteGoalMutation } from "@/features/goal/goalAPI";

import BudgetCard from "./_component/budget-card";
import BudgetSummaryBar from "./_component/budget-summary-bar";
import BudgetMonthSelector from "./_component/budget-month-selector";
import SetBudgetDialog from "./_component/set-budget-dialog";
import GoalCard from "./_component/goal-card";
import GoalDialog from "./_component/goal-dialog";

const TABS = [
  { key: "budget", label: "Budgets", icon: PiggyBank },
  { key: "goals", label: "Goals", icon: Target },
];

const Budget = () => {
  const currentDate = new Date();
  const [activeTab, setActiveTab] = useState("budget");

  // Budget state
  const [month, setMonth] = useState(currentDate.getMonth() + 1);
  const [year, setYear] = useState(currentDate.getFullYear());
  const [budgetDialogOpen, setBudgetDialogOpen] = useState(false);
  const [budgetEditData, setBudgetEditData] = useState(null);

  // Goal state
  const [goalDialogOpen, setGoalDialogOpen] = useState(false);
  const [goalEditData, setGoalEditData] = useState(null);

  // API
  const { data: budgetData, isFetching: isBudgetFetching } = useGetAllBudgetsQuery({ month, year });
  const [deleteBudget, { isLoading: isDeletingBudget }] = useDeleteBudgetMutation();
  const { data: goalData, isFetching: isGoalFetching } = useGetAllGoalsQuery();
  const [deleteGoal, { isLoading: isDeletingGoal }] = useDeleteGoalMutation();

  const budgets = budgetData?.budgets || [];
  const summary = budgetData?.summary || {
    totalBudgeted: 0,
    totalSpent: 0,
    totalRemaining: 0,
    budgetsOverLimit: 0,
  };
  const goals = goalData?.data || [];
  const activeGoals = goals.filter((g) => g.status === "ACTIVE");
  const completedGoals = goals.filter((g) => g.status === "COMPLETED");

  // Budget handlers
  const handleBudgetEdit = (budget) => { setBudgetEditData(budget); setBudgetDialogOpen(true); };
  const handleBudgetDelete = async (id) => {
    try { await deleteBudget(id).unwrap(); toast.success("Budget deleted"); }
    catch (e) { toast.error(e.data?.message || "Failed to delete budget"); }
  };

  // Goal handlers
  const handleGoalEdit = (goal) => { setGoalEditData(goal); setGoalDialogOpen(true); };
  const handleGoalDelete = async (id) => {
    try { await deleteGoal(id).unwrap(); toast.success("Goal deleted"); }
    catch (e) { toast.error(e.data?.message || "Failed to delete goal"); }
  };

  // Goal summary stats
  const totalTarget = goals.reduce((s, g) => s + g.targetAmount, 0);
  const totalSaved = goals.reduce((s, g) => s + g.currentAmount, 0);

  return (
    <PageLayout
      addMarginTop={true}
      renderPageHeader={
        <div className="w-full max-w-[var(--max-width)] mx-auto">
          {/* Title + Action Button */}
          <div className="flex flex-col lg:flex-row items-start justify-between space-y-4 lg:space-y-0">
            <div className="space-y-1">
              <h2 className="text-2xl lg:text-4xl font-medium text-white">
                {activeTab === "budget" ? "Budget Planner" : "Savings Goals"}
              </h2>
              <p className="text-white/60 text-sm">
                {activeTab === "budget"
                  ? "Set monthly spending limits per category"
                  : "Track your savings milestones"}
              </p>
            </div>
            <Button
              onClick={() => {
                if (activeTab === "budget") {
                  setBudgetEditData(null);
                  setBudgetDialogOpen(true);
                } else {
                  setGoalEditData(null);
                  setGoalDialogOpen(true);
                }
              }}
              className="!cursor-pointer !text-white"
            >
              <PlusIcon className="h-4 w-4" />
              {activeTab === "budget" ? "Add Budget" : "Add Goal"}
            </Button>
          </div>

          {/* Summary bar / goal stats */}
          <div className="mt-6">
            {activeTab === "budget" ? (
              <BudgetSummaryBar summary={summary} isLoading={isBudgetFetching} />
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { label: "Total goals", value: goals.length },
                  { label: "Active", value: activeGoals.length },
                  { label: "Achieved", value: completedGoals.length },
                  {
                    label: "Progress",
                    value: totalTarget > 0
                      ? `${Math.round((totalSaved / totalTarget) * 100)}%`
                      : "—",
                  },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="bg-white/5 rounded-xl p-3 hover:bg-white/10 transition-all"
                  >
                    <p className="text-xs text-white/60 font-medium mb-1">{stat.label}</p>
                    <p className="text-xl font-bold text-white">{isGoalFetching ? "..." : stat.value}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Tabs */}
          <div className="mt-5 flex gap-1 bg-white/10 p-1 rounded-xl w-fit">
            {TABS.map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={cn(
                  "flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-semibold transition-all duration-200",
                  activeTab === key
                    ? "bg-white text-gray-900 shadow-lg"
                    : "text-white/60 hover:text-white hover:bg-white/5"
                )}
              >
                <Icon className="h-4 w-4" />
                {label}
              </button>
            ))}
          </div>

          {/* Month selector only for budget tab */}
          {activeTab === "budget" && (
            <div className="mt-4">
              <BudgetMonthSelector
                month={month}
                year={year}
                onChange={({ month: m, year: y }) => { setMonth(m); setYear(y); }}
              />
            </div>
          )}
        </div>
      }
    >
      <div className="mt-4">
        {/* ── BUDGET TAB ────────────────────── */}
        {activeTab === "budget" && (
          <>
            {isBudgetFetching ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[1, 2, 3].map((i) => <Skeleton key={i} className="h-48" />)}
              </div>
            ) : budgets.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12">
                <EmptyState
                  title="No budgets set"
                  description="Set spending limits for your expense categories to track where your money goes each month."
                  icon={PiggyBank}
                />
                <Button className="mt-6" onClick={() => setBudgetDialogOpen(true)}>
                  Set your first budget
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {budgets.map((budget) => (
                  <BudgetCard
                    key={budget._id}
                    budget={budget}
                    onEdit={handleBudgetEdit}
                    onDelete={handleBudgetDelete}
                    isDeleting={isDeletingBudget}
                  />
                ))}
              </div>
            )}
          </>
        )}

        {/* ── GOALS TAB ─────────────────────── */}
        {activeTab === "goals" && (
          <>
            {isGoalFetching ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[1, 2, 3].map((i) => <Skeleton key={i} className="h-48" />)}
              </div>
            ) : goals.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12">
                <EmptyState
                  title="No savings goals yet"
                  description="Create a savings goal to track your progress toward something meaningful."
                  icon={Target}
                />
                <Button className="mt-6" onClick={() => setGoalDialogOpen(true)}>
                  Create your first goal
                </Button>
              </div>
            ) : (
              <div className="space-y-6">
                {activeGoals.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-3">
                      Active ({activeGoals.length})
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {activeGoals.map((goal) => (
                        <GoalCard
                          key={goal._id}
                          goal={goal}
                          onEdit={handleGoalEdit}
                          onDelete={handleGoalDelete}
                          isDeleting={isDeletingGoal}
                        />
                      ))}
                    </div>
                  </div>
                )}
                {completedGoals.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-3">
                      Achieved 🎉 ({completedGoals.length})
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {completedGoals.map((goal) => (
                        <GoalCard
                          key={goal._id}
                          goal={goal}
                          onEdit={handleGoalEdit}
                          onDelete={handleGoalDelete}
                          isDeleting={isDeletingGoal}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>

      {/* Dialogs */}
      <SetBudgetDialog
        open={budgetDialogOpen}
        onClose={() => { setBudgetDialogOpen(false); setBudgetEditData(null); }}
        editData={budgetEditData}
      />
      <GoalDialog
        open={goalDialogOpen}
        onClose={() => { setGoalDialogOpen(false); setGoalEditData(null); }}
        editData={goalEditData}
      />
    </PageLayout>
  );
};

export default Budget;
