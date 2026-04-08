import { Link } from "react-router-dom";
import PremiumTransactionTable from "@/components/transaction/premium-transaction-table/index.jsx";
import { Button } from "@/components/ui/button";
import { PROTECTED_ROUTES } from "@/routes/common/routePath";
import { EmptyState } from "@/components/empty-state";
import { PlusCircleIcon } from "lucide-react";
import { useGetAllTransactionsQuery } from "@/features/transaction/transactionAPI";
import AddTransactionDrawer from "@/components/transaction/add-transaction-drawer";

const DashboardRecentTransactions = () => {
  const { data: transactionData } = useGetAllTransactionsQuery({
    pageNumber: 1,
    pageSize: 1,
  });
  const isTransactionsEmpty = transactionData?.pagination?.totalCount === 0;

  return (
    <div className="bg-white/70 dark:bg-slate-900/40 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-2xl overflow-hidden shadow-xl dark:shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center justify-between p-6 pb-2">
        <div className="space-y-1">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">
            Recent Transactions
          </h3>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">
            Showing your latest activity
          </p>
        </div>
        <Button
          asChild
          variant="ghost"
          className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 hover:bg-indigo-500/10 font-bold text-sm"
        >
          <Link to={PROTECTED_ROUTES.TRANSACTIONS}>View all</Link>
        </Button>
      </div>

      <div className="px-2 pb-2">
        {isTransactionsEmpty ? (
          <div className="flex flex-col items-center justify-center py-12">
            <EmptyState
              title="No transactions yet"
              description="Add your first transaction to start tracking your finances"
              icon={PlusCircleIcon}
            />
            <div className="mt-6">
              <AddTransactionDrawer />
            </div>
          </div>
        ) : (
          <PremiumTransactionTable pageSize={10} isShowPagination={false} />
        )}
      </div>
    </div>
  );
};

export default DashboardRecentTransactions;
