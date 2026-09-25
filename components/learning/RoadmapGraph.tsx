"use client";

import React, { useState } from "react";

export interface TopicItem {
    title: string;
    description: string;
    drawerItems: {
        label1: string;
        val1: string;
        label2: string;
        val2: string;
        label3: string;
        val3: string;
    };
    youtubeSearchQuery: string;
}

export interface RoadmapPhase {
    phaseNum: number;
    phaseName: string;
    weeks: string;
    topics: TopicItem[];
}

const PRESET_DOMAINS = [
    "Full-Stack Web Engineering",
    "Backend & Microservices Architecture",
    "Frontend & UI Performance",
    "Data Structures & Algorithms",
    "System Design & Cloud Infrastructure",
];

const INITIAL_PHASES: RoadmapPhase[] = [
    {
        phaseNum: 1,
        phaseName: "Phase 1: Advanced Frontend & State Management",
        weeks: "Weeks 1–3",
        topics: [
            {
                title: "React 19 & Next.js App Router Paradigms",
                description: "Server Actions, streaming SSR, Suspense boundaries, useTransition mutations, and optimistic caching layers.",
                drawerItems: {
                    label1: "Key Architecture Skill",
                    val1: "Partial Prerendering (PPR) & React DOM Actions",
                    label2: "Recommended Deep-Dive",
                    val2: "Jack Herrington: React Server Components Masterclass (48m)",
                    label3: "Hands-on Challenge",
                    val3: "Build an optimistic feed with instant edge rollbacks",
                },
                youtubeSearchQuery: "Next.js 15 App Router Server Components tutorial",
            },
            {
                title: "Modern Web APIs & State Orchestration",
                description: "Master global state sync, optimistic UI state machines, WebSocket event loops, and WebAssembly audio/image modules.",
                drawerItems: {
                    label1: "State Machinery",
                    val1: "Zustand ephemeral state + TanStack Query cache invalidation",
                    label2: "Recommended Stream",
                    val2: "WebSockets at Scale: Distributed SocketIO via Redis PubSub",
                    label3: "Checklist Goal",
                    val3: "Implement zero-latency cursor collaborative canvas",
                },
                youtubeSearchQuery: "WebSockets Redis PubSub state synchronization tutorial",
            },
        ],
    },
    {
        phaseNum: 2,
        phaseName: "Phase 2: Backend Microservices & Data Persistence",
        weeks: "Weeks 4–6",
        topics: [
            {
                title: "API Protocols & High-Throughput Routing",
                description: "Design resilient RESTful API contracts, bidirectional gRPC schemas, typed GraphQL resolvers, and token bucket rate-limiting middleware.",
                drawerItems: {
                    label1: "Core Focus",
                    val1: "Protocol Buffers v3 & HTTP/2 Multiplexing in Go/Node",
                    label2: "Benchmark Lab",
                    val2: "50,000 req/sec benchmark: Express vs Fastify vs Gin-Gonic",
                    label3: "Production Checklist",
                    val3: "Implement Redis sliding-window algorithm for client throttling",
                },
                youtubeSearchQuery: "gRPC Protocol Buffers high throughput API tutorial",
            },
            {
                title: "Database Indexing & Caching Layer",
                description: "Optimize SQL query execution plans, PostgreSQL B-Tree & GIN indexes, Redis cache stampede patterns, and distributed ACID transactions.",
                drawerItems: {
                    label1: "Query Anatomy",
                    val1: "EXPLAIN (ANALYZE, BUFFERS) deep dive for nested sequential scans",
                    label2: "Video Course Module",
                    val2: "Hussein Nasser: Advanced Database Systems & Partitioning",
                    label3: "Interactive Sandbox",
                    val3: "Tune multi-column composite index under 10M rows workload",
                },
                youtubeSearchQuery: "PostgreSQL B-Tree indexing query performance tuning",
            },
        ],
    },
    {
        phaseNum: 3,
        phaseName: "Phase 3: System Resilience & CI/CD Production",
        weeks: "Weeks 7–8",
        topics: [
            {
                title: "Containerization & Cloud Deployment",
                description: "Build lightweight multi-stage Docker builds, configure Kubernetes orchestration pods with ingress, and automate zero-downtime CI/CD pipelines.",
                drawerItems: {
                    label1: "DevOps Foundation",
                    val1: "Alpine minimal layers + non-root security boundaries",
                    label2: "Walkthrough",
                    val2: "TechWorld with Nana: K8s ConfigMaps & Secret Vaults",
                    label3: "Live Exercise",
                    val3: "Deploy blue-green canary rollouts on GitHub Actions",
                },
                youtubeSearchQuery: "Docker Kubernetes CI CD GitHub Actions pipeline",
            },
            {
                title: "Distributed Tracing, Telemetry & Observability",
                description: "Implement OpenTelemetry distributed spans, Prometheus metric counters, Grafana SLI/SLA alerts, and automated Kubernetes health probing.",
                drawerItems: {
                    label1: "Observability Spec",
                    val1: "W3C TraceContext propagation across async message queues",
                    label2: "Target Tutorial",
                    val2: "OpenTelemetry in Production: Jaeger & Tempo collector setup",
                    label3: "Final Capstone",
                    val3: "Diagnose 99th percentile p99 latency spikes under synthetic load",
                },
                youtubeSearchQuery: "OpenTelemetry Jaeger Prometheus Grafana tracing tutorial",
            },
        ],
    },
];

interface RoadmapGraphProps {
    onOpenDoubtSolver?: () => void;
}

export default function RoadmapGraph({ onOpenDoubtSolver }: RoadmapGraphProps) {
    const [targetRole, setTargetRole] = useState("Full-Stack Web Engineering");
    const [activePreset, setActivePreset] = useState("Full-Stack Web Engineering");
    const [level, setLevel] = useState("mid");
    const [isGenerating, setIsGenerating] = useState(false);
    const [roadmapTitle, setRoadmapTitle] = useState("Full-Stack Web Engineering Roadmap");
    
    // Checked State mapping title -> boolean
    const [checkedState, setCheckedState] = useState<Record<string, boolean>>({
        "React 19 & Next.js App Router Paradigms": true,
    });

    // Expanded Drawers mapping title -> boolean
    const [expandedDrawers, setExpandedDrawers] = useState<Record<string, boolean>>({
        "React 19 & Next.js App Router Paradigms": true,
    });

    const toggleCheck = (title: string) => {
        setCheckedState((prev) => ({
            ...prev,
            [title]: !prev[title],
        }));
    };

    const toggleDrawer = (title: string) => {
        setExpandedDrawers((prev) => ({
            ...prev,
            [title]: !prev[title],
        }));
    };

    const handlePresetClick = (preset: string) => {
        setActivePreset(preset);
        setTargetRole(preset);
        setRoadmapTitle(`${preset} Roadmap`);
    };

    const handleGenerate = (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (!targetRole.trim()) return;

        setIsGenerating(true);
        setTimeout(() => {
            setIsGenerating(false);
            setRoadmapTitle(`${targetRole.trim()} Roadmap`);
        }, 700);
    };

    // Calculate total & completed topics
    const allTopics = INITIAL_PHASES.flatMap((p) => p.topics);
    const totalTopics = allTopics.length;
    const completedTopics = allTopics.filter((t) => checkedState[t.title]).length;
    const progressPercent = Math.round((completedTopics / totalTopics) * 100);

    return (
        <div className="w-full max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-8 text-[#e2e2eb] font-sans">
            
            {/* ==========================================
                GENERATOR CONSOLE / TOP CARD
                ========================================== */}
            <section className="relative w-full rounded-2xl bg-gradient-to-br from-[#1e1f26] via-[#191b22] to-[#0c0e14] p-6 lg:p-8 shadow-2xl overflow-hidden border border-white/10">
                {/* Glow ambient background accents */}
                <div className="absolute -top-32 -right-24 w-96 h-96 rounded-full bg-[#c3f400]/10 blur-3xl pointer-events-none" />
                <div className="absolute -bottom-24 -left-20 w-80 h-80 rounded-full bg-[#d4004b]/10 blur-3xl pointer-events-none" />

                <div className="relative z-10 flex flex-col gap-6">
                    {/* Header row with Progress Tracker widget */}
                    <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
                        <div className="flex flex-col gap-2 max-w-2xl">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#282a30]/80 text-[#c4c9ac] w-fit border border-white/5">
                                <span className="material-symbols-outlined text-base text-[#c3f400]">auto_awesome</span>
                                <span className="text-[11px] font-bold uppercase tracking-wider">AI Learning Roadmap Generator</span>
                            </div>
                            <h1 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-white mt-1">
                                Personalized Engineering Roadmap
                            </h1>
                            <p className="text-sm text-[#c4c9ac] leading-relaxed">
                                Enter your target engineering domain to generate an interactive node-by-node learning pathway complete with curated industry-grade tutorials, system design concepts, and actionable study notes.
                            </p>
                        </div>

                        {/* Progress Widget (Mirrored from app screenshot) */}
                        <div className="shrink-0 w-full lg:w-72 p-4 rounded-xl bg-[#0c0e14]/80 backdrop-blur-md shadow-inner flex flex-col gap-3 border border-white/5">
                            <div className="flex items-center justify-between text-xs font-semibold">
                                <span className="text-[#c4c9ac] uppercase tracking-wider">Overall Progress</span>
                                <span className="text-[#c3f400] font-bold font-mono">{progressPercent}%</span>
                            </div>
                            <div className="w-full h-2 rounded-full bg-[#33343b] overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-[#abd600] to-[#c3f400] rounded-full transition-all duration-500"
                                    style={{ width: `${progressPercent}%` }}
                                />
                            </div>
                            <div className="flex items-center justify-between text-xs">
                                <span className="text-[#c4c9ac]">{completedTopics} / {totalTopics} Topics Completed</span>
                                <span className="flex items-center gap-1 text-[#c3f400] font-bold text-[11px]">
                                    <span className="material-symbols-outlined text-[14px]">bolt</span> Active Track
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Inputs Row */}
                    <form onSubmit={handleGenerate} className="flex flex-col md:flex-row items-stretch gap-3 mt-1">
                        <div className="relative flex-1">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-[#c4c9ac] text-xl">terminal</span>
                            <input
                                type="text"
                                value={targetRole}
                                onChange={(e) => setTargetRole(e.target.value)}
                                placeholder="e.g. Distributed Systems, Kubernetes Platform Architect..."
                                className="w-full h-12 pl-11 pr-4 rounded-xl bg-[#0c0e14] text-white font-medium placeholder:text-[#c4c9ac]/50 focus:outline-none focus:ring-2 focus:ring-[#c3f400] transition-all shadow-inner text-sm"
                            />
                        </div>
                        <div className="relative min-w-[210px]">
                            <select
                                value={level}
                                onChange={(e) => setLevel(e.target.value)}
                                className="w-full h-12 pl-4 pr-10 rounded-xl bg-[#0c0e14] text-white font-medium appearance-none focus:outline-none focus:ring-2 focus:ring-[#c3f400] cursor-pointer transition-all text-sm border-0"
                            >
                                <option value="entry">Entry-Level (0-2 yrs)</option>
                                <option value="mid">Mid-Level (2-5 yrs)</option>
                                <option value="senior">Senior Engineer (5+ yrs)</option>
                                <option value="lead">Staff / Principal Architect</option>
                            </select>
                            <span className="absolute right-3.5 top-1/2 -translate-y-1/2 material-symbols-outlined text-[#c4c9ac] pointer-events-none text-xl">expand_more</span>
                        </div>
                        <button
                            type="submit"
                            disabled={isGenerating}
                            className="h-12 px-6 rounded-xl bg-gradient-to-r from-[#abd600] to-[#c3f400] text-[#283500] font-bold text-xs flex items-center justify-center gap-2 shadow-[0_0_24px_-4px_rgba(195,244,0,0.35)] hover:brightness-110 active:scale-[0.98] transition-all shrink-0 cursor-pointer"
                        >
                            <span className={`material-symbols-outlined text-lg ${isGenerating ? "animate-spin" : ""}`}>
                                {isGenerating ? "sync" : "magic_button"}
                            </span>
                            <span>{isGenerating ? "Synthesizing..." : "Generate"}</span>
                        </button>
                    </form>

                    {/* Presets Row */}
                    <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
                        <span className="text-[#c4c9ac] uppercase tracking-wider font-bold text-[11px] mr-1">Presets:</span>
                        {PRESET_DOMAINS.map((preset) => (
                            <button
                                key={preset}
                                onClick={() => handlePresetClick(preset)}
                                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
                                    activePreset === preset
                                        ? "bg-[#c3f400]/20 text-[#c3f400] border border-[#c3f400]/40 font-bold"
                                        : "bg-[#282a30]/60 text-[#c4c9ac] hover:text-white hover:bg-[#282a30]"
                                }`}
                            >
                                {preset}
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* Architect Study Note Banner */}
            <div className="w-full rounded-xl bg-[#0c0e14] p-4 flex items-start gap-3 shadow-md border border-white/5">
                <div className="w-8 h-8 rounded-lg bg-[#c3f400]/10 flex items-center justify-center shrink-0 text-[#c3f400]">
                    <span className="material-symbols-outlined text-xl">lightbulb</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 text-xs sm:text-sm">
                    <span className="font-bold text-[#c3f400] tracking-tight">Architect Study Note:</span>
                    <span className="text-slate-200">Keep heavy data fetching inside Server Components or edge workers to minimize JavaScript payload and optimize Interaction to Next Paint (INP).</span>
                </div>
            </div>

            {/* Active Roadmap Header */}
            <section className="flex flex-col gap-2 pt-2">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-[#282a30] flex items-center justify-center text-[#c3f400] shadow-sm">
                        <span className="material-symbols-outlined text-xl">layers</span>
                    </div>
                    <h2 className="text-2xl font-bold tracking-tight text-white">
                        {roadmapTitle}
                    </h2>
                </div>
                <p className="text-sm text-[#c4c9ac] max-w-4xl pl-12 leading-relaxed">
                    Master end-to-end web architecture from modern React component reconciliation to resilient distributed backend APIs, database indexing, and multi-region cloud deployment.
                </p>
            </section>

            {/* Roadmap Phases Timeline Stack */}
            <section className="flex flex-col gap-8">
                {INITIAL_PHASES.map((phase) => (
                    <div key={phase.phaseNum} className="flex flex-col gap-4">
                        {/* Phase Header */}
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-[#c3f400] text-[#283500] text-sm font-bold flex items-center justify-center shadow-[0_0_16px_rgba(195,244,0,0.3)]">
                                {phase.phaseNum}
                            </div>
                            <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-3">
                                <h3 className="text-lg font-bold text-white">
                                    {phase.phaseName}
                                </h3>
                                <span className="text-xs font-bold text-[#c3f400] flex items-center gap-1 uppercase tracking-wider">
                                    <span className="material-symbols-outlined text-sm">schedule</span> {phase.weeks}
                                </span>
                            </div>
                        </div>

                        {/* Phase Topic Cards */}
                        <div className="flex flex-col gap-3 pl-0 lg:pl-12">
                            {phase.topics.map((topic) => {
                                const isChecked = !!checkedState[topic.title];
                                const isExpanded = !!expandedDrawers[topic.title];

                                return (
                                    <div
                                        key={topic.title}
                                        className="topic-row rounded-2xl bg-[#1e1f26] p-4 lg:p-6 transition-all hover:bg-[#282a30] border border-white/5"
                                    >
                                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                            <div className="flex items-start gap-4">
                                                <button
                                                    onClick={() => toggleCheck(topic.title)}
                                                    className={`mt-0.5 w-6 h-6 rounded-full flex items-center justify-center shrink-0 transition-transform active:scale-90 cursor-pointer ${
                                                        isChecked
                                                            ? "bg-[#c3f400] text-[#283500]"
                                                            : "bg-[#33343b] text-transparent hover:ring-2 hover:ring-[#c3f400]"
                                                    }`}
                                                >
                                                    <span className="material-symbols-outlined text-base font-bold">check</span>
                                                </button>

                                                <div className="flex flex-col gap-1">
                                                    <div className="flex items-center gap-2 flex-wrap">
                                                        <h4 className={`text-base font-semibold text-white ${isChecked ? "line-through opacity-70" : ""}`}>
                                                            {topic.title}
                                                        </h4>
                                                        {isChecked && (
                                                            <span className="px-2 py-0.5 rounded-full bg-[#c3f400]/20 text-[#c3f400] text-[10px] font-bold uppercase">
                                                                COMPLETED
                                                            </span>
                                                        )}
                                                    </div>
                                                    <p className="text-xs text-[#c4c9ac] leading-relaxed">
                                                        {topic.description}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-3 self-end md:self-auto">
                                                <a
                                                    href={`https://www.youtube.com/results?search_query=${encodeURIComponent(topic.youtubeSearchQuery)}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="px-4 py-2 rounded-xl bg-[#d4004b]/20 text-[#ffb2ba] hover:bg-[#d4004b]/30 font-bold text-xs flex items-center gap-2 transition-all"
                                                >
                                                    <span className="material-symbols-outlined text-base text-[#ffb2ba]">smart_display</span>
                                                    <span>Watch Tutorial</span>
                                                </a>
                                                <button
                                                    onClick={() => toggleDrawer(topic.title)}
                                                    className="w-9 h-9 rounded-xl bg-[#33343b]/60 flex items-center justify-center text-[#c4c9ac] hover:text-white transition-transform cursor-pointer"
                                                >
                                                    <span className={`material-symbols-outlined text-xl transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}>
                                                        expand_more
                                                    </span>
                                                </button>
                                            </div>
                                        </div>

                                        {/* Expandable Drawer Content */}
                                        {isExpanded && (
                                            <div className="pt-4 mt-4 border-t border-white/5 grid grid-cols-1 md:grid-cols-3 gap-4">
                                                <div className="p-3 rounded-xl bg-[#0c0e14]/80 flex flex-col gap-1 border border-white/5">
                                                    <span className="text-[10px] font-bold uppercase text-[#c4c9ac]">
                                                        {topic.drawerItems.label1}
                                                    </span>
                                                    <span className="text-xs font-medium text-white">
                                                        {topic.drawerItems.val1}
                                                    </span>
                                                </div>
                                                <div className="p-3 rounded-xl bg-[#0c0e14]/80 flex flex-col gap-1 border border-white/5">
                                                    <span className="text-[10px] font-bold uppercase text-[#c4c9ac]">
                                                        {topic.drawerItems.label2}
                                                    </span>
                                                    <span className="text-xs font-medium text-white">
                                                        {topic.drawerItems.val2}
                                                    </span>
                                                </div>
                                                <div className="p-3 rounded-xl bg-[#0c0e14]/80 flex flex-col gap-1 border border-white/5">
                                                    <span className="text-[10px] font-bold uppercase text-[#c4c9ac]">
                                                        {topic.drawerItems.label3}
                                                    </span>
                                                    <span className="text-xs font-medium text-white">
                                                        {topic.drawerItems.val3}
                                                    </span>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </section>

            {/* Bottom Action Ribbon: Personalized Doubt Engine & Mock Hook */}
            <section className="rounded-2xl bg-[#191b22] p-6 lg:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl border border-white/10">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-[#c3f400]/20 text-[#c3f400] flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-3xl">psychology</span>
                    </div>
                    <div className="flex flex-col gap-0.5">
                        <h3 className="text-lg font-bold text-white">
                            Stuck on any concept in this roadmap?
                        </h3>
                        <p className="text-xs sm:text-sm text-[#c4c9ac]">
                            Ask Zenith Doubt Engine to break down algorithms with interactive visual step debuggers.
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-3 w-full md:w-auto">
                    <button
                        onClick={onOpenDoubtSolver}
                        className="w-full md:w-auto px-6 py-3 rounded-full bg-[#c3f400] text-[#283500] font-bold text-xs flex items-center justify-center gap-2 hover:bg-[#abd600] transition-all shadow-md cursor-pointer"
                    >
                        <span>Open Doubt Solver</span>
                        <span className="material-symbols-outlined text-base">arrow_forward</span>
                    </button>
                </div>
            </section>
        </div>
    );
}
