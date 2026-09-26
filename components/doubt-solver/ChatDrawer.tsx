"use client";

import React, { useState } from "react";
import { AIChatCard, MessageItem } from "@/components/ui/ai-chat-card";

export default function ChatDrawer() {
    const [messages, setMessages] = useState<MessageItem[]>([]);
    const [loading, setLoading] = useState(false);

    const handleSendMessage = async (userText: string) => {
        if (!userText || !userText.trim() || loading) return;

        const cleanText = userText.trim();
        const userMsg: MessageItem = {
            id: `user-${Date.now()}`,
            sender: "user",
            text: cleanText,
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        };

        setMessages((prev) => [...prev, userMsg]);
        setLoading(true);

        try {
            const historyPayload = messages.map((m) => ({
                role: m.sender === "user" ? ("user" as const) : ("model" as const),
                parts: [{ text: m.text }],
            }));

            const res = await fetch("/api/doubt-solver", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    message: cleanText,
                    history: historyPayload,
                }),
            });

            if (!res.ok) {
                const errData = await res.json().catch(() => ({}));
                throw new Error(errData.error || `Server error (${res.status})`);
            }

            const data = await res.json();
            const aiMsg: MessageItem = {
                id: `ai-${Date.now()}`,
                sender: "ai",
                text: data.reply || "No response returned.",
                timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            };

            setMessages((prev) => [...prev, aiMsg]);
        } catch (err: unknown) {
            const errMsg = err instanceof Error ? err.message : "Failed to connect to Doubt Solver AI.";
            const errorMsgItem: MessageItem = {
                id: `error-${Date.now()}`,
                sender: "ai",
                text: `⚠️ Error: ${errMsg}`,
                timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            };
            setMessages((prev) => [...prev, errorMsgItem]);
        } finally {
            setLoading(false);
        }
    };

    const handleReset = () => {
        setMessages([]);
    };

    return (
        <div className="w-full max-w-5xl xl:max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col items-center gap-6 text-[#e2e2eb] font-sans">
            {/* Single Unified Chatbot Card */}
            <div className="w-full">
                <AIChatCard
                    title="Doubt Solver"
                    subtitle="Ask any technical query, bug trace, or architectural trade-off"
                    greeting="Hello, Engineer!"
                    prompt="What technical doubt can I clear for you today?"
                    prompts={[
                        "How to optimize React re-renders with useMemo and memo?",
                        "Explain CORS preflight requests with code examples",
                        "Difference between SQL and NoSQL indexing strategies",
                        "Debug my async/await promise handling in Node.js",
                    ]}
                    messages={messages}
                    loading={loading}
                    onSend={handleSendMessage}
                    onReset={handleReset}
                    className="min-h-[540px]"
                />
            </div>
        </div>
    );
}
