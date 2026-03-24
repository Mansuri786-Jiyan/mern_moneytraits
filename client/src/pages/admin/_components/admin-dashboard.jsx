import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useGetAdminDashboardQuery, useGetAdminAnalyticsQuery } from "@/features/admin/adminAPI";
import { Users, TrendingUp, TrendingDown, Loader, UserPlus, Activity } from "lucide-react";
import { Area, AreaChart, CartesianGrid, XAxis, ResponsiveContainer, Tooltip } from "recharts";
import { format } from "date-fns";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

const StatsCard = ({ title, value, icon: Icon, description, iconColor }) => (
    <Card className="border shadow-none">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{title}</CardTitle>
            <Icon className={`h-4 w-4 ${iconColor}`} />
        </CardHeader>
        <CardContent>
            <div className="text-2xl font-bold">{value}</div>
            <p className="text-xs text-muted-foreground mt-1">{description}</p>
        </CardContent>
    </Card>
);

const AdminDashboard = () => {
    const { data: dashboardData, isLoading: isDashboardLoading } = useGetAdminDashboardQuery();
    const { data: analyticsData, isLoading: isAnalyticsLoading } = useGetAdminAnalyticsQuery();
    
    const stats = dashboardData?.data;
    const analytics = analyticsData?.data;

    if (isDashboardLoading || isAnalyticsLoading) {
        return (
            <div className="flex items-center justify-center p-12">
                <Loader className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    const chartConfig = {
        users: { label: "New Users", color: "hsl(var(--primary))" },
        income: { label: "Income", color: "hsl(var(--chart-2))" },
        expenses: { label: "Expenses", color: "hsl(var(--destructive))" },
    };

    return (
        <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <StatsCard
                    title="Total Users"
                    value={stats?.totalUsers || 0}
                    icon={Users}
                    description="Registered platform users"
                    iconColor="text-blue-500"
                />
                <StatsCard
                    title="Total Income"
                    value={`₹${(stats?.totalIncome || 0).toLocaleString()}`}
                    icon={TrendingUp}
                    description="Total income across all users"
                    iconColor="text-green-500"
                />
                <StatsCard
                    title="Total Expenses"
                    value={`₹${(stats?.totalExpenses || 0).toLocaleString()}`}
                    icon={TrendingDown}
                    description="Total spending across all users"
                    iconColor="text-red-500"
                />
            </div>
            
            <div className="grid gap-6 md:grid-cols-2">
                <Card className="border shadow-none">
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <UserPlus className="h-4 w-4 text-blue-500" />
                            <CardTitle className="text-base">User Growth</CardTitle>
                        </div>
                        <CardDescription>New user registrations (Last 30 days)</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[250px] pt-4">
                        <ChartContainer config={chartConfig} className="h-full w-full">
                            <AreaChart data={analytics?.userGrowth || []}>
                                <defs>
                                    <linearGradient id="userGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                                <XAxis 
                                    dataKey="date" 
                                    tickLine={false} 
                                    axisLine={false} 
                                    tickFormatter={(v) => format(new Date(v), "MMM d")}
                                    fontSize={12}
                                    tickMargin={10}
                                />
                                <ChartTooltip content={<ChartTooltipContent labelFormatter={(v) => format(new Date(v), "MMM d, yyyy")} />} />
                                <Area 
                                    type="monotone" 
                                    dataKey="count" 
                                    stroke="hsl(var(--primary))" 
                                    fillOpacity={1} 
                                    fill="url(#userGradient)"
                                    strokeWidth={2}
                                />
                            </AreaChart>
                        </ChartContainer>
                    </CardContent>
                </Card>

                <Card className="border shadow-none">
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <Activity className="h-4 w-4 text-green-500" />
                            <CardTitle className="text-base">Revenue Trends</CardTitle>
                        </div>
                        <CardDescription>Platform income vs expenses (Last 30 days)</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[250px] pt-4">
                        <ChartContainer config={chartConfig} className="h-full w-full">
                            <AreaChart data={analytics?.revenueTrends || []}>
                                <defs>
                                    <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="hsl(var(--chart-2))" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="hsl(var(--chart-2))" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="expensesGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="hsl(var(--destructive))" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="hsl(var(--destructive))" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                                <XAxis 
                                    dataKey="date" 
                                    tickLine={false} 
                                    axisLine={false} 
                                    tickFormatter={(v) => format(new Date(v), "MMM d")}
                                    fontSize={12}
                                    tickMargin={10}
                                />
                                <ChartTooltip content={<ChartTooltipContent labelFormatter={(v) => format(new Date(v), "MMM d, yyyy")} />} />
                                <Area 
                                    type="monotone" 
                                    dataKey="income" 
                                    stroke="hsl(var(--chart-2))" 
                                    fillOpacity={1} 
                                    fill="url(#incomeGradient)"
                                    strokeWidth={2}
                                />
                                <Area 
                                    type="monotone" 
                                    dataKey="expenses" 
                                    stroke="hsl(var(--destructive))" 
                                    fillOpacity={1} 
                                    fill="url(#expensesGradient)"
                                    strokeWidth={2}
                                />
                            </AreaChart>
                        </ChartContainer>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default AdminDashboard;
