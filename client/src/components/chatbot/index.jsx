import React, { useState, useEffect, useRef } from "react";
import { Sparkles, X, MessageCircle, Send, Loader } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSendChatMessageMutation } from "@/features/chatbot/chatbotAPI";

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: "model",
      content: "Hi! I am your AI finance assistant. Ask me anything about your spending, savings, or budgets.",
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const [sendChatMessage] = useSendChatMessageMutation();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const handleSend = async (customMessage) => {
    const textToSend = customMessage || inputValue.trim();
    if (!textToSend || isLoading) return;

    const userMessage = {
      id: Date.now(),
      role: "user",
      content: textToSend,
      timestamp: new Date()
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    try {
      // Build conversation history from messages (last 8)
      const conversationHistory = messages.slice(-8).map(m => ({
        role: m.role,
        content: m.content
      }));

      const response = await sendChatMessage({
        message: textToSend,
        conversationHistory
      }).unwrap();

      if (response?.data?.reply) {
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now() + 1,
            role: "model",
            content: response.data.reply,
            timestamp: new Date()
          }
        ]);
      }
    } catch (error) {
      console.error("Chat error:", error);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          role: "model",
          content: "Sorry, I am having trouble connecting. Please try again.",
          timestamp: new Date()
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const suggestions = [
    "How much did I spend this month?",
    "Which category am I overspending on?",
    "How can I improve my savings?",
    "What is my biggest expense?",
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3 pointer-events-none">
      {/* Chat Window */}
      {isOpen && (
        <div className="w-[calc(100vw-3rem)] sm:w-96 h-[500px] max-h-[70vh] bg-background border border-border rounded-3xl shadow-2xl flex flex-col overflow-hidden pointer-events-auto animate-in fade-in slide-in-from-bottom-4 duration-300">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border bg-primary">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/10 ring-4 ring-white/5">
                <Sparkles className="h-5 w-5 text-white animate-pulse" />
              </div>
              <div>
                <p className="text-sm font-bold text-white tracking-tight">
                  Finance Assistant
                </p>
                <p className="text-[10px] text-white/70 font-medium uppercase tracking-widest">Powered by Gemini AI</p>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-xl transition-all"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-muted-foreground/10">
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "flex",
                  message.role === "user" ? "justify-end" : "justify-start"
                )}
              >
                <div
                  className={cn(
                    "max-w-[85%] rounded-2xl px-4 py-2.5 text-sm shadow-sm",
                    message.role === "user"
                      ? "bg-primary text-white rounded-tr-none font-medium"
                      : "bg-muted text-foreground rounded-tl-none border border-border/40"
                  )}
                >
                  {message.content}
                </div>
              </div>
            ))}

            {/* Loading Indicator */}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-muted rounded-2xl rounded-tl-none px-4 py-3 flex gap-1.5 shadow-sm border border-border/40">
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

            {/* Suggested Questions */}
            {messages.length === 1 && !isLoading && (
              <div className="space-y-2.5 mt-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
                <p className="text-[10px] text-muted-foreground px-1 font-bold uppercase tracking-widest">
                  Try asking:
                </p>
                <div className="grid grid-cols-1 gap-2">
                  {suggestions.map((s) => (
                    <button
                      key={s}
                      onClick={() => handleSend(s)}
                      className="w-full text-left text-xs px-4 py-2.5 rounded-xl border border-border bg-background hover:bg-muted/80 hover:border-primary/40 transition-all text-foreground font-medium shadow-sm hover:shadow-md active:scale-[0.98]"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 border-t border-border bg-muted/20 backdrop-blur-sm">
            <div className="flex gap-2">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                placeholder="Ask about your finances..."
                disabled={isLoading}
                className="flex-1 h-11 text-sm rounded-xl border-border bg-background shadow-inner"
              />
              <Button
                onClick={() => handleSend()}
                disabled={isLoading || !inputValue.trim()}
                size="icon"
                className={cn(
                  "h-11 w-11 shrink-0 rounded-xl !text-white transition-all shadow-lg active:scale-90",
                  inputValue.trim() ? "bg-primary" : "bg-muted text-muted-foreground"
                )}
              >
                {isLoading ? (
                  <Loader className="h-5 w-5 animate-spin" />
                ) : (
                  <Send className="h-5 w-5" />
                )}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Button */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className={cn(
          "w-16 h-16 rounded-[2rem] bg-primary shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-primary/20",
          "flex items-center justify-center pointer-events-auto",
          "hover:bg-primary/90 transition-all duration-300",
          "hover:scale-110 active:scale-95 group relative",
          isOpen ? "rotate-90 rounded-full" : "hover:rounded-[1.2rem]"
        )}
      >
        {!isOpen && (
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 border-2 border-background rounded-full animate-ping" />
        )}
        {!isOpen && (
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 border-2 border-background rounded-full" />
        )}
        
        {isOpen ? (
          <X className="h-7 w-7 text-white" />
        ) : (
          <MessageCircle className="h-7 w-7 text-white group-hover:animate-bounce" />
        )}
      </button>
    </div>
  );
};

export default ChatBot;
