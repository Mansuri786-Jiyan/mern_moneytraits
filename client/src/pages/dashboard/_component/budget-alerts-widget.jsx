import { useGetAllBudgetsQuery } from "@/features/budget/budgetAPI";
import { AlertTriangle, AlertOctagon, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { PROTECTED_ROUTES } from "@/routes/common/routePath";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/lib/format-currency";

const BudgetAlertsWidget = () => {
    const currentDate = new Date();
    const month = currentDate.getMonth() + 1;
    const year = currentDate.getFullYear();

    const { data: budgetsData, isLoading } = useGetAllBudgetsQuery({ month, year });
    const budgets = budgetsData?.budgets || [];

    const alerts = budgets
        .filter((b) => b.percentage >= 80)
        .sort((a, b) => b.percentage - a.percentage);

    if (isLoading || alerts.length === 0) return null;

    const getAlertStyles = (pct) => {
        if (pct >= 100) return "bg-red-500/10 border-red-200 text-red-600 dark:bg-red-500/20 dark:border-red-900";
        return "bg-amber-500/10 border-amber-200 text-amber-600 dark:bg-amber-500/20 dark:border-amber-900";
    };

    return (
        <div className="space-y-4 mb-6">
            <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-amber-500" />
                    Budget Alerts
                </h3>
                <Link 
                    to={PROTECTED_ROUTES.BUDGET} 
                    className="text-xs text-muted-foreground hover:text-primary flex items-center gap-1"
                >
                    Manage Budgets <ArrowRight className="h-3 w-3" />
                </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {alerts.map((alert) => (
                    <Card key={alert._id} className={cn("border shadow-none", getAlertStyles(alert.percentage))}>
                        <CardContent className="p-3 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                {alert.percentage >= 100 ? (
                                    <AlertOctagon className="h-5 w-5 shrink-0" />
                                ) : (
                                    <AlertTriangle className="h-5 w-5 shrink-0" />
                                )}
                                <div>
                                    <p className="text-sm font-bold capitalize leading-none">{alert.category}</p>
                                    <p className="text-xs mt-1 opacity-80">
                                        {alert.percentage >= 100 
                                            ? `Critical: Exceeded by ${formatCurrency(alert.spent - alert.limitAmount)}`
                                            : `Warning: ${alert.percentage}% of limit reached`
                                        }
                                    </p>
                                </div>
                            </div>
                            <div className="text-right">
                                <span className="text-xs font-bold">{alert.percentage}%</span>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default BudgetAlertsWidget;
