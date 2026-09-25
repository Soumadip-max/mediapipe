"use client";

import React, { useState } from "react";
import {
    Sparkles,
    CheckCircle2,
    AlertCircle,
    Copy,
    Check,
    Search,
    TrendingUp,
    Zap,
    Loader2,
    Award,
    FileText,
} from "lucide-react";

const LinkedinIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.25V10.9H6.46M7.86 6.74a1.63 1.63 0 1 0 0 3.26 1.63 1.63 0 0 0 0-3.26Z" />
    </svg>
);

export interface ContentFix {
    section: string;
    current: string;
    optimized: string;
    impactReason: string;
}

export interface LinkedinResult {
    profileScore: number;
    ratingBadge: "Top 5% Candidate" | "Needs Optimization" | "Incomplete";
    headlineSuggestions: string[];
    criticalDrawbacks: string[];
    missingRecruiterKeywords: string[];
    contentFixes: ContentFix[];
}

const SAMPLE_PROFILE = `HEADLINE:
Software Developer looking for opportunities | React & Node.js

ABOUT:
Passionate software developer building web applications. I love coding and learning new technologies. Experience with React, Node.js, and JavaScript.

EXPERIENCE:
Software Engineer at Tech Solutions
- Built frontend UI components in React.
- Worked on backend Node.js APIs and fixed bugs.
- Interacted with databases and deployed apps.`;

export default function LinkedinOptimizer() {
    const [profileText, setProfileText] = useState<string>("");
    const [targetRole, setTargetRole] = useState<string>("Full-Stack Software Engineer");
    const [loading, setLoading] = useState<boolean>(false);
    const [result, setResult] = useState<LinkedinResult | null>(null);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [copiedIndex, setCopiedIndex] = useState<string | null>(null);

    const handleOptimize = async () => {
        if (!profileText.trim()) {
            setErrorMsg("Please paste your LinkedIn profile text or summary to analyze.");
            return;
        }

        setLoading(true);
        setErrorMsg(null);

        try {
            const res = await fetch("/api/linkedin", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ profileText, targetRole }),
            });

            if (!res.ok) {
                const errorData = await res.json().catch(() => ({}));
                throw new Error(errorData.error || `Server error (${res.status})`);
            }

            const data: LinkedinResult = await res.json();
            setResult(data);
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : "Failed to analyze LinkedIn profile.";
            console.error("Error optimizing LinkedIn profile:", msg);
            setErrorMsg(msg);
        } finally {
            setLoading(false);
        }
    };

    const loadSampleData = () => {
        setProfileText(SAMPLE_PROFILE);
        setTargetRole("Full-Stack Software Engineer");
        setErrorMsg(null);
    };

    const copyToClipboard = (text: string, id: string) => {
        navigator.clipboard.writeText(text);
        setCopiedIndex(id);
        setTimeout(() => setCopiedIndex(null), 2000);
    };

    return (
        <div className="w-full max-w-6xl mx-auto py-6 px-4 space-y-8">
            {/* Header Banner */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-950/80 via-slate-900 to-[#07090e] border border-[#c4f82a]/20 p-6 md:p-8 shadow-2xl">
                <div className="absolute top-0 right-0 w-96 h-96 bg-[#c4f82a]/10 rounded-full blur-3xl pointer-events-none" />
                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-2">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#c4f82a]/10 border border-[#c4f82a]/30 text-[#c4f82a] text-xs font-semibold">
                            <LinkedinIcon className="w-3.5 h-3.5" />
                            <span>Recruiter Searchability & Profile Optimizer</span>
                        </div>
                        <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
                            LinkedIn Recruiter Search & Profile Strength
                        </h2>
                        <p className="text-slate-300 text-xs md:text-sm max-w-2xl leading-relaxed">
                            Optimize your LinkedIn headline, summary, and experience section for high recruiter search rank. Get instant AI suggestions to boost inbound interview requests.
                        </p>
                    </div>

                    <button
                        onClick={loadSampleData}
                        className="self-start md:self-auto px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-[#c4f82a]/30 text-[#c4f82a] text-xs font-semibold transition-all flex items-center gap-2"
                    >
                        <Zap className="w-3.5 h-3.5 text-[#c4f82a]" />
                        <span>Load Sample Profile</span>
                    </button>
                </div>
            </div>

            {/* Input Controls */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Target Role & Inputs */}
                <div className="md:col-span-1 rounded-2xl bg-slate-900/90 border border-slate-800 p-6 space-y-4 flex flex-col justify-between">
                    <div className="space-y-4">
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-white flex items-center gap-2">
                                <Search className="w-4 h-4 text-[#c4f82a]" />
                                <span>Target Recruiter Role *</span>
                            </label>
                            <input
                                type="text"
                                value={targetRole}
                                onChange={(e) => setTargetRole(e.target.value)}
                                placeholder="e.g. Full-Stack Engineer, Frontend Developer..."
                                maxLength={200}
                                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#c4f82a]/60 focus:ring-1 focus:ring-[#c4f82a]/30 transition-all"
                            />
                        </div>

                        <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-[11px] text-slate-400 leading-relaxed">
                            <strong className="text-[#c4f82a] font-semibold">Pro Tip: </strong>
                            LinkedIn Recruiter uses boolean search algorithms. Providing your target role allows Gemini to inject high-volume recruiter search terms.
                        </div>
                    </div>

                    <button
                        onClick={handleOptimize}
                        disabled={loading || !profileText.trim()}
                        className="w-full py-3.5 px-6 rounded-xl bg-[#c4f82a] hover:bg-[#b5eb1e] active:scale-95 text-[#07090e] font-extrabold text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#c4f82a]/20 disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin text-[#07090e]" />
                                <span>Evaluating Profile...</span>
                            </>
                        ) : (
                            <>
                                <Sparkles className="w-4 h-4 text-[#07090e]" />
                                <span>Optimize Profile</span>
                            </>
                        )}
                    </button>
                </div>

                {/* Profile Text Area */}
                <div className="md:col-span-2 rounded-2xl bg-slate-900/90 border border-slate-800 p-6 space-y-3">
                    <div className="flex items-center justify-between">
                        <label className="text-xs font-bold text-white flex items-center gap-2">
                            <FileText className="w-4 h-4 text-[#c4f82a]" />
                            <span>LinkedIn Profile Content / About / Experience *</span>
                        </label>
                        <span className="text-[11px] text-slate-400 font-mono">
                            {profileText.length} / 20,000 Characters
                        </span>
                    </div>

                    <textarea
                        value={profileText}
                        onChange={(e) => setProfileText(e.target.value)}
                        placeholder="Paste your LinkedIn headline, About section, and experience bullet points here..."
                        rows={10}
                        maxLength={20000}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-xs font-mono text-slate-200 placeholder-slate-500 focus:outline-none focus:border-[#c4f82a]/60 focus:ring-1 focus:ring-[#c4f82a]/30 transition-all resize-none"
                    />
                </div>
            </div>

            {/* Error Banner */}
            {errorMsg && (
                <div className="p-4 rounded-xl bg-rose-950/60 border border-rose-500/40 text-rose-300 text-xs flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 text-rose-400" />
                        <span>{errorMsg}</span>
                    </div>
                </div>
            )}

            {/* Loading Skeleton */}
            {loading && (
                <div className="space-y-6 animate-pulse">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="h-32 bg-slate-900/60 rounded-2xl border border-slate-800" />
                        ))}
                    </div>
                    <div className="h-48 bg-slate-900/60 rounded-2xl border border-slate-800" />
                </div>
            )}

            {/* Results Dashboard */}
            {!loading && result && (
                <div className="space-y-8">
                    {/* Score Cards Row */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Overall Profile Health Score */}
                        <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-6 flex flex-col items-center justify-center text-center space-y-3 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-[#c4f82a]/10 rounded-full blur-2xl pointer-events-none" />
                            <span className="text-xs font-semibold text-slate-400 font-mono">
                                PROFILE HEALTH SCORE
                            </span>

                            <span className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#c4f82a] to-emerald-300 font-mono">
                                {result.profileScore}%
                            </span>

                            <span
                                className={`px-3 py-1 rounded-full text-xs font-bold border ${
                                    result.ratingBadge === "Top 5% Candidate"
                                        ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                                        : result.ratingBadge === "Needs Optimization"
                                        ? "bg-amber-500/20 text-amber-300 border-amber-500/40"
                                        : "bg-rose-500/20 text-rose-300 border-rose-500/40"
                                }`}
                            >
                                {result.ratingBadge}
                            </span>
                        </div>

                        {/* Recruiter Search Terms */}
                        <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-6 flex flex-col justify-between space-y-3">
                            <div className="space-y-1">
                                <span className="text-xs font-semibold text-slate-400 font-mono">
                                    MISSING RECRUITER SEARCH TERMS
                                </span>
                                <p className="text-xs text-slate-400">
                                    {result.missingRecruiterKeywords.length} keywords missing for {targetRole}
                                </p>
                            </div>

                            <div className="flex flex-wrap gap-1.5 pt-1">
                                {result.missingRecruiterKeywords.slice(0, 6).map((kw, idx) => (
                                    <span
                                        key={idx}
                                        className="px-2.5 py-1 rounded-lg bg-emerald-950/60 border border-[#c4f82a]/30 text-[#c4f82a] text-xs font-mono"
                                    >
                                        + {kw}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Critical Drawbacks */}
                        <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-6 flex flex-col justify-between space-y-3">
                            <span className="text-xs font-semibold text-slate-400 font-mono">
                                RECRUITER FRICTION POINTS
                            </span>

                            <div className="space-y-2">
                                {result.criticalDrawbacks.slice(0, 2).map((drawback, idx) => (
                                    <div key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                                        <AlertCircle className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
                                        <span>{drawback}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Headline Suggestions */}
                    {result.headlineSuggestions && result.headlineSuggestions.length > 0 && (
                        <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-6 space-y-4">
                            <div className="flex items-center justify-between">
                                <h3 className="text-base font-bold text-white flex items-center gap-2">
                                    <Award className="w-4 h-4 text-[#c4f82a]" />
                                    <span>AI-Generated High-Converting Headlines</span>
                                </h3>
                                <span className="text-[11px] text-slate-400 font-mono">Click to Copy</span>
                            </div>

                            <div className="space-y-3">
                                {result.headlineSuggestions.map((headline, idx) => (
                                    <div
                                        key={idx}
                                        className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-4 hover:border-[#c4f82a]/40 transition-all"
                                    >
                                        <p className="text-xs font-mono text-emerald-200 flex-1">{headline}</p>
                                        <button
                                            onClick={() => copyToClipboard(headline, `headline-${idx}`)}
                                            className="px-3 py-1.5 rounded-lg bg-[#c4f82a]/10 hover:bg-[#c4f82a]/20 border border-[#c4f82a]/30 text-[#c4f82a] text-xs font-semibold transition-all shrink-0 flex items-center gap-1.5 cursor-pointer"
                                        >
                                            {copiedIndex === `headline-${idx}` ? (
                                                <>
                                                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                                                    <span>Copied!</span>
                                                </>
                                            ) : (
                                                <>
                                                    <Copy className="w-3.5 h-3.5 text-[#c4f82a]" />
                                                    <span>Copy Headline</span>
                                                </>
                                            )}
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Content Rewrites */}
                    {result.contentFixes && result.contentFixes.length > 0 && (
                        <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-6 space-y-6">
                            <div>
                                <h3 className="text-base font-bold text-white flex items-center gap-2">
                                    <Sparkles className="w-4 h-4 text-[#c4f82a]" />
                                    <span>Section-by-Section "Before vs. Optimized" Rewrites</span>
                                </h3>
                                <p className="text-xs text-slate-400 mt-1">
                                    Replace weak or passive phrasing in your LinkedIn sections with these high-impact, keyword-rich rewrites:
                                </p>
                            </div>

                            <div className="space-y-4">
                                {result.contentFixes.map((fix, idx) => (
                                    <div
                                        key={idx}
                                        className="rounded-xl bg-slate-950 border border-slate-800 p-4 space-y-3"
                                    >
                                        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                                            <span className="text-xs font-bold text-[#c4f82a]">
                                                SECTION: {fix.section}
                                            </span>
                                        </div>

                                        {/* Original Phrasing */}
                                        <div className="space-y-1">
                                            <span className="text-[10px] font-bold text-rose-400 font-mono uppercase tracking-wider">
                                                BEFORE (CURRENT)
                                            </span>
                                            <div className="p-2.5 rounded-lg bg-rose-950/20 border border-rose-500/20 text-xs text-rose-300 font-mono">
                                                "{fix.current}"
                                            </div>
                                        </div>

                                        {/* Optimized Rewrite */}
                                        <div className="space-y-1">
                                            <div className="flex items-center justify-between">
                                                <span className="text-[10px] font-bold text-[#c4f82a] font-mono uppercase tracking-wider">
                                                    OPTIMIZED LINKEDIN REWRITE
                                                </span>
                                                <button
                                                    onClick={() => copyToClipboard(fix.optimized, `fix-${idx}`)}
                                                    className="flex items-center gap-1 text-[11px] text-[#c4f82a] hover:text-[#d2fa52] transition-colors cursor-pointer"
                                                >
                                                    {copiedIndex === `fix-${idx}` ? (
                                                        <>
                                                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                                                            <span>Copied!</span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Copy className="w-3.5 h-3.5" />
                                                            <span>Copy Section</span>
                                                        </>
                                                    )}
                                                </button>
                                            </div>
                                            <div className="p-3 rounded-lg bg-emerald-950/30 border border-[#c4f82a]/30 text-xs font-mono text-emerald-200">
                                                "{fix.optimized}"
                                            </div>
                                        </div>

                                        {/* Impact Reason */}
                                        <p className="text-[11px] text-slate-400 italic pt-1 border-t border-slate-800/60">
                                            <strong className="text-slate-300 font-semibold not-italic">
                                                Recruiter Impact:{" "}
                                            </strong>
                                            {fix.impactReason}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
