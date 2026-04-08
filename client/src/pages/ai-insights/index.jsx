import React, { useState, useRef, useEffect } from "react";
import { format } from "date-fns";
import {
  Brain,
  Sparkles,
  MessageCircle,
  Send,
  Loader,
  TrendingUp,
  TrendingDown,
  Target,
  PiggyBank,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/lib/format-currency";
import {
  useSummaryAnalyticsQuery,
  useGetForecastQuery,
} from "@/features/analytics/analyticsAPI";
import { useGetBudgetSummaryQuery } from "@/features/budget/budgetAPI";
import { useSendChatMessageMutation } from "@/features/chatbot/chatbotAPI";
import { useTypedSelector } from "@/app/hook";
import PageLayout from "@/components/page-layout";
import FinancialHealthScore from "@/pages/dashboard/_component/financial-health-score";
import SpendingForecast from "@/pages/dashboard/_component/spending-forecast";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const SECTIONS = ["overview", "forecast", "chat"];
const SECTION_LABELS = {
  overview: "Overview",
  forecast: "Forecast",
  chat: "Chat with AI",
};

const SUGGESTED_QUESTIONS = [
  "How much did I spend this month?",
  "Which category am I overspending on?",
  "Am I on track with my budget?",
  "How can I improve my savings rate?",
  "What is my biggest expense category?",
  "Give me tips to reduce spending.",
  "How does my spending compare to last month?",
  "What will I likely spend next month?",
];

const WELCOME_MESSAGE = {
  id: 1,
  role: "model",
  content:
    "Hi! I am your AI finance assistant powered by Google Gemini. Ask me anything about your spending patterns, savings goals, or financial health.",
  timestamp: new Date(),
};

export default function AIInsights() {
  const [activeSection, setActiveSection] = useState("overview");
  const [messages, setMessages] = useState([WELCOME_MESSAGE]);
  const [chatInput, setChatInput] = useState("");
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [aiSummary, setAiSummary] = useState(null);
  const [isLoadingSummary, setIsLoadingSummary] = useState(true);
  const messagesEndRef = useRef(null);

  const { user } = useTypedSelector((state) => state.auth);

  const { data: summaryResponse, isFetching: isSummaryLoading } =
    useSummaryAnalyticsQuery({
      preset: "30days",
    });
  const { data: forecastResponse } = useGetForecastQuery();
  const { data: budgetResponse } = useGetBudgetSummaryQuery();
  const [sendChatMessage] = useSendChatMessageMutation();

  const summaryData = summaryResponse?.data;
  const budgetSummary = budgetResponse?.data?.summary;

  // Auto-scroll chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Generate AI summary once summaryData loads
  useEffect(() => {
    if (!summaryData) return;
    let cancelled = false;
    const generateSummary = async () => {
      setIsLoadingSummary(true);
      try {
        const result = await sendChatMessage({
          message: `Give me a 3-sentence summary of my financial health. Income: ${summaryData.totalIncome}, Expenses: ${summaryData.totalExpenses}, Savings rate: ${summaryData.savingRate?.percentage}%. Be encouraging and specific. No bullet points.`,
          conversationHistory: [],
        }).unwrap();
        if (!cancelled) setAiSummary(result.data?.reply);
      } catch {
        if (!cancelled) setAiSummary(null);
      } finally {
        if (!cancelled) setIsLoadingSummary(false);
      }
    };
    generateSummary();
    return () => {
      cancelled = true;
    };
  }, [summaryData]); // eslint-disable-line react-hooks/exhaustive-deps

  // ─── Chat handlers ──────────────────────────────────────────────
  const handleSendChat = () => {
    const text = chatInput.trim();
    if (!text || isChatLoading) return;
    handleSendChatWithMessage(text);
  };

  const handleSendChatWithMessage = async (text) => {
    setMessages((prev) => [
      ...prev,
      { id: Date.now(), role: "user", content: text, timestamp: new Date() },
    ]);
    setChatInput("");
    setIsChatLoading(true);

    try {
      const history = messages.slice(-8).map((m) => ({
        role: m.role,
        content: m.content,
      }));
      const result = await sendChatMessage({
        message: text,
        conversationHistory: history,
      }).unwrap();
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          role: "model",
          content: result.data?.reply || "I couldn't generate a response.",
          timestamp: new Date(),
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          role: "model",
          content: "Sorry, something went wrong. Please try again.",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsChatLoading(false);
    }
  };

  // ─── Stat cards data ─────────────────────────────────────────────
  const budgetsOverLimit = budgetSummary?.budgetsOverLimit ?? null;
  const budgetStatusText =
    budgetsOverLimit === null
      ? "—"
      : budgetsOverLimit === 0
      ? "All on track"
      : `${budgetsOverLimit} over limit`;

  const quickStats = [
    {
      label: "Monthly income",
      value: isSummaryLoading
        ? "..."
        : formatCurrency(summaryData?.totalIncome || 0),
    },
    {
      label: "Monthly expenses",
      value: isSummaryLoading
        ? "..."
        : formatCurrency(summaryData?.totalExpenses || 0),
    },
    {
      label: "Savings rate",
      value: isSummaryLoading
        ? "..."
        : `${(summaryData?.savingRate?.percentage || 0).toFixed(1)}%`,
    },
    { label: "Budgets", value: budgetStatusText },
  ];

  // ─── Quick tips data ──────────────────────────────────────────────
  const tips = [
    {
      icon: TrendingUp,
      color: "text-green-500",
      bg: "bg-green-50 dark:bg-green-900/20",
      tip:
        (summaryData?.savingRate?.percentage || 0) >= 20
          ? "Great savings rate! Keep it above 20%."
          : "Try to save at least 20% of your income each month.",
    },
    {
      icon: Target,
      color: "text-blue-500",
      bg: "bg-blue-50 dark:bg-blue-900/20",
      tip:
        budgetsOverLimit === 0
          ? "All budgets on track this month — excellent discipline!"
          : budgetsOverLimit === null
          ? "Set budgets to track your spending limits."
          : `${budgetsOverLimit} budget${
              budgetsOverLimit > 1 ? "s" : ""
            } exceeded — review your spending.`,
    },
    {
      icon: PiggyBank,
      color: "text-purple-500",
      bg: "bg-purple-50 dark:bg-purple-900/20",
      tip: "Set savings goals to stay motivated and track progress automatically.",
    },
  ];

  // ─── Page header ─────────────────────────────────────────────────
  const renderHeader = (
    <div className="w-full max-w-[var(--max-width)] mx-auto pb-6 px-4 lg:px-0">
      {/* Top row */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-5">
        <div>
          <h2 className="text-2xl lg:text-4xl font-medium text-white">
            AI Insights
          </h2>
          <p className="text-white/60 text-sm mt-1">
            Powered by Google Gemini AI
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-500/20 border border-purple-400/30">
          <Brain className="h-4 w-4 text-purple-300" />
          <span className="text-sm text-purple-200 font-medium">
            Gemini 2.5 Flash
          </span>
        </div>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {quickStats.map((stat) => (
          <div
            key={stat.label}
            className="bg-white/5 rounded-xl p-4 hover:bg-white/10 transition-all"
          >
            <p className="text-[13px] text-gray-300 font-medium mb-2">
              {stat.label}
            </p>
            <p className="text-2xl font-bold text-white">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Section tabs */}
      <div className="flex gap-1 mt-5 bg-white/10 p-1 rounded-xl w-fit">
        {SECTIONS.map((section) => (
          <button
            key={section}
            onClick={() => setActiveSection(section)}
            className={cn(
              "px-5 py-2 rounded-lg text-sm font-semibold transition-all duration-200",
              activeSection === section
                ? "bg-white text-gray-900 shadow-lg"
                : "text-white/60 hover:text-white hover:bg-white/5"
            )}
          >
            {SECTION_LABELS[section]}
          </button>
        ))}
      </div>
    </div>
  );

  // ─── SECTION: Overview ────────────────────────────────────────────
  const overviewSection = (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Left: Financial Health Score */}
      <FinancialHealthScore
        dateRange={{ value: "30days", label: "Last 30 Days" }}
      />

      {/* Right: AI Summary Card */}
      <Card className="!shadow-none border border-gray-100 dark:border-border h-full">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-purple-500" />
            AI financial summary
          </CardTitle>
          <CardDescription>
            Personalized analysis of your last 30 days
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoadingSummary ? (
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-4/5" />
              <Skeleton className="h-4 w-3/5" />
            </div>
          ) : aiSummary ? (
            <p className="text-sm text-muted-foreground leading-relaxed">
              {aiSummary}
            </p>
          ) : (
            <p className="text-sm text-muted-foreground italic">
              Add more transactions to get your AI summary.
            </p>
          )}

          {/* Quick tips */}
          <div className="mt-6 pt-4 border-t">
            <p className="text-sm font-medium mb-3">Quick financial tips</p>
            <div className="space-y-2.5">
              {tips.map((item, i) => (
                <div
                  key={i}
                  className={cn("flex gap-3 p-3 rounded-lg", item.bg)}
                >
                  <item.icon
                    className={cn("h-4 w-4 shrink-0 mt-0.5", item.color)}
                  />
                  <p className="text-xs text-muted-foreground">{item.tip}</p>
                </div>
              ))}
            </div>
          </div>

          <Button
            className="w-full mt-5 !text-white"
            onClick={() => setActiveSection("chat")}
          >
            <MessageCircle className="h-4 w-4 mr-2" />
            Ask AI a question
          </Button>
        </CardContent>
      </Card>
    </div>
  );

  // ─── SECTION: Forecast ────────────────────────────────────────────
  const forecastSection = (
    <div className="space-y-6">
      <SpendingForecast />

      {/* Month-over-month trend */}
      <Card className="!shadow-none border border-gray-100 dark:border-border">
        <CardHeader>
          <CardTitle className="text-lg">Month over month trend</CardTitle>
          <CardDescription>
            How your spending has changed over time
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isSummaryLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : (
            <div>
              {[
                {
                  label: "Income",
                  change: summaryData?.percentageChange?.income,
                  positive: true,
                },
                {
                  label: "Expenses",
                  change: summaryData?.percentageChange?.expenses,
                  positive: false,
                },
                {
                  label: "Balance",
                  change: summaryData?.percentageChange?.balance,
                  positive: true,
                },
              ].map((item) => {
                const change = item.change ?? 0;
                const isGood = item.positive ? change >= 0 : change <= 0;
                return (
                  <div
                    key={item.label}
                    className="flex items-center justify-between py-3 border-b last:border-0"
                  >
                    <span className="text-sm font-medium">{item.label}</span>
                    <div
                      className={cn(
                        "flex items-center gap-1 text-sm font-semibold",
                        isGood ? "text-green-500" : "text-red-500"
                      )}
                    >
                      {change >= 0 ? (
                        <TrendingUp className="h-4 w-4" />
                      ) : (
                        <TrendingDown className="h-4 w-4" />
                      )}
                      {Math.abs(change).toFixed(1)}%
                      <span className="text-xs text-muted-foreground font-normal ml-1">
                        vs previous period
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );

  // ─── SECTION: Chat ────────────────────────────────────────────────
  const chatSection = (
    <div className="grid lg:grid-cols-3 gap-6">
      {/* Chat panel */}
      <div className="lg:col-span-2">
        <Card className="!shadow-none border border-gray-100 dark:border-border">
          <CardHeader className="flex flex-row items-start justify-between">
            <div>
              <CardTitle className="text-lg">Chat with AI</CardTitle>
              <CardDescription>Ask anything about your finances</CardDescription>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-500/20 border border-purple-400/30 shrink-0">
              <Brain className="h-4 w-4 text-purple-500" />
              <span className="text-xs text-purple-600 font-semibold">
                Gemini AI
              </span>
            </div>
          </CardHeader>

          <CardContent className="p-0">
            {/* Messages */}
            <div className="h-[480px] overflow-y-auto p-4 space-y-3">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={cn(
                    "flex items-end gap-2",
                    msg.role === "user" ? "justify-end" : "justify-start"
                  )}
                >
                  {msg.role === "model" && (
                    <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center shrink-0 mb-1">
                      <Sparkles className="h-3.5 w-3.5 text-white" />
                    </div>
                  )}
                  <div
                    className={cn(
                      "max-w-[75%] rounded-2xl px-4 py-2.5 text-sm",
                      msg.role === "user"
                        ? "bg-primary text-white rounded-br-sm"
                        : "bg-muted text-foreground rounded-bl-sm"
                    )}
                  >
                    {msg.content}
                    <p
                      className={cn(
                        "text-[10px] mt-1",
                        msg.role === "user"
                          ? "text-white/60 text-right"
                          : "text-muted-foreground"
                      )}
                    >
                      {format(new Date(msg.timestamp), "HH:mm")}
                    </p>
                  </div>
                </div>
              ))}

              {/* Typing indicator */}
              {isChatLoading && (
                <div className="flex items-end gap-2 justify-start">
                  <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center shrink-0">
                    <Sparkles className="h-3.5 w-3.5 text-white" />
                  </div>
                  <div className="bg-muted rounded-2xl rounded-bl-sm px-4 py-3 flex gap-1.5">
                    {[0, 1, 2].map((i) => (
                      <div
                        key={i}
                        className="w-1.5 h-1.5 bg-muted-foreground/40 rounded-full animate-bounce"
                        style={{ animationDelay: `${i * 0.15}s` }}
                      />
                    ))}
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="border-t p-4 flex gap-2">
              <Input
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSendChat();
                  }
                }}
                placeholder="Ask about your spending, savings, budget..."
                disabled={isChatLoading}
                className="flex-1"
              />
              <Button
                onClick={handleSendChat}
                disabled={isChatLoading || !chatInput.trim()}
                className="!text-white shrink-0"
              >
                {isChatLoading ? (
                  <Loader className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sidebar */}
      <div className="lg:col-span-1 space-y-4">
        {/* Suggested questions */}
        <Card className="!shadow-none border border-gray-100 dark:border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Suggested questions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {SUGGESTED_QUESTIONS.map((q) => (
              <button
                key={q}
                onClick={() => {
                  setChatInput(q);
                  setActiveSection("chat");
                  handleSendChatWithMessage(q);
                }}
                className="w-full text-left text-xs px-3 py-2.5 rounded-lg border border-border bg-background hover:bg-muted hover:border-primary/30 transition-all text-muted-foreground hover:text-foreground cursor-pointer"
              >
                {q}
              </button>
            ))}
          </CardContent>
        </Card>

        {/* Chat history info */}
        <Card className="!shadow-none border border-gray-100 dark:border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Chat history</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground mb-3">
              {messages.length - 1} message
              {messages.length - 1 !== 1 ? "s" : ""} in this session
            </p>
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={() => setMessages([WELCOME_MESSAGE])}
            >
              Clear chat
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  return (
    <div className="w-full flex flex-col">
      <PageLayout
        addMarginTop={true}
        renderPageHeader={renderHeader}
        className="space-y-6"
      >
        {activeSection === "overview" && overviewSection}
        {activeSection === "forecast" && forecastSection}
        {activeSection === "chat" && chatSection}
      </PageLayout>
    </div>
  );
}
