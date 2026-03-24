import React, { useState, useRef, useEffect } from "react";
import { MessageSquareText, X, Send, Bot, User, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useGetFinancialAdviceMutation } from "@/features/ai/aiAPI";

const AiAdvisor = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [input, setInput] = useState("");
    const [messages, setMessages] = useState([
        { role: "ai", text: "Hi! I'm your AI Financial Advisor. Based on your recent spending, how can I help you save today?" }
    ]);
    const scrollRef = useRef(null);
    const [getAdvice, { isLoading }] = useGetFinancialAdviceMutation();

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isOpen]);

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;
        
        const userQuery = input.trim();
        setInput("");
        setMessages(prev => [...prev, { role: "user", text: userQuery }]);

        try {
            const response = await getAdvice(userQuery).unwrap();
            setMessages(prev => [...prev, { role: "ai", text: response.data.advice }]);
        } catch (error) {
            console.error("Failed to get advice:", error);
            setMessages(prev => [...prev, { role: "ai", text: "Sorry, I'm having trouble connecting to my financial database right now. Please try again later." }]);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const handleSuggestion = (suggestion) => {
        setInput(suggestion);
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
            {isOpen && (
                <div className="bg-background border rounded-lg shadow-xl mb-4 w-[350px] sm:w-[400px] h-[500px] flex flex-col overflow-hidden animate-in slide-in-from-bottom-5">
                    {/* Header */}
                    <div className="bg-primary text-primary-foreground p-4 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Sparkles className="h-5 w-5" />
                            <h3 className="font-semibold text-sm">AI Financial Advisor</h3>
                        </div>
                        <Button variant="ghost" size="icon" className="h-6 w-6 rounded-full hover:bg-primary/20" onClick={() => setIsOpen(false)}>
                            <X className="h-4 w-4" />
                        </Button>
                    </div>

                    {/* Chat Area */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4" ref={scrollRef}>
                        {messages.map((msg, idx) => (
                            <div key={idx} className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
                                <div className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center ${msg.role === "user" ? "bg-muted" : "bg-primary text-primary-foreground"}`}>
                                    {msg.role === "user" ? <User className="h-4 w-4 text-muted-foreground" /> : <Bot className="h-4 w-4" />}
                                </div>
                                <div className={`text-sm py-2 px-3 rounded-2xl max-w-[80%] ${msg.role === "user" ? "bg-muted text-foreground rounded-tr-none" : "bg-primary/10 text-foreground rounded-tl-none whitespace-pre-wrap"}`}>
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex gap-3">
                                <div className="flex-shrink-0 h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                                    <Bot className="h-4 w-4" />
                                </div>
                                <div className="bg-primary/10 py-3 px-4 rounded-2xl rounded-tl-none flex gap-1 items-center">
                                    <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce"></span>
                                    <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce delay-100"></span>
                                    <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce delay-200"></span>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Suggestions */}
                    {messages.length === 1 && (
                        <div className="px-4 pb-2 flex flex-wrap gap-2">
                            <button onClick={() => handleSuggestion("Analyze my recent spending")} className="text-[10px] bg-muted/50 hover:bg-muted border px-2 py-1 rounded-full transition-colors">Analyze my spending</button>
                            <button onClick={() => handleSuggestion("Where can I save ₹1000?")} className="text-[10px] bg-muted/50 hover:bg-muted border px-2 py-1 rounded-full transition-colors">Where can I save ₹1000?</button>
                            <button onClick={() => handleSuggestion("Am I over budget?")} className="text-[10px] bg-muted/50 hover:bg-muted border px-2 py-1 rounded-full transition-colors">Am I over budget?</button>
                        </div>
                    )}

                    {/* Input Area */}
                    <div className="p-3 border-t bg-muted/30">
                        <div className="relative">
                            <textarea
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="Ask about your finances..."
                                className="w-full resize-none rounded-2xl border bg-background px-4 py-3 pr-12 text-sm focus:outline-none focus:ring-1 focus:ring-primary shadow-sm"
                                rows={1}
                            />
                            <Button 
                                size="icon" 
                                className="absolute right-2 bottom-2 h-8 w-8 rounded-full" 
                                disabled={!input.trim() || isLoading}
                                onClick={handleSend}
                            >
                                <Send className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </div>
            )}
            
            <Button 
                onClick={() => setIsOpen(!isOpen)} 
                className={`h-14 w-14 rounded-full shadow-2xl transition-transform duration-300 ${isOpen ? 'scale-0 opacity-0' : 'scale-100 opacity-100'}`}
                size="icon"
            >
                <MessageSquareText className="h-6 w-6" />
            </Button>
        </div>
    );
};

export default AiAdvisor;
