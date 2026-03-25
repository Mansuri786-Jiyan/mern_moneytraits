import React, { useState } from "react";
import { PlusIcon, PiggyBank } from "lucide-react";
import { toast } from "sonner";

import PageLayout from "@/components/page-layout";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/empty-state";

import { useGetAllBudgetsQuery, useDeleteBudgetMutation } from "@/features/budget/budgetAPI";

import BudgetCard from "./_component/budget-card";
import BudgetSummaryBar from "./_component/budget-summary-bar";
import BudgetMonthSelector from "./_component/budget-month-selector";
import SetBudgetDialog from "./_component/set-budget-dialog";

const Budget = () => {
  const currentDate = new Date();
  const [month, setMonth] = useState(currentDate.getMonth() + 1);
  const [year, setYear] = useState(currentDate.getFullYear());
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editData, setEditData] = useState(null);

  const { data, isFetching } = useGetAllBudgetsQuery({ month, year });
  const [deleteBudget, { isLoading: isDeletingProcess }] = useDeleteBudgetMutation();

  const budgets = data?.budgets || [];
  const summary = data?.summary || {
    totalBudgeted: 0,
    totalSpent: 0,
    totalRemaining: 0,
    budgetsOverLimit: 0,
  };

  const handleEdit = (budget) => {
    setEditData(budget);
    setDialogOpen(true);
  };

  const handleDelete = async (budgetId) => {
    try {
      await deleteBudget(budgetId).unwrap();
      toast.success("Budget deleted");
    } catch (error) {
      toast.error(error.data?.message || "Failed to delete budget");
    }
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setEditData(null);
  };

  const handleMonthChange = (selected) => {
    setMonth(selected.month);
    setYear(selected.year);
  };

  return (
    <PageLayout
      addMarginTop={true}
      renderPageHeader={
        <div className="w-full max-w-[var(--max-width)] mx-auto">
          {/* Row 1: Title + Button */}
          <div className="flex flex-col lg:flex-row items-start justify-between space-y-4 lg:space-y-0">
            <div className="space-y-1">
              <h2 className="text-2xl lg:text-4xl font-medium text-white">Budget Planner</h2>
              <p className="text-white/60 text-sm">Set monthly spending limits per category</p>
            </div>
            <Button
              onClick={() => {
                setEditData(null);
                setDialogOpen(true);
              }}
              className="!cursor-pointer !text-white"
            >
              <PlusIcon className="h-4 w-4" />
              Add Budget
            </Button>
          </div>

          {/* Row 2: Summary stats */}
          <div className="mt-6">
            <BudgetSummaryBar summary={summary} isLoading={isFetching} />
          </div>

          {/* Row 3: Month/year selector */}
          <div className="mt-4">
            <BudgetMonthSelector month={month} year={year} onChange={handleMonthChange} />
          </div>
        </div>
      }
    >
      <div className="mt-4">
        {isFetching ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-48" />
            ))}
          </div>
        ) : budgets.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <EmptyState
              title="No budgets set"
              description="Set spending limits for your expense categories to track where your money goes each month."
              icon={PiggyBank}
            />
            <Button className="mt-6" onClick={() => setDialogOpen(true)}>
              Set your first budget
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {budgets.map((budget) => (
              <BudgetCard
                key={budget._id}
                budget={budget}
                onEdit={handleEdit}
                onDelete={handleDelete}
                isDeleting={isDeletingProcess}
              />
            ))}
          </div>
        )}
      </div>

      <SetBudgetDialog
        open={dialogOpen}
        onClose={handleDialogClose}
        editData={editData}
      />
    </PageLayout>
  );
};

export default Budget;
