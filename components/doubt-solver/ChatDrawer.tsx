"use client";

import React, { useState, useRef, useEffect } from "react";

export interface MessageItem {
    id: string;
    sender: "user" | "ai";
    text: string;
    timestamp: string;
    codeSnippet?: string;
    codeLang?: string;
}

const STARTER_DRILLS = [
    { num: "#1", title: "Explain CORS & preflight requests with code example", color: "text-[#c0c1ff]" },
    { num: "#2", title: "How to optimize React re-renders with useMemo & memo", color: "text-[#c3f400]" },
    { num: "#3", title: "Difference between SQL and NoSQL indexing strategy", color: "text-[#ffb2ba]" },
    { num: "#4", title: "Debug my async/await promise handling error", color: "text-[#ffb4ab]" },
    { num: "#5", title: "Kafka vs RabbitMQ for order fulfillment pipeline", color: "text-[#c0c1ff]" },
];

const INITIAL_WELCOME_MSG: MessageItem = {
    id: "welcome-1",
    sender: "ai",
    text: `Welcome back, Engineer. I am synchronized with your active roadmap track. Submit failing code traces, request multi-region cloud topology reviews, or challenge me on algorithmic complexity edge cases.`,
    timestamp: "14:00 PM",
};

export default function ChatDrawer() {
    const [messages, setMessages] = useState<MessageItem[]>([
        INITIAL_WELCOME_MSG,
        {
            id: "demo-user-1",
            sender: "user",
            text: "Why is my Go worker pool deadlocking under high burst loads when using unbuffered channels?\nWe spawn 64 goroutines, and under 15k req/sec spikes the dispatcher hangs indefinitely on jobChan <- task.",
            timestamp: "14:02 PM",
        },
        {
            id: "demo-ai-1",
            sender: "ai",
            text: `Unbuffered channels in Go enforce synchronous handoffs: the sending goroutine blocks until an idle worker goroutine is executing a receive (\`<-jobChan\`). Under burst saturation, if all workers block on downstream I/O (e.g., PostgreSQL query pool or remote HTTP latency), the dispatcher goroutine halts, creating a head-of-line cascading pipeline deadlock.`,
            codeLang: "go",
            codeSnippet: `package main
import ("context", "sync")

// ROOT CAUSE: Unbuffered channel blocks dispatcher when workers stall
// jobChan := make(chan Task)

// ARCHITECT FIX: Bounded Buffer Ring + Non-blocking Drop / Backpressure
const MaxQueueCap = 1024
jobChan := make(chan Task, MaxQueueCap)

select {
case jobChan <- task:
    metrics.Incr("task.enqueued")
default:
    // Apply 429 Backpressure / Spill to Redis FIFO Queue
    return ErrDispatcherSaturated
}`,
            timestamp: "14:02 PM",
        },
    ]);

    const [inputText, setInputText] = useState("");
    const [loading, setLoading] = useState(false);
    const [activeFilter, setActiveFilter] = useState("All Inquiries");
    const [memoryActive, setMemoryActive] = useState(true);
    const [showRefModal, setShowRefModal] = useState(false);
    const [copiedId, setCopiedId] = useState<string | null>(null);

    const messagesEndRef = useRef<HTMLDivElement | null>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, loading]);

    const handleSendMessage = async (queryText?: string) => {
        const text = queryText || inputText;
        if (!text.trim() || loading) return;

        const userMsg: MessageItem = {
            id: `user-${Date.now()}`,
            sender: "user",
            text: text.trim(),
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        };

        setMessages((prev) => [...prev, userMsg]);
        if (!queryText) setInputText("");
        setLoading(true);

        try {
            const historyPayload = messages
                .filter((m) => m.id !== "welcome-1")
                .map((m) => ({
                    role: m.sender === "user" ? ("user" as const) : ("model" as const),
                    parts: [{ text: m.text }],
                }));

            const res = await fetch("/api/doubt-solver", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    message: text.trim(),
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
                text: data.reply || "Analysis completed.",
                timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            };

            setMessages((prev) => [...prev, aiMsg]);
        } catch (err: unknown) {
            const errMsg = err instanceof Error ? err.message : "Failed to generate answer.";
            const errorMsgItem: MessageItem = {
                id: `error-${Date.now()}`,
                sender: "ai",
                text: `⚠️ **Error**: ${errMsg}. Please try asking again.`,
                timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            };
            setMessages((prev) => [...prev, errorMsgItem]);
        } finally {
            setLoading(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const copyCode = (code: string, id: string) => {
        navigator.clipboard.writeText(code);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    const clearHistory = () => {
        setMessages([INITIAL_WELCOME_MSG]);
    };

    return (
        <div className="w-full max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-8 text-[#e2e2eb] font-sans antialiased">
            
            {/* Ambient Aurora Glow Background */}
            <div className="pointer-events-none fixed top-20 left-1/4 w-96 h-96 bg-[#c3f400]/10 rounded-full blur-[130px] -z-10" />

            {/* ==========================================
                1. TOP SECTION / SUB-HEADER CONTEXT HUB
                ========================================== */}
            <section className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 rounded-2xl bg-[#191b22] p-6 shadow-xl border border-white/5">
                <div className="flex flex-col gap-2">
                    <div className="flex flex-wrap items-center gap-2">
                        <span className="px-3 py-1 rounded-full bg-[#282a30] text-[#c3f400] text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-sm border border-[#c3f400]/20">
                            <span className="w-2 h-2 rounded-full bg-[#c3f400] animate-ping" />
                            Online • Context-Aware
                        </span>
                        <span className="px-3 py-1 rounded-full bg-[#1e1f26] text-[#c0c1ff] text-[10px] font-bold uppercase">
                            Low Latency Stream (14ms)
                        </span>
                        <span className="px-3 py-1 rounded-full bg-[#1e1f26] text-[#c4c9ac] text-[10px] font-bold uppercase">
                            Session #ZN-8842-ARCH
                        </span>
                    </div>

                    <div className="flex items-baseline gap-2 flex-wrap mt-1">
                        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">24/7 AI Technical Mentor</h1>
                        <span className="text-base sm:text-lg text-[#c4c9ac] font-normal">| Distributed Systems & Doubt Engine</span>
                    </div>

                    <p className="text-sm text-[#c4c9ac] max-w-2xl leading-relaxed">
                        Real-time interactive code debugging, concurrency conflict resolutions, and high-throughput architectural trade-offs powered by deep reasoning kernels.
                    </p>
                </div>

                {/* Controls Toolbar */}
                <div className="flex flex-wrap items-center gap-3 self-start xl:self-center">
                    {/* Model Switcher */}
                    <div className="relative">
                        <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#282a30] hover:bg-[#33343b] text-white text-xs font-semibold transition-all border border-white/5 cursor-pointer">
                            <span className="material-symbols-outlined text-[#c3f400] text-lg">neurology</span>
                            <span>Claude 3.7 Sonnet / Architecture Mode</span>
                            <span className="material-symbols-outlined text-base text-[#c4c9ac]">expand_more</span>
                        </button>
                    </div>

                    {/* Workspace Memory Toggle */}
                    <button
                        onClick={() => setMemoryActive(!memoryActive)}
                        className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer border ${
                            memoryActive
                                ? "bg-[#1e1f26] text-[#c3f400] border-[#c3f400]/40"
                                : "bg-[#191b22] text-[#c4c9ac] border-white/5 opacity-60"
                        }`}
                    >
                        <span className="material-symbols-outlined text-lg text-[#c3f400]">memory</span>
                        <span className="text-white">Memory:</span>
                        <span className="font-bold">{memoryActive ? "Workspace Active" : "Disabled"}</span>
                        <span className={`w-1.5 h-1.5 rounded-full ml-1 ${memoryActive ? "bg-[#c3f400]" : "bg-slate-600"}`} />
                    </button>

                    {/* Clear History */}
                    <button
                        onClick={clearHistory}
                        className="flex items-center justify-center w-10 h-10 rounded-xl bg-[#1e1f26] hover:bg-[#d4004b] text-white transition-all border border-white/5 cursor-pointer"
                        title="Clear Active Thread"
                    >
                        <span className="material-symbols-outlined text-xl">delete_sweep</span>
                    </button>

                    {/* Reference View Button */}
                    <button
                        onClick={() => setShowRefModal(true)}
                        className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#33343b] hover:bg-[#373940] text-white text-xs font-semibold transition-all cursor-pointer"
                    >
                        <span className="material-symbols-outlined text-lg">splitscreen</span>
                        <span>Ref View</span>
                    </button>
                </div>
            </section>

            {/* ==========================================
                2. MODE / TOPIC FILTER TABS
                ========================================== */}
            <section className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                <div className="flex items-center overflow-x-auto p-1.5 rounded-2xl bg-[#0c0e14] border border-white/5 gap-1.5 custom-scrollbar">
                    {["All Inquiries", "Code & Bug Tracebacks", "System Design & Architecture", "Interview Clarification", "Live Code Sandbox"].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveFilter(tab)}
                            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                                activeFilter === tab
                                    ? "bg-[#c3f400] text-[#283500] shadow-md"
                                    : "bg-[#0c0e14] text-[#c4c9ac] hover:text-white hover:bg-[#191b22]"
                            }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
                <div className="flex items-center gap-1.5 text-[#c4c9ac] text-xs font-mono shrink-0">
                    <span className="w-2 h-2 rounded-full bg-[#c3f400]" />
                    <span>GPU Sandbox: Go 1.23 • Node 22 • Rust 1.82</span>
                </div>
            </section>

            {/* ==========================================
                3. DIALOGUE AREA & CHAT STREAM
                ========================================== */}
            <section className="flex flex-col gap-6">
                
                {/* AI Welcome Card */}
                <div className="relative overflow-hidden rounded-2xl bg-[#1e1f26] p-6 lg:p-8 shadow-xl flex flex-col md:flex-row gap-6 border border-white/5">
                    <div className="w-14 h-14 rounded-2xl bg-[#282a30] flex items-center justify-center shrink-0 shadow-lg relative border border-[#c3f400]/30">
                        <span className="material-symbols-outlined text-[#c3f400] text-3xl">smart_toy</span>
                        <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-[#c3f400] flex items-center justify-center">
                            <span className="material-symbols-outlined text-[#283500] text-[10px] font-bold">bolt</span>
                        </span>
                    </div>

                    <div className="flex flex-col gap-4 flex-1">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <div className="flex items-center gap-2 flex-wrap">
                                <span className="text-base font-bold text-white">Zenith AI Technical Mentor</span>
                                <span className="px-2.5 py-0.5 rounded-full bg-[#282a30] text-[#c3f400] text-[10px] font-bold uppercase tracking-wider">
                                    Principal Architect Kernel
                                </span>
                            </div>
                            <span className="text-xs text-[#c4c9ac]">Initialized • Memory warm</span>
                        </div>

                        <p className="text-sm text-white leading-relaxed">
                            Welcome back, Engineer. I am synchronized with your active roadmap track. Submit failing code traces, request multi-region cloud topology reviews, or challenge me on algorithmic complexity edge cases.
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
                            <div className="p-4 rounded-xl bg-[#191b22] flex flex-col gap-1 border border-white/5">
                                <div className="flex items-center gap-1.5 text-[#ffb2ba] text-xs font-bold">
                                    <span className="material-symbols-outlined text-base">bug_report</span>
                                    <span>Debugging Code Errors</span>
                                </div>
                                <p className="text-xs text-[#c4c9ac] mt-1">
                                    Paste stack traces, memory leak profiler dumps, or race condition outputs.
                                </p>
                            </div>

                            <div className="p-4 rounded-xl bg-[#191b22] flex flex-col gap-1 border border-white/5">
                                <div className="flex items-center gap-1.5 text-[#c3f400] text-xs font-bold">
                                    <span className="material-symbols-outlined text-base">dns</span>
                                    <span>System Design & Arch</span>
                                </div>
                                <p className="text-xs text-[#c4c9ac] mt-1">
                                    Trade-offs between SQL/NoSQL, REST vs gRPC, Kafka vs RabbitMQ event queues.
                                </p>
                            </div>

                            <div className="p-4 rounded-xl bg-[#191b22] flex flex-col gap-1 border border-white/5">
                                <div className="flex items-center gap-1.5 text-[#c0c1ff] text-xs font-bold">
                                    <span className="material-symbols-outlined text-base">psychology</span>
                                    <span>Interview Deep-Dives</span>
                                </div>
                                <p className="text-xs text-[#c4c9ac] mt-1">
                                    Event loops, Go routine channel schedules, ACID boundaries, and React 19 reconciliation.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Active Chat Conversation Feed */}
                {messages.map((msg) => {
                    if (msg.id === "welcome-1") return null;

                    return (
                        <div
                            key={msg.id}
                            className={`flex gap-4 w-full ${msg.sender === "user" ? "justify-end self-end max-w-4xl" : "justify-start self-start max-w-5xl"}`}
                        >
                            {/* Avatar for AI */}
                            {msg.sender === "ai" && (
                                <div className="w-12 h-12 rounded-xl bg-[#282a30] flex items-center justify-center shrink-0 shadow-lg text-[#c3f400] mt-1 border border-[#c3f400]/30">
                                    <span className="material-symbols-outlined text-2xl">code_blocks</span>
                                </div>
                            )}

                            <div className="flex flex-col gap-2 flex-1">
                                {/* Header Metadata */}
                                <div className="flex items-center justify-between text-xs text-[#c4c9ac]">
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <span className="font-bold text-white">
                                            {msg.sender === "user" ? "Senior Systems Engineer" : "Zenith AI Technical Mentor"}
                                        </span>
                                        {msg.sender === "ai" && (
                                            <span className="px-2 py-0.5 rounded-full bg-[#33343b] text-[#c0c1ff] text-[10px] font-bold uppercase">
                                                Concurrency Architecture
                                            </span>
                                        )}
                                        <span className="text-[11px] text-[#c4c9ac]">{msg.timestamp}</span>
                                    </div>

                                    {msg.sender === "ai" && (
                                        <div className="flex items-center gap-1">
                                            <button className="w-7 h-7 rounded-lg bg-[#1e1f26] hover:bg-[#282a30] flex items-center justify-center text-[#c4c9ac] hover:text-white transition-colors cursor-pointer">
                                                <span className="material-symbols-outlined text-sm">bookmark_add</span>
                                            </button>
                                            <button className="w-7 h-7 rounded-lg bg-[#1e1f26] hover:bg-[#282a30] flex items-center justify-center text-[#c4c9ac] hover:text-[#c3f400] transition-colors cursor-pointer">
                                                <span className="material-symbols-outlined text-sm">thumb_up</span>
                                            </button>
                                        </div>
                                    )}
                                </div>

                                {/* Message Box */}
                                <div className={`rounded-2xl p-6 shadow-xl flex flex-col gap-4 text-sm leading-relaxed ${
                                    msg.sender === "user"
                                        ? "bg-[#282a30] text-white rounded-tr-none font-medium"
                                        : "bg-[#191b22] text-[#e2e2eb] rounded-tl-none border border-white/5"
                                }`}>
                                    <p className="whitespace-pre-wrap font-sans">{msg.text}</p>

                                    {/* Code Snippet Block (If available) */}
                                    {msg.codeSnippet && (
                                        <div className="rounded-xl overflow-hidden bg-[#0c0e14] shadow-2xl border border-white/10 mt-2">
                                            <div className="flex items-center justify-between px-4 py-2.5 bg-[#282a30]">
                                                <div className="flex items-center gap-2">
                                                    <span className="w-2.5 h-2.5 rounded-full bg-[#d4004b]" />
                                                    <span className="w-2.5 h-2.5 rounded-full bg-[#c3f400]" />
                                                    <span className="w-2.5 h-2.5 rounded-full bg-[#e1e0ff]" />
                                                    <span className="text-[11px] font-mono text-[#c4c9ac] uppercase font-bold ml-2">
                                                        pool_dispatcher.go
                                                    </span>
                                                </div>
                                                <button
                                                    onClick={() => copyCode(msg.codeSnippet!, msg.id)}
                                                    className="flex items-center gap-1 px-3 py-1 rounded bg-[#1e1f26] text-[#c4c9ac] hover:text-white text-xs font-mono transition-colors cursor-pointer"
                                                >
                                                    <span className="material-symbols-outlined text-xs">
                                                        {copiedId === msg.id ? "check" : "content_copy"}
                                                    </span>
                                                    <span>{copiedId === msg.id ? "Copied!" : "Copy Code"}</span>
                                                </button>
                                            </div>
                                            <pre className="p-4 font-mono text-xs text-slate-200 overflow-x-auto leading-6">
                                                <code>{msg.codeSnippet}</code>
                                            </pre>
                                        </div>
                                    )}

                                    {/* SVG Pipeline Topology Diagram (Shown for Architecture demo) */}
                                    {msg.id === "demo-ai-1" && (
                                        <div className="p-4 rounded-xl bg-[#1e1f26] flex flex-col gap-2 border border-white/5 mt-2">
                                            <div className="flex items-center justify-between text-xs">
                                                <span className="font-bold text-white flex items-center gap-1.5">
                                                    <span className="material-symbols-outlined text-base text-[#c3f400]">hub</span> Goroutine Channel Execution Topology
                                                </span>
                                                <span className="text-[#c3f400] font-bold text-[10px] uppercase tracking-wider">Zero Lock Contention Model</span>
                                            </div>
                                            <div className="w-full overflow-x-auto py-2">
                                                <svg className="w-full min-w-[580px] h-24 text-white" fill="none" viewBox="0 0 700 110">
                                                    <path d="M140 55 L210 55" stroke="currentColor" strokeDasharray="4 4" strokeOpacity="0.3" strokeWidth="2" />
                                                    <polygon fill="currentColor" fillOpacity="0.5" points="210,55 202,50 202,60" />
                                                    <path d="M430 55 L490 55" stroke="currentColor" strokeDasharray="4 4" strokeOpacity="0.3" strokeWidth="2" />
                                                    <polygon fill="currentColor" fillOpacity="0.5" points="490,55 482,50 482,60" />
                                                    <rect className="fill-[#282a30]" height="70" rx="10" width="130" x="10" y="20" />
                                                    <text fill="#FFFFFF" fontSize="12" fontWeight="700" textAnchor="middle" x="75" y="48">HTTP Ingest</text>
                                                    <text fill="#C4C9AC" fontSize="10" textAnchor="middle" x="75" y="68">15,000 req/s</text>
                                                    <rect className="fill-[#33343b]" height="80" rx="12" width="200" x="220" y="15" />
                                                    <circle cx="240" cy="35" fill="#C3F400" r="4" />
                                                    <text fill="#C3F400" fontSize="11" fontWeight="700" x="252" y="38">Bounded Ring Buffer</text>
                                                    <text fill="#E2E2EB" fontSize="13" fontWeight="700" textAnchor="middle" x="320" y="60">Cap: 1024 Tasks</text>
                                                    <text fill="#C4C9AC" fontSize="10" textAnchor="middle" x="320" y="78">Non-Blocking Fallback</text>
                                                    <rect className="fill-[#282a30]" height="90" rx="12" width="180" x="500" y="10" />
                                                    <text fill="#FFFFFF" fontSize="12" fontWeight="700" textAnchor="middle" x="590" y="34">Worker Fleet (x64)</text>
                                                    <rect className="fill-[#1e1f26]" height="18" rx="4" width="40" x="520" y="46" />
                                                    <text fill="#ABD600" fontSize="9" textAnchor="middle" x="540" y="59">W-01</text>
                                                    <rect className="fill-[#1e1f26]" height="18" rx="4" width="40" x="570" y="46" />
                                                    <text fill="#ABD600" fontSize="9" textAnchor="middle" x="590" y="59">W-02</text>
                                                    <rect className="fill-[#1e1f26]" height="18" rx="4" width="40" x="620" y="46" />
                                                    <text fill="#ABD600" fontSize="9" textAnchor="middle" x="640" y="59">W-64</text>
                                                    <text fill="#C4C9AC" fontSize="10" textAnchor="middle" x="590" y="85">Async Task Consumer</text>
                                                </svg>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* User Avatar */}
                            {msg.sender === "user" && (
                                <div className="w-10 h-10 rounded-full bg-[#33343b] flex items-center justify-center shrink-0 text-white font-bold text-xs shadow-md mt-1">
                                    ME
                                </div>
                            )}
                        </div>
                    );
                })}

                {/* Loading indicator */}
                {loading && (
                    <div className="flex gap-4 max-w-5xl self-start">
                        <div className="w-12 h-12 rounded-xl bg-[#282a30] flex items-center justify-center shrink-0 text-[#c3f400]">
                            <span className="material-symbols-outlined text-2xl animate-spin">progress_activity</span>
                        </div>
                        <div className="bg-[#191b22] border border-white/5 rounded-2xl rounded-tl-none p-5 text-xs text-[#c3f400] font-bold flex items-center gap-2">
                            <span>Zenith AI Technical Mentor is evaluating code & architecture...</span>
                        </div>
                    </div>
                )}

                <div ref={messagesEndRef} />
            </section>

            {/* ==========================================
                4. QUICK STARTER QUESTIONS / DRILLS
                ========================================== */}
            <section className="flex flex-col gap-2 pt-2">
                <div className="flex items-center gap-1.5 text-[#c3f400]">
                    <span className="material-symbols-outlined text-lg animate-pulse">bolt</span>
                    <h2 className="text-xs font-bold uppercase tracking-wider">QUICK STARTER QUESTIONS / RECENT ARCHITECT DRILLS</h2>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                    {STARTER_DRILLS.map((drill) => (
                        <button
                            key={drill.num}
                            onClick={() => handleSendMessage(drill.title)}
                            disabled={loading}
                            className="group flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#191b22] hover:bg-[#282a30] text-[#c4c9ac] hover:text-white text-xs font-semibold transition-all border border-white/5 cursor-pointer shadow-sm"
                        >
                            <span className={`${drill.color} font-bold`}>{drill.num}</span>
                            <span>{drill.title}</span>
                            <span className="material-symbols-outlined text-base text-[#c4c9ac] group-hover:text-[#c3f400] transition-colors">arrow_outward</span>
                        </button>
                    ))}
                </div>
            </section>

            {/* ==========================================
                5. RICH PROMPT INPUT CONSOLE (Pinned Composer)
                ========================================== */}
            <section className="sticky bottom-6 z-40 w-full mt-2">
                <div className="relative rounded-2xl bg-[#191b22]/95 backdrop-blur-xl p-2.5 shadow-2xl border border-white/10 focus-within:ring-2 focus-within:ring-[#c3f400] transition-all">
                    <div className="flex flex-col">
                        <textarea
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Ask any technical doubt, system design trade-off, or paste code snippet (Markdown & syntax supported)..."
                            rows={3}
                            className="w-full bg-transparent px-4 py-2 text-white placeholder:text-[#c4c9ac]/60 text-sm focus:outline-none resize-none leading-relaxed border-0 font-sans"
                        />

                        {/* Toolbar & Send Actions */}
                        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 px-2 border-t border-white/5 text-xs">
                            <div className="flex items-center gap-1 flex-wrap">
                                <button
                                    onClick={() => handleSendMessage("Explain CORS & preflight requests with code example")}
                                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg hover:bg-[#282a30] text-[#c4c9ac] hover:text-white transition-colors cursor-pointer"
                                >
                                    <span className="material-symbols-outlined text-base">attach_file</span>
                                    <span className="hidden sm:inline">Attach Code/Log</span>
                                </button>
                                <button
                                    onClick={() => handleSendMessage("How to optimize React re-renders with useMemo & memo")}
                                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg hover:bg-[#282a30] text-[#c4c9ac] hover:text-white transition-colors cursor-pointer"
                                >
                                    <span className="material-symbols-outlined text-base">code</span>
                                    <span className="hidden sm:inline">GitHub Gist</span>
                                </button>
                                <div className="h-4 w-px bg-white/10 mx-1 hidden sm:block" />
                                <span className="hidden lg:flex items-center gap-1 text-[#c4c9ac] text-xs">
                                    <span className="material-symbols-outlined text-sm text-[#c3f400]">check_circle</span>
                                    <span>Repo Context: <b>zenith-core/api</b> (24 files indexed)</span>
                                </span>
                            </div>

                            <div className="flex items-center gap-3">
                                <span className="hidden sm:inline-block text-[11px] uppercase tracking-wider text-[#c4c9ac] font-bold">
                                    ⌘ + ENTER to send
                                </span>
                                <button
                                    onClick={() => handleSendMessage()}
                                    disabled={loading || !inputText.trim()}
                                    className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full bg-[#c3f400] text-[#283500] font-bold text-xs hover:bg-[#abd600] transition-all shadow-[0_0_20px_-4px_rgba(195,244,0,0.5)] cursor-pointer disabled:opacity-40 disabled:pointer-events-none shrink-0"
                                >
                                    <span>Dispatch Query</span>
                                    <span className="material-symbols-outlined text-base">send</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Reference Inspector Modal (Ref View) */}
            {showRefModal && (
                <div className="fixed inset-0 z-50 bg-[#0c0e14]/80 backdrop-blur-md flex items-center justify-center p-4">
                    <div className="relative max-w-4xl w-full bg-[#191b22] border border-white/10 rounded-2xl p-6 shadow-2xl flex flex-col gap-4 text-white">
                        <div className="flex items-center justify-between border-b border-white/10 pb-3">
                            <div className="flex items-center gap-2">
                                <span className="material-symbols-outlined text-[#c3f400]">preview</span>
                                <h3 className="text-lg font-bold">Zenith System Architecture & Doubt Ref View</h3>
                            </div>
                            <button
                                onClick={() => setShowRefModal(false)}
                                className="w-8 h-8 rounded-full bg-[#282a30] text-[#c4c9ac] hover:text-white flex items-center justify-center font-bold text-xs cursor-pointer"
                            >
                                ✕
                            </button>
                        </div>
                        <div className="p-4 rounded-xl bg-[#0c0e14] border border-white/5 space-y-3 text-xs text-[#c4c9ac]">
                            <p className="text-white font-bold">Active System Context Parameters:</p>
                            <ul className="list-disc pl-5 space-y-1">
                                <li>Deep Reasoning Kernel: Claude 3.7 Sonnet / Architecture Mode</li>
                                <li>Concurrency Solver: Active Go Goroutine Channel Inspector</li>
                                <li>Memory Context: Active Repository Workspace Indexed</li>
                                <li>Live Execution Sandbox: Go 1.23 • Node 22 • Rust 1.82</li>
                            </ul>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}
