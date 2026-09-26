"use client";

import React, { useState } from "react";
import { AIChatCard, MessageItem } from "@/components/ui/ai-chat-card";

export default function ChatDrawer() {
    const [messages, setMessages] = useState<MessageItem[]>([]);
    const [loading, setLoading] = useState(false);
import React, { useState, useRef, useEffect } from "react";
import { Copy, Check, Trash2, Send, Sparkles, Terminal, Code2, Zap, Shield, Bug, Cpu } from "lucide-react";

export interface MessageItem {
    id: string;
    sender: "user" | "ai";
    text: string;
    timestamp: string;
}

const STARTER_PRESETS = [
    { label: "⚡ Explain CORS & Preflight Requests", query: "Explain CORS and preflight HTTP requests in depth with standard code examples for frontend and backend headers." },
    { label: "🚀 How to optimize React re-renders", query: "How do I optimize React re-renders using useMemo, useCallback, and React.memo? Provide concrete code examples." },
    { label: "🛡️ SQL vs NoSQL Indexing Strategy", query: "What is the difference between SQL (B-Tree) and NoSQL (LSM Tree / Hash) indexing strategies for high throughput systems?" },
    { label: "🐛 Debug my async/await loop", query: "Why does my async/await loop execute sequentially instead of concurrently in JavaScript, and how do I fix it using Promise.all?" },
];

const INITIAL_WELCOME_MSG: MessageItem = {
    id: "welcome-1",
    sender: "ai",
    text: `### ⚡ Zenith 24/7 AI Technical Mentor\nWelcome back, Engineer! I am online and synced with your active learning roadmap.\n\nAsk me to **debug failing stack traces**, explain **system architecture trade-offs**, optimize **React performance**, or review **database indexing strategies**.`,
    timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
};

// Helper component to render formatted markdown text and code blocks cleanly
function FormattedMessage({ text }: { text: string }) {
    const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

    const handleCopy = (codeText: string, index: number) => {
        navigator.clipboard.writeText(codeText);
        setCopiedIndex(index);
        setTimeout(() => setCopiedIndex(null), 2000);
    };

    // Regex to split text by markdown code blocks ```lang ... ```
    const parts = text.split(/(```[\s\S]*?```)/g);

    return (
        <div className="flex flex-col gap-3 text-sm leading-relaxed font-sans">
            {parts.map((part, index) => {
                if (part.startsWith("```")) {
                    const lines = part.split("\n");
                    const lang = lines[0].replace("```", "").trim() || "code";
                    const code = lines.slice(1, -1).join("\n");

                    return (
                        <div key={index} className="my-2 rounded-xl overflow-hidden bg-slate-900 border border-indigo-500/30 shadow-lg">
                            <div className="flex items-center justify-between px-4 py-2 bg-slate-800/80 border-b border-indigo-500/20 text-xs text-slate-300 font-mono">
                                <span className="font-bold text-indigo-400 uppercase tracking-wider">{lang}</span>
                                <button
                                    onClick={() => handleCopy(code, index)}
                                    className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-indigo-900/50 hover:bg-indigo-800/80 text-indigo-200 hover:text-white transition-colors cursor-pointer text-xs font-semibold"
                                >
                                    {copiedIndex === index ? (
                                        <>
                                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                                            <span className="text-emerald-400 font-bold">Copied!</span>
                                        </>
                                    ) : (
                                        <>
                                            <Copy className="w-3.5 h-3.5" />
                                            <span>Copy Code</span>
                                        </>
                                    )}
                                </button>
                            </div>
                            <pre className="p-4 font-mono text-xs text-slate-200 overflow-x-auto leading-6 bg-slate-950/90">
                                <code>{code}</code>
                            </pre>
                        </div>
                    );
                }

                // Render regular text with simple markdown formatting (headings, bold, lists)
                const paragraphs = part.split("\n").filter((p) => p.trim() !== "");
                return (
                    <div key={index} className="flex flex-col gap-2">
                        {paragraphs.map((p, pIdx) => {
                            if (p.startsWith("### ")) {
                                return (
                                    <h3 key={pIdx} className="text-base font-extrabold text-indigo-300 mt-2 mb-1">
                                        {p.replace("### ", "")}
                                    </h3>
                                );
                            }
                            if (p.startsWith("## ")) {
                                return (
                                    <h2 key={pIdx} className="text-lg font-bold text-indigo-200 mt-2 mb-1">
                                        {p.replace("## ", "")}
                                    </h2>
                                );
                            }

                            // Format bold text **text** and inline code `code`
                            const formattedInline = p.split(/(\*\*.*?\*\*|`.*?`)/g).map((chunk, cIdx) => {
                                if (chunk.startsWith("**") && chunk.endsWith("**")) {
                                    return <strong key={cIdx} className="font-bold text-white">{chunk.slice(2, -2)}</strong>;
                                }
                                if (chunk.startsWith("`") && chunk.endsWith("`")) {
                                    return <code key={cIdx} className="px-1.5 py-0.5 rounded bg-indigo-950/80 text-indigo-300 font-mono text-xs border border-indigo-500/30">{chunk.slice(1, -1)}</code>;
                                }
                                return chunk;
                            });

                            return (
                                <p key={pIdx} className="text-slate-200 text-sm leading-relaxed">
                                    {formattedInline}
                                </p>
                            );
                        })}
                    </div>
                );
            })}
        </div>
    );
}

export default function ChatDrawer() {
    const [messages, setMessages] = useState<MessageItem[]>([INITIAL_WELCOME_MSG]);
    const [inputText, setInputText] = useState("");
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement | null>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

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
            const aiMsgText = data.reply || data.response || "Analysis completed.";

            const aiMsg: MessageItem = {
                id: `ai-${Date.now()}`,
                sender: "ai",
                text: data.reply || "No response returned.",
                text: aiMsgText,
                timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            };

            setMessages((prev) => [...prev, aiMsg]);
        } catch (err: unknown) {
            const errMsg = err instanceof Error ? err.message : "Failed to connect to Doubt Solver AI.";
            const errorMsgItem: MessageItem = {
                id: `error-${Date.now()}`,
                sender: "ai",
                text: `⚠️ Error: ${errMsg}`,
            const errMsg = err instanceof Error ? err.message : "Failed to generate response.";
            const errorMsgItem: MessageItem = {
                id: `error-${Date.now()}`,
                sender: "ai",
                text: `⚠️ **Error**: ${errMsg}. Please try sending your query again.`,
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
    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const clearHistory = () => {
        setMessages([INITIAL_WELCOME_MSG]);
    };

    return (
        <div className="w-full max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col gap-6 text-slate-100 font-sans">
            
            {/* Ambient Violet/Indigo Glow background */}
            <div className="fixed top-24 left-1/3 w-96 h-96 bg-indigo-600/10 rounded-full blur-[140px] pointer-events-none -z-10" />

            {/* Header Toolbar Card */}
            <div className="rounded-2xl bg-slate-900/80 backdrop-blur-md p-5 border border-indigo-500/20 shadow-[0_0_30px_rgba(99,102,241,0.1)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/25">
                        <Terminal className="w-5 h-5" />
                    </div>
                    <div>
                        <h1 className="text-xl font-extrabold text-white flex items-center gap-2">
                            <span>24/7 AI Technical Mentor</span>
                            <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold uppercase tracking-wider border border-emerald-500/30">
                                Active • Gemini 1.5 Flash
                            </span>
                        </h1>
                        <p className="text-xs text-slate-400 mt-0.5">
                            Senior Principal System Architect & Code Review Assistant
                        </p>
                    </div>
                </div>

                <button
                    onClick={clearHistory}
                    className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800/80 hover:bg-rose-600/20 hover:text-rose-300 text-slate-300 border border-slate-700/60 hover:border-rose-500/40 text-xs font-semibold transition-all cursor-pointer shadow-sm self-start sm:self-auto"
                >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Clear Conversation</span>
                </button>
            </div>

            {/* Quick Starter Preset Chips */}
            <div className="flex flex-col gap-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-400 uppercase tracking-wider">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Quick Starter Questions:</span>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                    {STARTER_PRESETS.map((preset, idx) => (
                        <button
                            key={idx}
                            onClick={() => handleSendMessage(preset.query)}
                            disabled={loading}
                            className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-white border border-indigo-500/20 hover:border-indigo-400/50 text-xs font-medium transition-all shadow-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <span>{preset.label}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Conversation Feed */}
            <div className="flex flex-col gap-5 min-h-[400px]">
                {messages.map((msg) => (
                    <div
                        key={msg.id}
                        className={`flex gap-3 w-full ${
                            msg.sender === "user" ? "justify-end self-end max-w-3xl" : "justify-start self-start max-w-4xl"
                        }`}
                    >
                        {msg.sender === "ai" && (
                            <div className="w-9 h-9 rounded-xl bg-indigo-950 border border-indigo-500/30 flex items-center justify-center shrink-0 text-indigo-400 shadow-md mt-1">
                                <Cpu className="w-4 h-4 text-indigo-400" />
                            </div>
                        )}

                        <div className="flex flex-col gap-1.5 flex-1">
                            <div className="flex items-center justify-between text-[11px] text-slate-400 px-1">
                                <span className="font-bold text-slate-300">
                                    {msg.sender === "user" ? "You" : "Zenith AI Mentor"}
                                </span>
                                <span>{msg.timestamp}</span>
                            </div>

                            <div
                                className={`rounded-2xl p-5 shadow-xl border ${
                                    msg.sender === "user"
                                        ? "bg-indigo-600/90 text-white border-indigo-400/40 rounded-tr-none"
                                        : "bg-slate-900/90 text-slate-100 border-indigo-500/20 backdrop-blur-md rounded-tl-none shadow-[0_0_20px_rgba(99,102,241,0.05)]"
                                }`}
                            >
                                <FormattedMessage text={msg.text} />
                            </div>
                        </div>

                        {msg.sender === "user" && (
                            <div className="w-9 h-9 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0 text-slate-200 font-bold text-xs shadow-md mt-1">
                                YOU
                            </div>
                        )}
                    </div>
                ))}

                {/* Typing Pulse Indicator */}
                {loading && (
                    <div className="flex gap-3 max-w-xl self-start animate-fadeIn">
                        <div className="w-9 h-9 rounded-xl bg-indigo-950 border border-indigo-500/30 flex items-center justify-center shrink-0 text-indigo-400">
                            <Sparkles className="w-4 h-4 animate-spin text-indigo-400" />
                        </div>
                        <div className="bg-slate-900/90 backdrop-blur-md border border-indigo-500/30 rounded-2xl rounded-tl-none p-4 text-xs font-semibold text-indigo-300 flex items-center gap-3 shadow-md">
                            <div className="flex items-center gap-1">
                                <div className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: "0ms" }} />
                                <div className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: "150ms" }} />
                                <div className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: "300ms" }} />
                            </div>
                            <span>Zenith AI Mentor is analyzing architecture and generating response...</span>
                        </div>
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            {/* Input Console */}
            <div className="sticky bottom-6 z-40 w-full mt-2">
                <div className="relative rounded-2xl bg-slate-900/95 backdrop-blur-xl p-3 shadow-2xl border border-indigo-500/30 focus-within:border-indigo-400 focus-within:ring-2 focus-within:ring-indigo-500/30 transition-all">
                    <textarea
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Ask a technical doubt, explain an error traceback, or request code optimization... (Press Enter to send)"
                        rows={3}
                        maxLength={4000}
                        disabled={loading}
                        className="w-full bg-transparent px-3 py-1.5 text-white placeholder:text-slate-500 text-sm focus:outline-none resize-none leading-relaxed font-sans border-0 disabled:opacity-50"
                    />

                    <div className="flex items-center justify-between gap-3 pt-2.5 px-2 border-t border-slate-800 text-xs">
                        <span className="text-slate-400 text-[11px]">
                            Press <kbd className="px-1.5 py-0.5 bg-slate-800 rounded border border-slate-700 font-mono text-slate-300">Enter</kbd> to send, <kbd className="px-1.5 py-0.5 bg-slate-800 rounded border border-slate-700 font-mono text-slate-300">Shift + Enter</kbd> for new line
                        </span>

                        <button
                            onClick={() => handleSendMessage()}
                            disabled={loading || !inputText.trim()}
                            className="inline-flex items-center justify-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-400 hover:to-violet-500 text-white font-bold text-xs transition-all shadow-lg shadow-indigo-500/25 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
                        >
                            <span>Send Query</span>
                            <Send className="w-3.5 h-3.5" />
                        </button>
                    </div>
                </div>
            </div>

        </div>
    );
}
