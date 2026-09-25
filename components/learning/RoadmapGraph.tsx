"use client";

import React, { useState } from "react";
import {
    BookOpen,
    Sparkles,
    CheckCircle2,
    Circle,
    ChevronDown,
    ChevronUp,
    Lightbulb,
    Clock,
    Layers,
    ArrowRight,
    Loader2,
    RefreshCw,
} from "lucide-react";

const YoutubeIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
);

export interface TopicItem {
    title: string;
    description: string;
    keyConcepts: string[];
    youtubeSearchQuery: string;
    notes: string;
}

export interface RoadmapPhase {
    phaseName: string;
    weeks: string;
    topics: TopicItem[];
}

export interface RoadmapData {
    roleTitle: string;
    overview: string;
    phases: RoadmapPhase[];
}

const PRESET_DOMAINS = [
    "Full-Stack Web Engineering",
    "Backend & Microservices Architecture",
    "Frontend & UI Performance",
    "Data Structures & Algorithms",
    "System Design & Cloud Infrastructure",
];

const EXPERIENCE_LEVELS = [
    "Junior (0-2 yrs)",
    "Mid-Level (2-5 yrs)",
    "Senior / Lead (5+ yrs)",
];

const INITIAL_DEMO_ROADMAP: RoadmapData = {
    roleTitle: "Full-Stack Web Engineering Roadmap",
    overview:
        "Master end-to-end web architecture from modern React component reconciliation to resilient distributed backend APIs, database indexing, and cloud deployment.",
    phases: [
        {
            phaseName: "Phase 1: Advanced Frontend & State Management",
            weeks: "Weeks 1–3",
            topics: [
                {
                    title: "React 19 & Next.js App Router Paradigms",
                    description:
                        "Understand Server Components, Client Components, Server Actions, streaming SSR, and asset optimization.",
                    keyConcepts: ["Server Components", "Server Actions", "Streaming SSR", "Turbopack"],
                    youtubeSearchQuery: "Next js 15 App Router Server Components tutorial",
                    notes: "Keep heavy data fetching inside Server Components to minimize JS bundle size sent to the client.",
                },
                {
                    title: "Modern Web APIs & State Orchestration",
                    description:
                        "Master global state sync, optimism UI patterns, WebSockets, and WebAssembly integration.",
                    keyConcepts: ["Zustand / Redux Toolkit", "WebSockets", "Optimistic Updates", "WASM"],
                    youtubeSearchQuery: "React state management best practices Zustand WebSockets",
                    notes: "Use local component state for UI toggles and reserved global stores only for shared domain entities.",
                },
            ],
        },
        {
            phaseName: "Phase 2: Backend Microservices & Data Persistence",
            weeks: "Weeks 4–6",
            topics: [
                {
                    title: "API Protocols & High-Throughput Routing",
                    description:
                        "Design RESTful API contracts, gRPC schemas, GraphQL resolvers, and rate-limiting middleware.",
                    keyConcepts: ["gRPC vs REST", "GraphQL", "Rate Limiting", "JWT / OAuth2"],
                    youtubeSearchQuery: "Node js gRPC microservices backend architecture",
                    notes: "Implement strict payload schema validation (e.g. Zod) at the API gateway layer.",
                },
                {
                    title: "Database Indexing & Caching Layer",
                    description:
                        "Optimize SQL query execution plans, B-Tree indexes, Redis caching patterns, and ACID transactions.",
                    keyConcepts: ["B-Tree Indexes", "Redis Cache-Aside", "PostgreSQL EXPLAIN", "Database Transactions"],
                    youtubeSearchQuery: "PostgreSQL database indexing and performance tuning Redis",
                    notes: "Always run EXPLAIN ANALYZE on complex queries to verify index scans over costly sequential table scans.",
                },
            ],
        },
        {
            phaseName: "Phase 3: System Resilience & CI/CD Production",
            weeks: "Weeks 7–8",
            topics: [
                {
                    title: "Containerization & Cloud Deployment",
                    description:
                        "Build multi-stage Docker builds, Kubernetes orchestration, and automated CI/CD pipelines.",
                    keyConcepts: ["Docker Multi-Stage", "Kubernetes", "GitHub Actions", "Terraform"],
                    youtubeSearchQuery: "Docker Kubernetes CI CD pipeline GitHub Actions tutorial",
                    notes: "Use minimal base images (e.g. node:alpine) to keep container image sizes lean and secure.",
                },
            ],
        },
    ],
};

export default function RoadmapGraph() {
    const [interest, setInterest] = useState<string>("Full-Stack Web Engineering");
    const [level, setLevel] = useState<string>("Mid-Level (2-5 yrs)");
    const [loading, setLoading] = useState<boolean>(false);
    const [roadmap, setRoadmap] = useState<RoadmapData | null>(INITIAL_DEMO_ROADMAP);
    const [completedTopics, setCompletedTopics] = useState<Record<string, boolean>>({});
    const [expandedTopics, setExpandedTopics] = useState<Record<string, boolean>>({
        "React 19 & Next.js App Router Paradigms": true,
    });
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    const handleGenerate = async (targetInterest?: string) => {
        const queryDomain = targetInterest || interest;
        if (!queryDomain.trim()) return;

        setLoading(true);
        setErrorMsg(null);

        try {
            const res = await fetch("/api/roadmap", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ interest: queryDomain, level }),
            });

            if (!res.ok) {
                const errorData = await res.json().catch(() => ({}));
                throw new Error(errorData.error || `Server error (${res.status})`);
            }

            const data: RoadmapData = await res.json();
            if (data.phases && data.phases.length > 0) {
                setRoadmap(data);
                // Expand first topic by default
                if (data.phases[0]?.topics[0]?.title) {
                    setExpandedTopics({ [data.phases[0].topics[0].title]: true });
                }
            } else {
                throw new Error("Invalid roadmap structure returned.");
            }
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : "Failed to generate roadmap.";
            console.error("Error generating roadmap:", msg);
            setErrorMsg(msg);
        } finally {
            setLoading(false);
        }
    };

    const toggleTopicComplete = (title: string) => {
        setCompletedTopics((prev) => ({
            ...prev,
            [title]: !prev[title],
        }));
    };

    const toggleTopicExpand = (title: string) => {
        setExpandedTopics((prev) => ({
            ...prev,
            [title]: !prev[title],
        }));
    };

    // Calculate progress statistics
    const allTopics = roadmap ? roadmap.phases.flatMap((p) => p.topics) : [];
    const totalCount = allTopics.length;
    const completedCount = allTopics.filter((t) => completedTopics[t.title]).length;
    const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

    return (
        <div className="w-full max-w-6xl mx-auto py-6 px-4 space-y-8">
            {/* Header & Generator Controls */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-cyan-950 to-blue-950 border border-cyan-500/20 p-6 md:p-8 shadow-2xl">
                <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
                <div className="relative z-10 space-y-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="space-y-2">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-semibold">
                                <BookOpen className="w-3.5 h-3.5" />
                                <span>AI Learning Roadmap Generator</span>
                            </div>
                            <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
                                Personalized Engineering Roadmap
                            </h2>
                            <p className="text-slate-300 text-xs md:text-sm max-w-2xl leading-relaxed">
                                Enter your target engineering domain to generate an interactive node-by-node learning pathway complete with curated YouTube tutorials, key concepts, and study notes.
                            </p>
                        </div>

                        {/* Progress Meter */}
                        {roadmap && (
                            <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 min-w-[200px] space-y-2">
                                <div className="flex items-center justify-between text-xs">
                                    <span className="text-slate-400 font-semibold">Overall Progress</span>
                                    <span className="text-cyan-400 font-bold font-mono">{progressPercent}%</span>
                                </div>
                                <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden">
                                    <div
                                        className="bg-gradient-to-r from-cyan-500 to-emerald-400 h-full transition-all duration-500 rounded-full"
                                        style={{ width: `${progressPercent}%` }}
                                    />
                                </div>
                                <p className="text-[11px] text-slate-400 font-mono text-right">
                                    {completedCount} / {totalCount} Topics Completed
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Inputs */}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-3 pt-2">
                        <div className="md:col-span-7">
                            <input
                                type="text"
                                value={interest}
                                onChange={(e) => setInterest(e.target.value)}
                                placeholder="Enter role or domain (e.g. Backend Developer, System Design, DevOps)..."
                                className="w-full bg-slate-950/90 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/60 focus:ring-1 focus:ring-cyan-500/40 transition-all"
                            />
                        </div>

                        <div className="md:col-span-3">
                            <select
                                value={level}
                                onChange={(e) => setLevel(e.target.value)}
                                className="w-full bg-slate-950/90 border border-slate-800 rounded-xl px-3 py-3 text-sm text-slate-200 focus:outline-none focus:border-cyan-500/60 transition-all cursor-pointer"
                            >
                                {EXPERIENCE_LEVELS.map((lvl) => (
                                    <option key={lvl} value={lvl} className="bg-slate-900 text-white">
                                        {lvl}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="md:col-span-2">
                            <button
                                onClick={() => handleGenerate()}
                                disabled={loading || !interest.trim()}
                                className="w-full h-full py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 active:scale-95 text-slate-950 font-extrabold text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 disabled:opacity-50 disabled:pointer-events-none"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                                        <span>Generating...</span>
                                    </>
                                ) : (
                                    <>
                                        <Sparkles className="w-4 h-4 text-slate-950" />
                                        <span>Generate</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Quick Preset Buttons */}
                    <div className="flex flex-wrap items-center gap-2 pt-1">
                        <span className="text-xs text-slate-400 font-semibold mr-1">Presets:</span>
                        {PRESET_DOMAINS.map((domain) => (
                            <button
                                key={domain}
                                onClick={() => {
                                    setInterest(domain);
                                    handleGenerate(domain);
                                }}
                                disabled={loading}
                                className="px-3 py-1 rounded-lg bg-slate-900/80 hover:bg-slate-800 border border-slate-800 hover:border-cyan-500/40 text-xs text-slate-300 hover:text-cyan-300 transition-all"
                            >
                                {domain}
                            </button>
                        ))}
                    </div>

                    {/* Error Banner */}
                    {errorMsg && (
                        <div className="p-4 rounded-xl bg-rose-950/60 border border-rose-500/40 text-rose-300 text-xs flex items-center justify-between">
                            <span>{errorMsg}</span>
                            <button onClick={() => handleGenerate()} className="underline font-bold text-rose-200">
                                Retry
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Skeleton Loading State */}
            {loading && (
                <div className="space-y-6 animate-pulse">
                    <div className="h-12 bg-slate-900/80 rounded-2xl w-2/3" />
                    <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="h-32 bg-slate-900/60 rounded-2xl border border-slate-800" />
                        ))}
                    </div>
                </div>
            )}

            {/* Roadmap Content */}
            {!loading && roadmap && (
                <div className="space-y-8">
                    {/* Role Title & Overview */}
                    <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-6 space-y-2">
                        <h3 className="text-xl font-bold text-white flex items-center gap-2">
                            <Layers className="w-5 h-5 text-cyan-400" />
                            <span>{roadmap.roleTitle}</span>
                        </h3>
                        <p className="text-xs md:text-sm text-slate-300 leading-relaxed">{roadmap.overview}</p>
                    </div>

                    {/* Sequential Phases Timeline */}
                    <div className="space-y-8 relative">
                        {roadmap.phases.map((phase, phaseIdx) => (
                            <div key={phaseIdx} className="relative space-y-4">
                                {/* Phase Header */}
                                <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center font-bold text-slate-950 text-sm shadow-md shadow-cyan-500/20">
                                        {phaseIdx + 1}
                                    </div>
                                    <div>
                                        <h4 className="text-base font-bold text-white">{phase.phaseName}</h4>
                                        <div className="flex items-center gap-2 text-xs text-cyan-400 font-mono">
                                            <Clock className="w-3.5 h-3.5" />
                                            <span>{phase.weeks}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Phase Topics */}
                                <div className="ml-4 pl-6 border-l-2 border-slate-800 space-y-4">
                                    {phase.topics.map((topic, topicIdx) => {
                                        const isCompleted = !!completedTopics[topic.title];
                                        const isExpanded = !!expandedTopics[topic.title];

                                        return (
                                            <div
                                                key={topicIdx}
                                                className={`rounded-2xl border transition-all ${
                                                    isCompleted
                                                        ? "bg-slate-950/60 border-emerald-500/30 opacity-80"
                                                        : "bg-slate-900/90 border-slate-800 hover:border-cyan-500/30"
                                                }`}
                                            >
                                                {/* Topic Header Bar */}
                                                <div className="p-4 flex items-start md:items-center justify-between gap-4">
                                                    <div className="flex items-start md:items-center gap-3 flex-1">
                                                        <button
                                                            onClick={() => toggleTopicComplete(topic.title)}
                                                            className="mt-0.5 md:mt-0 text-slate-400 hover:text-emerald-400 transition-colors"
                                                            title={isCompleted ? "Mark incomplete" : "Mark completed"}
                                                        >
                                                            {isCompleted ? (
                                                                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                                                            ) : (
                                                                <Circle className="w-5 h-5" />
                                                            )}
                                                        </button>

                                                        <div className="space-y-1">
                                                            <h5
                                                                onClick={() => toggleTopicExpand(topic.title)}
                                                                className={`text-sm font-bold cursor-pointer transition-colors ${
                                                                    isCompleted
                                                                        ? "line-through text-slate-400"
                                                                        : "text-white hover:text-cyan-300"
                                                                }`}
                                                            >
                                                                {topic.title}
                                                            </h5>
                                                            <p className="text-xs text-slate-400 line-clamp-1">
                                                                {topic.description}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center gap-2">
                                                        {/* YouTube Tutorial Link */}
                                                        <a
                                                            href={`https://www.youtube.com/results?search_query=${encodeURIComponent(
                                                                topic.youtubeSearchQuery
                                                            )}`}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-300 hover:text-rose-200 text-xs font-semibold transition-all"
                                                        >
                                                            <YoutubeIcon className="w-3.5 h-3.5 text-rose-400" />
                                                            <span>Watch Tutorial</span>
                                                        </a>

                                                        {/* Expand Toggle Button */}
                                                        <button
                                                            onClick={() => toggleTopicExpand(topic.title)}
                                                            className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
                                                        >
                                                            {isExpanded ? (
                                                                <ChevronUp className="w-4 h-4" />
                                                            ) : (
                                                                <ChevronDown className="w-4 h-4" />
                                                            )}
                                                        </button>
                                                    </div>
                                                </div>

                                                {/* Expanded Details */}
                                                {isExpanded && (
                                                    <div className="px-4 pb-4 pt-2 border-t border-slate-800/80 space-y-4">
                                                        {/* Full Description */}
                                                        <p className="text-xs text-slate-300 leading-relaxed">
                                                            {topic.description}
                                                        </p>

                                                        {/* Key Concepts Pills */}
                                                        {topic.keyConcepts && topic.keyConcepts.length > 0 && (
                                                            <div className="space-y-1.5">
                                                                <span className="text-[11px] font-semibold text-slate-400 font-mono">
                                                                    KEY CONCEPTS TO MASTER:
                                                                </span>
                                                                <div className="flex flex-wrap gap-1.5">
                                                                    {topic.keyConcepts.map((concept, cIdx) => (
                                                                        <span
                                                                            key={cIdx}
                                                                            className="px-2.5 py-0.5 rounded-md bg-slate-950 border border-slate-800 text-cyan-300 font-mono text-[11px]"
                                                                        >
                                                                            {concept}
                                                                        </span>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        )}

                                                        {/* Study Notes Box */}
                                                        {topic.notes && (
                                                            <div className="p-3.5 rounded-xl bg-slate-950 border border-amber-500/20 text-xs text-slate-300 flex items-start gap-2.5">
                                                                <Lightbulb className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                                                                <div>
                                                                    <span className="font-bold text-amber-400">Architect Study Note: </span>
                                                                    <span>{topic.notes}</span>
                                                                </div>
                                                            </div>
                                                        )}

                                                        {/* Mobile YouTube Button */}
                                                        <div className="sm:hidden pt-1">
                                                            <a
                                                                href={`https://www.youtube.com/results?search_query=${encodeURIComponent(
                                                                    topic.youtubeSearchQuery
                                                                )}`}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="flex items-center justify-center gap-2 w-full py-2 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-semibold"
                                                            >
                                                                <YoutubeIcon className="w-4 h-4 text-rose-400" />
                                                                <span>Watch YouTube Tutorial</span>
                                                            </a>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
