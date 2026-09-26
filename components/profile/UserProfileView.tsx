"use client";

import React, { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { Trophy, Award, CheckCircle2, AlertTriangle, Share2, Copy, Check, Sparkles, User, Shield, Target, BookOpen, Briefcase, MessageSquare } from "lucide-react";
import { DEFAULT_METRICS, calculateCandidateEvaluation, formatShareableCandidateCard } from "@/lib/profile/evaluator";

interface UserProfileViewProps {
    onNavigateTab?: (tab: "learning" | "job-prep" | "doubt-solver") => void;
}

export default function UserProfileView({ onNavigateTab }: UserProfileViewProps) {
    const { user } = useUser();
    const [copied, setCopied] = useState(false);
    const [targetRole, setTargetRole] = useState("Staff / Senior Full-Stack Engineer");

    // Dynamic metrics computation
    const evaluation = calculateCandidateEvaluation(DEFAULT_METRICS);

    const displayName = user?.fullName || user?.firstName || "Candidate Engineer";
    const displayEmail = user?.primaryEmailAddress?.emailAddress || "candidate@zenith.ai";
    const displayAvatar = user?.imageUrl;

    const handleCopyReport = () => {
        const text = formatShareableCandidateCard(displayName, targetRole, evaluation);
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
    };

    return (
        <div className="w-full max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-8 text-slate-100 font-sans">
            
            {/* Ambient Aurora Glow Accent */}
            <div className="fixed top-20 left-1/3 w-[500px] h-[500px] bg-[#c3f400]/10 rounded-full blur-[160px] pointer-events-none -z-10" />

            {/* ==========================================
                1. HEADER BANNER CARD
                ========================================== */}
            <section className={`relative rounded-3xl bg-gradient-to-br ${evaluation.rank.bgGradient} bg-[#191b22]/90 backdrop-blur-xl p-6 lg:p-8 border ${evaluation.rank.borderColor} shadow-2xl overflow-hidden flex flex-col lg:flex-row lg:items-center justify-between gap-6`}>
                
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 z-10">
                    {/* User Avatar */}
                    {displayAvatar ? (
                        <img
                            src={displayAvatar}
                            alt={displayName}
                            className="w-20 h-20 rounded-2xl border-2 border-white/20 object-cover shadow-xl shrink-0"
                        />
                    ) : (
                        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 border-2 border-white/20 flex items-center justify-center text-white shadow-xl shrink-0">
                            <User className="w-10 h-10" />
                        </div>
                    )}

                    <div className="flex flex-col gap-1.5">
                        <div className="flex items-center gap-3 flex-wrap">
                            <h1 className="text-2xl lg:text-3xl font-extrabold text-white tracking-tight">
                                {displayName}
                            </h1>
                            <span className={`px-3.5 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider bg-slate-900/80 border border-white/10 ${evaluation.rank.color} flex items-center gap-1.5 shadow-md`}>
                                <Trophy className="w-3.5 h-3.5" />
                                {evaluation.rank.badge}
                            </span>
                        </div>

                        <div className="flex items-center gap-4 text-xs text-slate-300 flex-wrap">
                            <span className="flex items-center gap-1">
                                <span className="text-slate-400">Email:</span>
                                <span className="font-semibold text-white">{displayEmail}</span>
                            </span>
                            <span className="text-slate-600">•</span>
                            <span className="flex items-center gap-1">
                                <span className="text-slate-400">Target Role:</span>
                                <span className="font-bold text-[#c3f400]">{targetRole}</span>
                            </span>
                        </div>
                    </div>
                </div>

                {/* Right side actions & overall score badge */}
                <div className="flex items-center gap-4 z-10 self-start lg:self-center">
                    <div className="flex flex-col items-end">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                            Overall Readiness
                        </span>
                        <div className="flex items-baseline gap-1">
                            <span className="text-4xl lg:text-5xl font-black text-white">
                                {evaluation.overallScore}%
                            </span>
                            <span className="text-xs font-bold text-[#c3f400]">/ 100%</span>
                        </div>
                    </div>

                    <button
                        onClick={handleCopyReport}
                        className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-[#c3f400] hover:bg-[#abd600] text-[#283500] font-bold text-xs transition-all shadow-[0_0_25px_-4px_rgba(195,244,0,0.5)] cursor-pointer active:scale-95"
                    >
                        {copied ? <Check className="w-4 h-4 text-[#283500]" /> : <Share2 className="w-4 h-4" />}
                        <span>{copied ? "Report Copied!" : "Copy Shareable Card"}</span>
                    </button>
                </div>
            </section>

            {/* ==========================================
                2. READINESS BREAKDOWN GAUGES
                ========================================== */}
            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                
                {/* 1. Roadmap Progress */}
                <div className="rounded-2xl bg-[#191b22] p-5 border border-white/5 flex flex-col gap-3 shadow-lg hover:border-[#c3f400]/30 transition-all group">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                            <BookOpen className="w-4 h-4 text-[#c3f400]" />
                            Roadmap Execution
                        </span>
                        <span className="text-xs font-bold text-[#c3f400] bg-[#c3f400]/10 px-2 py-0.5 rounded-full">
                            25% Weight
                        </span>
                    </div>
                    <div className="flex items-baseline justify-between mt-1">
                        <span className="text-3xl font-extrabold text-white">
                            {DEFAULT_METRICS.roadmapProgress}%
                        </span>
                        <span className="text-xs text-slate-400 font-mono">
                            {evaluation.breakdown.roadmapWeighted}/25 pts
                        </span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-[#abd600] to-[#c3f400] rounded-full transition-all duration-500"
                            style={{ width: `${DEFAULT_METRICS.roadmapProgress}%` }}
                        />
                    </div>
                </div>

                {/* 2. ATS Resume Score */}
                <div className="rounded-2xl bg-[#191b22] p-5 border border-white/5 flex flex-col gap-3 shadow-lg hover:border-indigo-500/30 transition-all group">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                            <Briefcase className="w-4 h-4 text-indigo-400" />
                            ATS Compatibility
                        </span>
                        <span className="text-xs font-bold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-full">
                            25% Weight
                        </span>
                    </div>
                    <div className="flex items-baseline justify-between mt-1">
                        <span className="text-3xl font-extrabold text-white">
                            {DEFAULT_METRICS.atsScore}%
                        </span>
                        <span className="text-xs text-slate-400 font-mono">
                            {evaluation.breakdown.atsWeighted}/25 pts
                        </span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full transition-all duration-500"
                            style={{ width: `${DEFAULT_METRICS.atsScore}%` }}
                        />
                    </div>
                </div>

                {/* 3. AI Mock Interview Performance */}
                <div className="rounded-2xl bg-[#191b22] p-5 border border-white/5 flex flex-col gap-3 shadow-lg hover:border-emerald-500/30 transition-all group">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                            <Target className="w-4 h-4 text-emerald-400" />
                            Interview Studio
                        </span>
                        <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                            30% Weight
                        </span>
                    </div>
                    <div className="flex items-baseline justify-between mt-1">
                        <span className="text-3xl font-extrabold text-white">
                            {DEFAULT_METRICS.interviewScore}%
                        </span>
                        <span className="text-xs text-slate-400 font-mono">
                            {evaluation.breakdown.interviewWeighted}/30 pts
                        </span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-500"
                            style={{ width: `${DEFAULT_METRICS.interviewScore}%` }}
                        />
                    </div>
                </div>

                {/* 4. Doubt Solver Engagement */}
                <div className="rounded-2xl bg-[#191b22] p-5 border border-white/5 flex flex-col gap-3 shadow-lg hover:border-amber-500/30 transition-all group">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                            <MessageSquare className="w-4 h-4 text-amber-400" />
                            Doubt Solver
                        </span>
                        <span className="text-xs font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full">
                            20% Weight
                        </span>
                    </div>
                    <div className="flex items-baseline justify-between mt-1">
                        <span className="text-3xl font-extrabold text-white">
                            {DEFAULT_METRICS.doubtEngagement}%
                        </span>
                        <span className="text-xs text-slate-400 font-mono">
                            {evaluation.breakdown.doubtWeighted}/20 pts
                        </span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-amber-500 to-orange-400 rounded-full transition-all duration-500"
                            style={{ width: `${DEFAULT_METRICS.doubtEngagement}%` }}
                        />
                    </div>
                </div>

            </section>

            {/* ==========================================
                3. STRENGTHS & KEY GAPS ANALYSIS
                ========================================== */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Strengths Card */}
                <div className="rounded-3xl bg-[#191b22] p-6 lg:p-7 border border-emerald-500/20 shadow-xl flex flex-col gap-4">
                    <div className="flex items-center gap-2 text-emerald-400">
                        <CheckCircle2 className="w-5 h-5" />
                        <h2 className="text-lg font-bold text-white">Verified Technical Strengths</h2>
                    </div>

                    <div className="flex flex-col gap-3">
                        {evaluation.strengths.map((item, idx) => (
                            <div key={idx} className="flex items-start gap-3 p-3.5 rounded-xl bg-emerald-950/30 border border-emerald-500/20">
                                <span className="w-2 h-2 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                                <span className="text-sm font-medium text-slate-200">{item}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Key Gaps / Action Plan Card */}
                <div className="rounded-3xl bg-[#191b22] p-6 lg:p-7 border border-amber-500/20 shadow-xl flex flex-col gap-4">
                    <div className="flex items-center gap-2 text-amber-400">
                        <AlertTriangle className="w-5 h-5" />
                        <h2 className="text-lg font-bold text-white">Actionable Target Areas for Polish</h2>
                    </div>

                    <div className="flex flex-col gap-3">
                        {evaluation.gaps.map((item, idx) => (
                            <div key={idx} className="flex items-start gap-3 p-3.5 rounded-xl bg-amber-950/30 border border-amber-500/20">
                                <span className="w-2 h-2 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                                <span className="text-sm font-medium text-slate-200">{item}</span>
                            </div>
                        ))}
                    </div>
                </div>

            </section>

            {/* Quick Action Navigation Buttons */}
            {onNavigateTab && (
                <section className="flex flex-wrap items-center justify-center gap-4 pt-4">
                    <button
                        onClick={() => onNavigateTab("learning")}
                        className="px-5 py-2.5 rounded-xl bg-[#282a30] hover:bg-[#33343b] text-white text-xs font-bold flex items-center gap-2 transition-all border border-white/5 cursor-pointer"
                    >
                        <BookOpen className="w-4 h-4 text-[#c3f400]" />
                        <span>Continue Roadmap Tasks</span>
                    </button>
                    <button
                        onClick={() => onNavigateTab("job-prep")}
                        className="px-5 py-2.5 rounded-xl bg-[#282a30] hover:bg-[#33343b] text-white text-xs font-bold flex items-center gap-2 transition-all border border-white/5 cursor-pointer"
                    >
                        <Target className="w-4 h-4 text-emerald-400" />
                        <span>Practice Mock Interview</span>
                    </button>
                    <button
                        onClick={() => onNavigateTab("doubt-solver")}
                        className="px-5 py-2.5 rounded-xl bg-[#282a30] hover:bg-[#33343b] text-white text-xs font-bold flex items-center gap-2 transition-all border border-white/5 cursor-pointer"
                    >
                        <MessageSquare className="w-4 h-4 text-amber-400" />
                        <span>Query AI Doubt Solver</span>
                    </button>
                </section>
            )}

        </div>
    );
}
