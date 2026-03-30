import { BarChart3, Bot, TrendingUp, PieChart, Sparkles, Zap, ShieldCheck } from "lucide-react";

const FeaturesSection = () => {
  return (
    <section id="features" className="w-full py-24 bg-muted/30">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Everything you need, nothing you don't.
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            A comprehensive suite of tools perfectly designed to elevate your personal finance tracking. Let analytics and AI drive your wealth building.
          </p>
        </div>

        {/* Feature 1 */}
        <div className="grid md:grid-cols-2 gap-12 items-center mb-24">
          <div className="flex flex-col gap-6 order-2 md:order-1">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Bot className="h-6 w-6" />
            </div>
            <h3 className="text-2xl font-bold">AI Financial Assistant</h3>
            <p className="text-muted-foreground text-lg">
              Our advanced AI auto-categorizes your transactions, provides personalized budget recommendations, and offers deep insights into your spending patterns. Talk directly to your AI copilot.
            </p>
            <ul className="space-y-3 mt-2 grid grid-cols-1 sm:grid-cols-2">
              {[
                "Smart auto-categorization",
                "Personalized insights chat",
                "Spending forecasts",
                "Goal adjustment tips"
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-primary" />
                  <span className="text-sm font-medium">{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="order-1 md:order-2">
            <div className="rounded-2xl border border-border bg-gradient-to-br from-primary/5 to-primary/10 p-8 shadow-xl relative overflow-hidden h-[350px] flex items-center justify-center group">
              <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-primary/20 rounded-full blur-2xl group-hover:bg-primary/30 transition-all duration-500"></div>
              <div className="absolute bottom-0 left-0 -ml-8 -mb-8 w-40 h-40 bg-blue-500/20 rounded-full blur-2xl group-hover:bg-blue-500/30 transition-all duration-500"></div>
              
              <div className="relative z-10 w-full max-w-sm flex flex-col gap-4">
                <div className="bg-background rounded-xl p-4 shadow-sm border border-border flex gap-4 items-start translate-y-4 group-hover:-translate-y-2 transition-transform duration-500">
                  <div className="bg-primary/20 p-2 rounded-lg text-primary shrink-0"><Bot size={20} /></div>
                  <div>
                    <p className="text-sm font-medium">AI Insights</p>
                    <p className="text-xs text-muted-foreground mt-1">Based on this month's spending, you can save an extra $150 by reducing dining out.</p>
                  </div>
                </div>
                <div className="bg-background rounded-xl p-4 shadow-sm border border-border flex gap-4 items-center -translate-y-4 group-hover:translate-y-2 transition-transform duration-500 delay-75">
                  <div className="bg-green-500/20 p-2 rounded-lg text-green-500 shrink-0"><Sparkles size={20} /></div>
                  <div>
                    <p className="text-sm font-medium">Auto-Categorized</p>
                    <p className="text-xs text-muted-foreground mt-1">Whole Foods transaction marked as Groceries.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Feature 2 */}
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="rounded-2xl border border-border bg-gradient-to-tr from-purple-500/5 to-purple-500/10 p-8 shadow-xl relative overflow-hidden h-[350px] flex items-center justify-center group">
              <div className="absolute top-0 left-0 -ml-12 -mt-12 w-48 h-48 bg-purple-500/20 rounded-full blur-3xl group-hover:bg-purple-500/30 transition-all duration-500"></div>
              
              <div className="relative z-10 w-full flex flex-col gap-5">
                <div className="flex justify-between items-end px-2 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                  <div className="flex flex-col gap-1">
                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Total Balance</span>
                    <span className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">$12,450.00</span>
                  </div>
                  <div className="flex items-center gap-1 text-green-500 text-sm font-medium bg-green-500/10 px-2 py-1 rounded-full">
                    <TrendingUp size={14} /> +8.2%
                  </div>
                </div>
                
                <div className="bg-background rounded-xl p-5 shadow-sm border border-border flex items-end gap-3 h-32 mt-4 translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-75">
                  {/* Chart bars simulation */}
                  <div className="w-full bg-purple-500/20 rounded-t-md h-[40%] hover:bg-purple-500/40 transition-colors"></div>
                  <div className="w-full bg-purple-500/40 rounded-t-md h-[65%] hover:bg-purple-500/60 transition-colors"></div>
                  <div className="w-full bg-purple-500/60 rounded-t-md h-[30%] hover:bg-purple-500/80 transition-colors"></div>
                  <div className="w-full bg-purple-500 rounded-t-md h-[85%] hover:bg-purple-500/90 transition-colors shadow-[0_0_15px_rgba(168,85,247,0.4)]"></div>
                  <div className="w-full bg-purple-500/30 rounded-t-md h-[50%] hover:bg-purple-500/50 transition-colors"></div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-6">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500/10 text-purple-500">
              <BarChart3 className="h-6 w-6" />
            </div>
            <h3 className="text-2xl font-bold">Crystal Clear Reports</h3>
            <p className="text-muted-foreground text-lg">
              Detailed tracking with beautiful charts and tables. Monitor your cash flow down to the penny. Schedule daily, weekly, or monthly summary emails straight to your inbox.
            </p>
            <ul className="space-y-3 mt-2 grid grid-cols-1 sm:grid-cols-2">
              {[
                "Automated email reports",
                "Custom date ranges",
                "Exporting support",
                "Category breakdowns"
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-purple-500" />
                  <span className="text-sm font-medium">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
