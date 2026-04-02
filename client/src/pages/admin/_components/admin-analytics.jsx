import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, BarChart, Bar, XAxis, CartesianGrid } from "recharts";
import { PieChart as PieChartIcon, ArrowUpRight, ArrowDownRight, Lightbulb } from "lucide-react";

// Mock Data for the deep dive
const categoryData = [
  { name: "Housing", value: 45000, color: "#3b82f6" },
  { name: "Food", value: 12000, color: "#10b981" },
  { name: "Transport", value: 8000, color: "#f59e0b" },
  { name: "Entertainment", value: 6000, color: "#8b5cf6" },
  { name: "Healthcare", value: 4000, color: "#ef4444" },
];

const topUsersData = [
  { name: "A. Johnson", amount: 124500 },
  { name: "S. Chen", amount: 98000 },
  { name: "M. Ross", amount: 85200 },
  { name: "J. Doe", amount: 76000 },
  { name: "E. Smith", amount: 64000 },
];

const InsightCard = ({ title, description, isPositive }) => (
    <div className="flex gap-4 p-4 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/5">
        <div className={`mt-1 w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${isPositive ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400' : 'bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400'}`}>
            {isPositive ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
        </div>
        <div>
            <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-1">{title}</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{description}</p>
        </div>
    </div>
);

const AdminAnalytics = () => {
    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Deep Analytics</h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Advanced insights and platform intelligence.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Left Column (Main Charts) */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Bar Chart */}
                    <div className="bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/5 rounded-2xl p-6 shadow-sm">
                        <div className="flex items-center gap-2 mb-6">
                            <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center border border-blue-100 dark:border-blue-500/20">
                                <PieChartIcon className="h-4 w-4 text-blue-500" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-slate-900 dark:text-white text-base">Top Spenders (Mock)</h3>
                                <p className="text-xs text-slate-500">Highest volume users on the platform</p>
                            </div>
                        </div>
                        <div className="h-[250px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={topUsersData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }} barSize={32}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" className="text-slate-200 dark:text-white/5" />
                                    <XAxis 
                                        dataKey="name" 
                                        tickLine={false} 
                                        axisLine={false} 
                                        fontSize={12}
                                        tickMargin={12}
                                        stroke="currentColor" 
                                        className="text-slate-400"
                                    />
                                    <RechartsTooltip 
                                        cursor={{ fill: 'currentColor', opacity: 0.05 }} 
                                        contentStyle={{ borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', backgroundColor: '#111', color: '#fff' }}
                                    />
                                    <Bar dataKey="amount" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* AI Insights Engine Mock */}
                    <div className="bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/5 rounded-2xl p-6 shadow-sm">
                        <div className="flex items-center gap-2 mb-6">
                            <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center border border-emerald-100 dark:border-emerald-500/20">
                                <Lightbulb className="h-4 w-4 text-emerald-500" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-slate-900 dark:text-white text-base">Gemini Engine Insights</h3>
                                <p className="text-xs text-slate-500">Automated platform analysis</p>
                            </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <InsightCard 
                                title="Appetite for Housing" 
                                description="Users are logging 15% more housing-related expenses this quarter compared to Q3. Consider pushing mortgage integrations."
                                isPositive={true}
                            />
                            <InsightCard 
                                title="Retention Alert" 
                                description="Users who log at least 3 transactions in their first week have a 92% retention rate. The current drop-off is at day 4."
                                isPositive={false}
                            />
                            <InsightCard 
                                title="Income Verification" 
                                description="Platform-wide income reporting has stabilized, showing a highly affluent demographic averaging ₹1.2L/month incoming."
                                isPositive={true}
                            />
                        </div>
                    </div>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                    {/* Pie Chart */}
                    <div className="bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/5 rounded-2xl p-6 shadow-sm flex flex-col h-full">
                        <div>
                            <h3 className="font-semibold text-slate-900 dark:text-white text-base">Category Breakdown</h3>
                            <p className="text-xs text-slate-500 mb-6">Global spending distrubution</p>
                        </div>
                        
                        <div className="h-[200px] w-full flex items-center justify-center relative">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={categoryData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="value"
                                        stroke="none"
                                    >
                                        {categoryData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <RechartsTooltip contentStyle={{ borderRadius: '8px', border: 'none', backgroundColor: '#111', color: '#fff', fontSize: '12px' }} />
                                </PieChart>
                            </ResponsiveContainer>
                            {/* Inner Circle Label */}
                            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                <span className="text-xs text-slate-500">Total</span>
                                <span className="font-bold text-slate-900 dark:text-white">₹75K+</span>
                            </div>
                        </div>

                        <div className="flex flex-col gap-3 mt-6">
                            {categoryData.map((item, index) => (
                                <div key={index} className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                                        <span className="text-sm font-medium text-slate-600 dark:text-slate-400">{item.name}</span>
                                    </div>
                                    <span className="text-sm font-bold text-slate-900 dark:text-white">{(item.value / 1000).toFixed(1)}k</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default AdminAnalytics;
