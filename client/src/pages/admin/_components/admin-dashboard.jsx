import React from "react";
import { useGetAdminDashboardQuery, useGetAdminAnalyticsQuery } from "@/features/admin/adminAPI";
import { Users, TrendingUp, TrendingDown, Loader, UserPlus, Activity } from "lucide-react";
import { Area, AreaChart, CartesianGrid, XAxis, ResponsiveContainer, Tooltip as RechartsTooltip } from "recharts";
import { format } from "date-fns";

const StatsCard = ({ title, value, icon: Icon, trend, trendLabel, iconContainerBg, iconColor }) => (
    <div className="relative overflow-hidden rounded-2xl bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/5 p-6 hover:shadow-lg hover:shadow-slate-200/50 dark:hover:shadow-black/20 transition-all">
        {/* Subtle background glow */}
        <div className={`absolute -right-10 -top-10 w-32 h-32 rounded-full blur-[60px] opacity-20 pointer-events-none ${iconColor === 'text-emerald-500' ? 'bg-emerald-500' : iconColor === 'text-blue-500' ? 'bg-blue-500' : 'bg-red-500'}`} />
        
        <div className="flex items-start justify-between relative z-10">
            <div>
                <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">{title}</h3>
                <div className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white mb-2">{value}</div>
                
                {trend && (
                    <div className="flex items-center gap-1.5 text-xs font-semibold">
                        <span className={`px-1.5 py-0.5 rounded-md ${trend > 0 ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400' : 'bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400'}`}>
                            {trend > 0 ? "+" : ""}{trend}%
                        </span>
                        <span className="text-slate-500 font-medium">{trendLabel}</span>
                    </div>
                )}
            </div>
            
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center border border-slate-100 dark:border-white/5 shadow-sm ${iconContainerBg}`}>
                <Icon className={`h-6 w-6 ${iconColor}`} />
            </div>
        </div>
    </div>
);

const ChartTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white dark:bg-[#111] border border-slate-200 dark:border-white/10 rounded-xl shadow-xl p-3 text-sm">
                <p className="font-semibold text-slate-900 dark:text-white mb-2">{format(new Date(label), "MMM d, yyyy")}</p>
                {payload.map((entry, index) => (
                    <div key={index} className="flex items-center justify-between gap-4 py-1">
                        <div className="flex items-center gap-1.5">
                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
                            <span className="text-slate-600 dark:text-slate-400 font-medium capitalize">{entry.name}</span>
                        </div>
                        <span className="font-bold text-slate-900 dark:text-white">
                            {entry.name === "count" ? entry.value : `₹${entry.value.toLocaleString()}`}
                        </span>
                    </div>
                ))}
            </div>
        );
    }
    return null;
};

const AdminDashboard = () => {
    const { data: dashboardData, isLoading: isDashboardLoading } = useGetAdminDashboardQuery();
    const { data: analyticsData, isLoading: isAnalyticsLoading } = useGetAdminAnalyticsQuery();
    
    const stats = dashboardData?.data;
    const analytics = analyticsData?.data;

    if (isDashboardLoading || isAnalyticsLoading) {
        return (
            <div className="flex h-64 items-center justify-center">
                <Loader className="h-8 w-8 animate-spin text-emerald-500" />
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            
            <div>
                <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white mb-2">Platform Overview</h1>
                <p className="text-slate-500 dark:text-slate-400 font-medium text-sm">Monitor Key Performance Indicators and highly actionable platform data.</p>
            </div>

            {/* TOP STATS */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <StatsCard
                    title="Total Registered Users"
                    value={stats?.totalUsers || 0}
                    icon={Users}
                    trend={12.5}
                    trendLabel="from last month"
                    iconContainerBg="bg-blue-50 dark:bg-white/5"
                    iconColor="text-blue-500"
                />
                <StatsCard
                    title="Total Income Tracked"
                    value={`₹${(stats?.totalIncome || 0).toLocaleString()}`}
                    icon={TrendingUp}
                    trend={8.2}
                    trendLabel="from last month"
                    iconContainerBg="bg-emerald-50 dark:bg-white/5"
                    iconColor="text-emerald-500"
                />
                <StatsCard
                    title="Total Expenses Tracked"
                    value={`₹${(stats?.totalExpenses || 0).toLocaleString()}`}
                    icon={TrendingDown}
                    trend={-2.4}
                    trendLabel="from last month"
                    iconContainerBg="bg-red-50 dark:bg-white/5"
                    iconColor="text-red-500"
                />
            </div>
            
            {/* CHARTS */}
            <div className="grid gap-6 md:grid-cols-2">
                
                {/* User Growth Chart */}
                <div className="rounded-2xl bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/5 p-6 hover:shadow-lg transition-all duration-300 flex flex-col">
                    <div className="flex items-center gap-2 mb-6">
                        <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center border border-blue-100 dark:border-blue-500/20">
                            <UserPlus className="h-4 w-4 text-blue-500" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-slate-900 dark:text-white text-base">User Acquisition</h3>
                            <p className="text-xs text-slate-500">New registrations last 30 days</p>
                        </div>
                    </div>
                    
                    <div className="h-[280px] w-full flex-1">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={analytics?.userGrowth || []} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="userGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" className="text-slate-200 dark:text-white/5" />
                                <XAxis 
                                    dataKey="date" 
                                    tickLine={false} 
                                    axisLine={false} 
                                    tickFormatter={(v) => format(new Date(v), "MMM d")}
                                    fontSize={12}
                                    tickMargin={12}
                                    stroke="currentColor" 
                                    className="text-slate-400"
                                />
                                <RechartsTooltip content={<ChartTooltip />} cursor={{ stroke: 'currentColor', strokeWidth: 1, strokeDasharray: '4 4', opacity: 0.2 }} />
                                <Area 
                                    type="monotone" 
                                    dataKey="count" 
                                    name="Registrations"
                                    stroke="#3b82f6" 
                                    fill="url(#userGradient)"
                                    strokeWidth={3}
                                    activeDot={{ r: 6, fill: "#3b82f6", stroke: "#fff", strokeWidth: 2 }}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Revenue Flow Chart */}
                <div className="rounded-2xl bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/5 p-6 hover:shadow-lg transition-all duration-300 flex flex-col">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center border border-emerald-100 dark:border-emerald-500/20">
                                <Activity className="h-4 w-4 text-emerald-500" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-slate-900 dark:text-white text-base">Cash Flow Engine</h3>
                                <p className="text-xs text-slate-500">Platform-wide income vs expenses</p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="h-[280px] w-full flex-1">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={analytics?.revenueTrends || []} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="expensesGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#ef4444" stopOpacity={0.2} />
                                        <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" className="text-slate-200 dark:text-white/5" />
                                <XAxis 
                                    dataKey="date" 
                                    tickLine={false} 
                                    axisLine={false} 
                                    tickFormatter={(v) => format(new Date(v), "MMM d")}
                                    fontSize={12}
                                    tickMargin={12}
                                    stroke="currentColor" 
                                    className="text-slate-400"
                                />
                                <RechartsTooltip content={<ChartTooltip />} cursor={{ stroke: 'currentColor', strokeWidth: 1, strokeDasharray: '4 4', opacity: 0.2 }} />
                                <Area 
                                    type="monotone" 
                                    dataKey="income"
                                    name="income" 
                                    stroke="#10b981" 
                                    fill="url(#incomeGradient)"
                                    strokeWidth={3}
                                    activeDot={{ r: 5, fill: "#10b981", stroke: "#fff", strokeWidth: 2 }}
                                />
                                <Area 
                                    type="monotone" 
                                    dataKey="expenses" 
                                    name="expenses"
                                    stroke="#ef4444" 
                                    fill="url(#expensesGradient)"
                                    strokeWidth={3}
                                    activeDot={{ r: 5, fill: "#ef4444", stroke: "#fff", strokeWidth: 2 }}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default AdminDashboard;
