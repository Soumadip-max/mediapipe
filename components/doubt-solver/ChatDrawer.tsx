"use client";

import React, { useState, useRef, useEffect } from "react";
import {
    MessageSquare,
    Send,
    Bot,
    User,
    Sparkles,
    Trash2,
    Copy,
    Check,
    Loader2,
    Zap,
    Code2,
    Terminal,
} from "lucide-react";

export interface MessageItem {
    id: string;
    sender: "user" | "ai";
    text: string;
    timestamp: string;
}

const STARTER_PRESETS = [
    "Explain CORS & preflight requests with code example",
    "How to optimize React re-renders with useMemo & memo",
    "Difference between SQL and NoSQL indexing strategy",
    "Debug my async/await promise handling error",
];

const INITIAL_WELCOME_MESSAGE: MessageItem = {
    id: "welcome-1",
    sender: "ai",
    text: `Hello! I am your **24/7 AI Technical Mentor & Principal Architect**.

I can help you with:
- 🐛 **Debugging Code Errors**: Paste your code snippets or error tracebacks.
- 🏗️ **System Design & Architecture**: Explain trade-offs between SQL/NoSQL, REST/gRPC, or caching strategies.
- 💡 **Interview Concept Clarification**: Drill deep into algorithms, React lifecycles, or backend design.

How can I assist you today?`,
    timestamp: "Just now",
};

export default function ChatDrawer() {
    const [messages, setMessages] = useState<MessageItem[]>([INITIAL_WELCOME_MESSAGE]);
    const [inputText, setInputText] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const [copiedCodeId, setCopiedCodeId] = useState<string | null>(null);
    const messagesEndRef = useRef<HTMLDivElement | null>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, loading]);

    const handleSendMessage = async (textToSend?: string) => {
        const query = textToSend || inputText;
        if (!query.trim() || loading) return;

        const userMsg: MessageItem = {
            id: `user-${Date.now()}`,
            sender: "user",
            text: query.trim(),
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        };

        setMessages((prev) => [...prev, userMsg]);
        if (!textToSend) setInputText("");
        setLoading(true);

        // Build history payload for Gemini API
        const historyPayload = messages
            .filter((m) => m.id !== "welcome-1")
            .map((m) => ({
                role: m.sender === "user" ? ("user" as const) : ("model" as const),
                parts: [{ text: m.text }],
            }));

        try {
            const res = await fetch("/api/doubt-solver", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    message: query.trim(),
                    history: historyPayload,
                }),
            });

            if (!res.ok) {
                const errorData = await res.json().catch(() => ({}));
                throw new Error(errorData.error || `Server error (${res.status})`);
            }

            const data = await res.json();
            const aiMsg: MessageItem = {
                id: `ai-${Date.now()}`,
                sender: "ai",
                text: data.reply || "No response received.",
                timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            };

            setMessages((prev) => [...prev, aiMsg]);
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : "Failed to get AI answer.";
            console.error("Error in Doubt Solver:", msg);
            const errorMsgItem: MessageItem = {
                id: `error-${Date.now()}`,
                sender: "ai",
                text: `⚠️ **Error**: ${msg}. Please try asking again.`,
                timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            };
            setMessages((prev) => [...prev, errorMsgItem]);
        } finally {
            setLoading(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const clearChat = () => {
        setMessages([INITIAL_WELCOME_MESSAGE]);
    };

    const copyCodeSnippet = (codeText: string, id: string) => {
        navigator.clipboard.writeText(codeText);
        setCopiedCodeId(id);
        setTimeout(() => setCopiedCodeId(null), 2000);
    };

    // Helper renderer for Markdown formatted text & code blocks
    const renderMarkdown = (content: string, msgId: string) => {
        // Split content by fenced code blocks ```
        const parts = content.split(/(```[\s\S]*?```)/g);

        return parts.map((part, pIdx) => {
            if (part.startsWith("```") && part.endsWith("```")) {
                const lines = part.slice(3, -3).trim().split("\n");
                let language = "code";
                let codeBody = part.slice(3, -3).trim();

                if (lines[0] && !lines[0].includes(" ") && lines[0].length < 15) {
                    language = lines[0].trim();
                    codeBody = lines.slice(1).join("\n");
                }

                const snippetId = `${msgId}-code-${pIdx}`;

                return (
                    <div key={pIdx} className="my-3 rounded-xl overflow-hidden bg-slate-950 border border-slate-800 shadow-lg">
                        <div className="flex items-center justify-between px-4 py-1.5 bg-slate-900 border-b border-slate-800 text-[11px] font-mono text-slate-400">
                            <span className="flex items-center gap-1.5">
                                <Terminal className="w-3.5 h-3.5 text-purple-400" />
                                <span>{language}</span>
                            </span>
                            <button
                                onClick={() => copyCodeSnippet(codeBody, snippetId)}
                                className="flex items-center gap-1 hover:text-purple-300 transition-colors text-[11px]"
                            >
                                {copiedCodeId === snippetId ? (
                                    <>
                                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                                        <span>Copied!</span>
                                    </>
                                ) : (
                                    <>
                                        <Copy className="w-3.5 h-3.5" />
                                        <span>Copy Code</span>
                                    </>
                                )}
                            </button>
                        </div>
                        <pre className="p-4 text-xs font-mono text-purple-200 overflow-x-auto leading-relaxed">
                            <code>{codeBody}</code>
                        </pre>
                    </div>
                );
            }

            // Standard Markdown paragraphs
            return (
                <div key={pIdx} className="space-y-2 whitespace-pre-wrap leading-relaxed text-xs md:text-sm">
                    {part}
                </div>
            );
        });
    };

    return (
        <div className="w-full max-w-5xl mx-auto py-6 px-4 space-y-6 flex flex-col h-[calc(100vh-140px)] min-h-[600px]">
            {/* Top Bar Header */}
            <div className="rounded-2xl bg-gradient-to-r from-purple-950 via-slate-900 to-indigo-950 border border-purple-500/20 p-4 px-6 flex items-center justify-between shadow-xl shrink-0">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center shadow-lg shadow-purple-500/10">
                        <Bot className="w-5 h-5 text-purple-400" />
                    </div>
                    <div>
                        <h2 className="text-base font-extrabold text-white flex items-center gap-2">
                            <span>24/7 AI Technical Mentor</span>
                            <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-mono font-semibold">
                                Online
                            </span>
                        </h2>
                        <p className="text-xs text-slate-400">Context-Aware Code & Architecture Doubt Solver</p>
                    </div>
                </div>

                <button
                    onClick={clearChat}
                    className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-rose-400 text-xs font-semibold transition-all flex items-center gap-1.5"
                    title="Clear Conversation History"
                >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Clear History</span>
                </button>
            </div>

            {/* Main Chat Thread Display */}
            <div className="flex-1 overflow-y-auto rounded-2xl bg-slate-900/80 border border-slate-800 p-4 md:p-6 space-y-4 shadow-inner custom-scrollbar">
                {messages.map((msg) => (
                    <div
                        key={msg.id}
                        className={`flex gap-3 ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                    >
                        {/* AI Avatar */}
                        {msg.sender === "ai" && (
                            <div className="w-8 h-8 rounded-xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center shrink-0 mt-1 shadow-md shadow-purple-500/10">
                                <Bot className="w-4 h-4 text-purple-400" />
                            </div>
                        )}

                        {/* Message Bubble */}
                        <div
                            className={`max-w-[85%] md:max-w-[75%] rounded-2xl p-4 shadow-md ${
                                msg.sender === "user"
                                    ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-tr-none"
                                    : "bg-slate-950 border border-slate-800 text-slate-200 rounded-tl-none space-y-2"
                            }`}
                        >
                            <div className="flex items-center justify-between text-[10px] opacity-70 pb-1 mb-1 border-b border-white/10 font-mono">
                                <span className="font-bold">
                                    {msg.sender === "user" ? "You" : "AI Technical Mentor"}
                                </span>
                                <span>{msg.timestamp}</span>
                            </div>

                            <div className="text-xs md:text-sm font-sans">
                                {renderMarkdown(msg.text, msg.id)}
                            </div>
                        </div>

                        {/* User Avatar */}
                        {msg.sender === "user" && (
                            <div className="w-8 h-8 rounded-xl bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center shrink-0 mt-1">
                                <User className="w-4 h-4 text-indigo-400" />
                            </div>
                        )}
                    </div>
                ))}

                {/* Loading Indicator */}
                {loading && (
                    <div className="flex gap-3 justify-start">
                        <div className="w-8 h-8 rounded-xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center shrink-0">
                            <Bot className="w-4 h-4 text-purple-400 animate-bounce" />
                        </div>
                        <div className="bg-slate-950 border border-slate-800 rounded-2xl rounded-tl-none p-4 text-xs text-purple-300 flex items-center gap-2">
                            <Loader2 className="w-4 h-4 animate-spin text-purple-400" />
                            <span>AI Mentor is thinking & analyzing code...</span>
                        </div>
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            {/* Quick Starter Presets */}
            {messages.length <= 2 && (
                <div className="space-y-2 shrink-0">
                    <span className="text-[11px] font-semibold text-slate-400 font-mono flex items-center gap-1">
                        <Zap className="w-3.5 h-3.5 text-amber-400" />
                        <span>QUICK STARTER QUESTIONS:</span>
                    </span>
                    <div className="flex flex-wrap gap-2">
                        {STARTER_PRESETS.map((preset, idx) => (
                            <button
                                key={idx}
                                onClick={() => handleSendMessage(preset)}
                                disabled={loading}
                                className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-purple-500/40 text-xs text-slate-300 hover:text-purple-300 transition-all text-left"
                            >
                                {preset}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Chat Input Bar */}
            <div className="relative shrink-0">
                <textarea
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Ask any technical doubt, system design question, or paste code snippet (Press Enter to send)..."
                    rows={2}
                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-3 pl-4 pr-14 text-xs md:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-purple-500/60 focus:ring-1 focus:ring-purple-500/30 transition-all resize-none font-sans"
                />

                <button
                    onClick={() => handleSendMessage()}
                    disabled={loading || !inputText.trim()}
                    className="absolute right-3 top-3 p-2.5 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-400 hover:to-indigo-500 active:scale-95 text-white transition-all shadow-md shadow-purple-500/20 disabled:opacity-40 disabled:pointer-events-none"
                    title="Send Message"
                >
                    <Send className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}
