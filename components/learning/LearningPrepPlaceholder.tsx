"use client";

import React from "react";
import { BookOpen, Sparkles, MapPin, ArrowRight, CheckCircle2 } from "lucide-react";

export default function LearningPrepPlaceholder() {
    return (
        <div className="w-full max-w-6xl mx-auto py-8 px-4 space-y-8">
            {/* Header Banner */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-950/80 via-slate-900 to-[#07090e] border border-[#c4f82a]/20 p-8 shadow-2xl">
                <div className="absolute top-0 right-0 w-96 h-96 bg-[#c4f82a]/10 rounded-full blur-3xl pointer-events-none" />
                <div className="relative z-10 space-y-3">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#c4f82a]/10 border border-[#c4f82a]/30 text-[#c4f82a] text-xs font-semibold">
                        <BookOpen className="w-3.5 h-3.5" />
                        <span>AI Learning Roadmap Engine</span>
                    </div>
                    <h2 className="text-3xl font-extrabold text-white tracking-tight">
                        Personalized Career & Skill Roadmaps
                    </h2>
                    <p className="text-slate-300 max-w-2xl text-sm leading-relaxed">
                        Input your target engineering domain or skill set, and let Gemini generate an interactive, node-by-node learning pathway with curated YouTube tutorials, docs, and milestone checks.
                    </p>
                </div>
            </div>

            {/* Quick Demo Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    {
                        title: "Frontend Engineering",
                        desc: "React 19, Next.js 15, Web Vitals, WebGL & State Sync",
                        nodes: 12,
                        level: "Junior -> Senior",
                        color: "from-[#c4f82a]/10 to-emerald-950/30 border-[#c4f82a]/30",
                    },
                    {
                        title: "Backend & Systems",
                        desc: "Distributed Systems, Microservices, DB Indexing, gRPC",
                        nodes: 16,
                        level: "Mid-Level",
                        color: "from-emerald-900/20 to-slate-900/40 border-emerald-500/30",
                    },
                    {
                        title: "DSA & System Design",
                        desc: "Trees, Dynamic Programming, Load Balancers, Sharding",
                        nodes: 14,
                        level: "All Levels",
                        color: "from-[#c4f82a]/15 to-slate-900/40 border-[#c4f82a]/20",
                    },
                ].map((item, idx) => (
                    <div
                        key={idx}
                        className={`rounded-2xl bg-gradient-to-b ${item.color} border p-6 flex flex-col justify-between space-y-4 hover:scale-[1.02] transition-all cursor-pointer`}
                    >
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-semibold text-[#c4f82a] font-mono">{item.level}</span>
                                <span className="text-[10px] bg-slate-900/80 px-2 py-0.5 rounded-full text-slate-300 border border-slate-700">
                                    {item.nodes} Milestones
                                </span>
                            </div>
                            <h3 className="text-lg font-bold text-white">{item.title}</h3>
                            <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
                        </div>
                        <div className="flex items-center justify-between text-xs font-semibold text-[#c4f82a] pt-2 border-t border-slate-800/60">
                            <span>Explore Roadmap</span>
                            <ArrowRight className="w-4 h-4" />
                        </div>
                    </div>
                ))}
            </div>

            {/* Feature Status Note */}
            <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#c4f82a]/10 border border-[#c4f82a]/30 flex items-center justify-center">
                        <Sparkles className="w-4 h-4 text-[#c4f82a]" />
                    </div>
                    <div>
                        <h4 className="text-sm font-bold text-white">Module 2 Integration Pending</h4>
                        <p className="text-xs text-slate-400">Structured JSON roadmap generator (`app/api/roadmap/route.ts`) will be wired next.</p>
                    </div>
                </div>
                <div className="flex items-center gap-2 text-xs text-[#c4f82a] font-mono">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Shell Mounted</span>
                </div>
            </div>
        </div>
    );
}
