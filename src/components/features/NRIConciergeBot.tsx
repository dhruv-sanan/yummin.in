"use client";

import { useState, useRef, useEffect } from "react";
import { Send, X, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

interface Message {
    id: string;
    text: string;
    sender: "user" | "bot";
}

export function NRIConciergeBot() {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);

    const [messages, setMessages] = useState<Message[]>([
        {
            id: "1",
            text: "Hi! I’m your NRI Concierge Bot 👋 Visiting from abroad or out of town? I can help you with timings, pre-orders, and special cake requests.",
            sender: "bot",
        },
    ]);
    const [inputText, setInputText] = useState("");
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen]);

    const handleSend = () => {
        if (!inputText.trim()) return;

        const userMsg: Message = {
            id: Date.now().toString(),
            text: inputText,
            sender: "user",
        };

        setMessages((prev) => [...prev, userMsg]);
        setInputText("");

        // Simulate bot response
        setTimeout(() => {
            const botMsg: Message = {
                id: (Date.now() + 1).toString(),
                text: "Thanks for reaching out! A host will connect with you shortly. In the meantime, feel free to check our Menu.",
                sender: "bot",
            };
            setMessages((prev) => [...prev, botMsg]);
        }, 1000);
    };

    if (pathname === "/checkout") return null;

    return (
        <>
            {/* Trigger Button */}
            <button
                onClick={() => setIsOpen(true)}
                className={cn(
                    "fixed bottom-6 left-6 z-50 hidden md:flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
                    isOpen ? "hidden" : "flex"
                )}
                aria-label="Open Concierge Chat"
            >
                <Bot className="h-8 w-8" />
            </button>

            {/* Chat Window */}
            <div
                className={cn(
                    "fixed bottom-6 left-6 z-50 w-full max-w-[320px] transition-transform duration-300 ease-in-out md:max-w-[350px]",
                    isOpen ? "translate-y-0 opacity-100" : "translate-y-[20px] pointer-events-none opacity-0"
                )}
            >
                <Card className="border-2 border-primary/20 shadow-2xl">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 bg-primary p-4 text-primary-foreground">
                        <div className="flex items-center space-x-2">
                            <Bot className="h-5 w-5" />
                            <CardTitle className="text-sm font-bold">NRI Concierge</CardTitle>
                        </div>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-primary-foreground hover:bg-white/20"
                            onClick={() => setIsOpen(false)}
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    </CardHeader>
                    <CardContent className="h-[350px] flex flex-col p-0">
                        {/* Messages Area */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                            {messages.map((msg) => (
                                <div
                                    key={msg.id}
                                    className={cn(
                                        "flex w-max max-w-[80%] flex-col gap-2 rounded-lg px-3 py-2 text-sm",
                                        msg.sender === "user"
                                            ? "ml-auto bg-primary text-primary-foreground"
                                            : "bg-muted text-foreground"
                                    )}
                                >
                                    {msg.text}
                                </div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Area */}
                        <div className="border-t p-3 bg-secondary/20">
                            <form
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    handleSend();
                                }}
                                className="flex items-center space-x-2"
                            >
                                <Input
                                    value={inputText}
                                    placeholder="Ask something..."
                                    onChange={(e) => setInputText(e.target.value)}
                                    className="flex-1 h-9 bg-background focus-visible:ring-primary/50"
                                />
                                <Button type="submit" size="icon" className="h-9 w-9 shrink-0">
                                    <Send className="h-4 w-4" />
                                </Button>
                            </form>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}
