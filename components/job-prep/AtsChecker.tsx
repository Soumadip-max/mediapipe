"use client";

import React, { useState } from "react";
import {
    FileText,
    Sparkles,
    CheckCircle2,
    AlertCircle,
    Copy,
    Check,
    Upload,
    ArrowRight,
    Loader2,
    TrendingUp,
    Zap,
    RotateCcw,
} from "lucide-react";

export interface BulletFix {
    original: string;
    suggested: string;
    reason: string;
}

export interface AtsResult {
    matchScore: number;
    atsCompatibility: "High" | "Moderate" | "Needs Improvement";
    missingKeywords: string[];
    formattingScore: number;
    keyStrengths: string[];
    bulletPointFixes: BulletFix[];
}

const SAMPLE_RESUME = `SOUMADIP MAITY
Full-Stack Software Engineer | React, Next.js, Node.js, Python

SUMMARY:
Results-driven Full-Stack Engineer with 3+ years of experience building high-throughput web applications, microservices, and AI integrations. Proficient in React, TypeScript, Next.js, Node.js, PostgreSQL, and AWS.

EXPERIENCE:
Software Engineer | Tech Corp (2022 - Present)
- Worked on building APIs for the backend web app and user management system.
- Made the frontend UI faster using React and Tailwind CSS.
- Handled database migration and fixed slow SQL queries in production.
- Integrated AI features using OpenAI and Gemini APIs.

EDUCATION:
B.Tech in Computer Science & Engineering (2018 - 2022)`;

const SAMPLE_JOB_DESC = `We are looking for a Senior Full-Stack Engineer to join our core engineering team.
Requirements:
- 3+ years experience with React, Next.js, TypeScript, and Node.js.
- Strong knowledge of microservices, Docker, Kubernetes, GraphQL, and Redis caching.
- Experience optimizing SQL queries and EXPLAIN ANALYZE performance tuning.
- Familiarity with CI/CD deployment pipelines and AWS cloud architecture.`;

export default function AtsChecker() {
    const [resumeText, setResumeText] = useState<string>("");
    const [jobDescription, setJobDescription] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const [result, setResult] = useState<AtsResult | null>(null);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

    const handleAnalyze = async () => {
        if (!resumeText.trim()) {
            setErrorMsg("Please paste or upload your resume text to begin ATS analysis.");
            return;
        }

        setLoading(true);
        setErrorMsg(null);

        try {
            const res = await fetch("/api/resume-ats", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ resumeText, jobDescription }),
            });

            if (!res.ok) {
                const errorData = await res.json().catch(() => ({}));
                throw new Error(errorData.error || `Server error (${res.status})`);
            }

            const data: AtsResult = await res.json();
            setResult(data);
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : "Failed to analyze resume.";
            console.error("Error analyzing ATS:", msg);
            setErrorMsg(msg);
        } finally {
            setLoading(false);
        }
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            const content = event.target?.result as string;
            if (content) {
                setResumeText(content);
            }
        };
        reader.readAsText(file);
    };

    const loadSampleData = () => {
        setResumeText(SAMPLE_RESUME);
        setJobDescription(SAMPLE_JOB_DESC);
        setErrorMsg(null);
    };

    const copyToClipboard = (text: string, idx: number) => {
        navigator.clipboard.writeText(text);
        setCopiedIndex(idx);
        setTimeout(() => setCopiedIndex(null), 2000);
    };

    return (
        <div className="w-full max-w-6xl mx-auto py-6 px-4 space-y-8">
            {/* Header Banner */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-950 via-slate-900 to-teal-950 border border-emerald-500/20 p-6 md:p-8 shadow-2xl">
                <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-2">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold">
                            <FileText className="w-3.5 h-3.5" />
                            <span>ATS Resume Match & Keyword Optimizer</span>
                        </div>
                        <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
                            ATS Resume Compatibility Scorecard
                        </h2>
                        <p className="text-slate-300 text-xs md:text-sm max-w-2xl leading-relaxed">
                            Analyze your resume against Applicant Tracking Systems (ATS) and target job descriptions. Uncover missing keywords, impact scores, and AI-rewritten bullet points.
                        </p>
                    </div>

                    <button
                        onClick={loadSampleData}
                        className="self-start md:self-auto px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-emerald-500/30 text-emerald-300 text-xs font-semibold transition-all flex items-center gap-2"
                    >
                        <Zap className="w-3.5 h-3.5 text-amber-400" />
                        <span>Load Sample Resume & JD</span>
                    </button>
                </div>
            </div>

            {/* Input Form Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Resume Text Input */}
                <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-6 space-y-3">
                    <div className="flex items-center justify-between">
                        <label className="text-xs font-bold text-white flex items-center gap-2">
                            <FileText className="w-4 h-4 text-emerald-400" />
                            <span>Resume Text Content *</span>
                        </label>
                        <label className="text-[11px] text-emerald-400 font-semibold cursor-pointer hover:underline flex items-center gap-1">
                            <Upload className="w-3 h-3" />
                            <span>Upload File (.txt/.md)</span>
                            <input
                                type="file"
                                accept=".txt,.md,.text"
                                onChange={handleFileUpload}
                                className="hidden"
                            />
                        </label>
                    </div>

                    <textarea
                        value={resumeText}
                        onChange={(e) => setResumeText(e.target.value)}
                        placeholder="Paste your plain text resume content here..."
                        rows={10}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-xs font-mono text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500/60 focus:ring-1 focus:ring-emerald-500/30 transition-all resize-none"
                    />

                    <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
                        <span>{resumeText.length} Characters</span>
                        {resumeText && (
                            <button
                                onClick={() => setResumeText("")}
                                className="hover:text-rose-400 transition-colors"
                            >
                                Clear
                            </button>
                        )}
                    </div>
                </div>

                {/* Job Description Input */}
                <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-6 space-y-3 flex flex-col justify-between">
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <label className="text-xs font-bold text-white flex items-center gap-2">
                                <Sparkles className="w-4 h-4 text-cyan-400" />
                                <span>Target Job Description (Optional)</span>
                            </label>
                            <span className="text-[11px] text-slate-400 font-mono">For JD Matching</span>
                        </div>

                        <textarea
                            value={jobDescription}
                            onChange={(e) => setJobDescription(e.target.value)}
                            placeholder="Paste the job description (JD) you are applying for to check keyword overlap..."
                            rows={8}
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-xs font-mono text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500/60 focus:ring-1 focus:ring-cyan-500/30 transition-all resize-none"
                        />
                    </div>

                    {/* Action Button */}
                    <div className="pt-2">
                        <button
                            onClick={handleAnalyze}
                            disabled={loading || !resumeText.trim()}
                            className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 active:scale-95 text-slate-950 font-extrabold text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 disabled:opacity-50 disabled:pointer-events-none"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                                    <span>Evaluating ATS Match...</span>
                                </>
                            ) : (
                                <>
                                    <TrendingUp className="w-4 h-4 text-slate-950" />
                                    <span>Analyze ATS Compatibility</span>
                                </>
                            )}
                        </button>
                    </div>
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

            {/* Analysis Results Dashboard */}
            {!loading && result && (
                <div className="space-y-8">
                    {/* Score Cards Row */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Overall ATS Match Score */}
                        <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-6 flex flex-col items-center justify-center text-center space-y-3 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
                            <span className="text-xs font-semibold text-slate-400 font-mono">
                                OVERALL ATS MATCH SCORE
                            </span>

                            <div className="relative flex items-center justify-center">
                                <span className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300 font-mono">
                                    {result.matchScore}%
                                </span>
                            </div>

                            <span
                                className={`px-3 py-1 rounded-full text-xs font-bold border ${
                                    result.atsCompatibility === "High"
                                        ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                                        : result.atsCompatibility === "Moderate"
                                        ? "bg-amber-500/20 text-amber-300 border-amber-500/40"
                                        : "bg-rose-500/20 text-rose-300 border-rose-500/40"
                                }`}
                            >
                                {result.atsCompatibility} Compatibility
                            </span>
                        </div>

                        {/* Formatting & Impact Score */}
                        <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-6 flex flex-col items-center justify-center text-center space-y-3 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />
                            <span className="text-xs font-semibold text-slate-400 font-mono">
                                FORMATTING & IMPACT SCORE
                            </span>

                            <span className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-300 font-mono">
                                {result.formattingScore}%
                            </span>

                            <span className="text-xs text-slate-400">Action Verbs & Readability</span>
                        </div>

                        {/* Missing Keywords Summary */}
                        <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-6 flex flex-col justify-between space-y-3">
                            <div className="space-y-1">
                                <span className="text-xs font-semibold text-slate-400 font-mono">
                                    CRITICAL MISSING KEYWORDS
                                </span>
                                <p className="text-xs text-slate-400">
                                    {result.missingKeywords.length} key terms missing from resume
                                </p>
                            </div>

                            <div className="flex flex-wrap gap-1.5 pt-1">
                                {result.missingKeywords.slice(0, 6).map((kw, idx) => (
                                    <span
                                        key={idx}
                                        className="px-2.5 py-1 rounded-lg bg-rose-950/60 border border-rose-500/30 text-rose-300 text-xs font-mono"
                                    >
                                        + {kw}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Missing Keywords Tag Cloud Detail */}
                    {result.missingKeywords.length > 0 && (
                        <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-6 space-y-4">
                            <h3 className="text-base font-bold text-white flex items-center gap-2">
                                <AlertCircle className="w-4 h-4 text-rose-400" />
                                <span>Recommended Keyword Additions</span>
                            </h3>
                            <p className="text-xs text-slate-400">
                                Recruiter search algorithms scan for these exact tech terms. We recommend weaving these naturally into your experience bullet points:
                            </p>

                            <div className="flex flex-wrap gap-2 pt-1">
                                {result.missingKeywords.map((kw, idx) => (
                                    <span
                                        key={idx}
                                        className="px-3 py-1.5 rounded-xl bg-rose-950/40 border border-rose-500/30 text-rose-300 text-xs font-mono flex items-center gap-1.5"
                                    >
                                        <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                                        <span>{kw}</span>
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Key Strengths */}
                    {result.keyStrengths && result.keyStrengths.length > 0 && (
                        <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-6 space-y-4">
                            <h3 className="text-base font-bold text-white flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                                <span>Resume Highlights & Strengths</span>
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {result.keyStrengths.map((strength, idx) => (
                                    <div
                                        key={idx}
                                        className="p-3.5 rounded-xl bg-slate-950 border border-emerald-500/20 text-xs text-slate-300 flex items-start gap-3"
                                    >
                                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                                        <span>{strength}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Rewritten Bullet Point Suggestions */}
                    {result.bulletPointFixes && result.bulletPointFixes.length > 0 && (
                        <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-6 space-y-6">
                            <div>
                                <h3 className="text-base font-bold text-white flex items-center gap-2">
                                    <Sparkles className="w-4 h-4 text-amber-400" />
                                    <span>AI Rewritten High-Impact Bullet Points</span>
                                </h3>
                                <p className="text-xs text-slate-400 mt-1">
                                    Replace weak or passive resume phrasing with these metrics-driven, action-oriented rewrites:
                                </p>
                            </div>

                            <div className="space-y-4">
                                {result.bulletPointFixes.map((fix, idx) => (
                                    <div
                                        key={idx}
                                        className="rounded-xl bg-slate-950 border border-slate-800 p-4 space-y-3"
                                    >
                                        {/* Original Phrasing */}
                                        <div className="space-y-1">
                                            <span className="text-[10px] font-bold text-rose-400 font-mono uppercase tracking-wider">
                                                ORIGINAL BULLET POINT
                                            </span>
                                            <div className="p-2.5 rounded-lg bg-rose-950/20 border border-rose-500/20 text-xs text-rose-300 font-mono">
                                                "{fix.original}"
                                            </div>
                                        </div>

                                        {/* AI Suggested Rewrite */}
                                        <div className="space-y-1">
                                            <div className="flex items-center justify-between">
                                                <span className="text-[10px] font-bold text-emerald-400 font-mono uppercase tracking-wider">
                                                    OPTIMIZED REWRITE
                                                </span>
                                                <button
                                                    onClick={() => copyToClipboard(fix.suggested, idx)}
                                                    className="flex items-center gap-1 text-[11px] text-emerald-400 hover:text-emerald-300 transition-colors"
                                                >
                                                    {copiedIndex === idx ? (
                                                        <>
                                                            <Check className="w-3.5 h-3.5" />
                                                            <span>Copied!</span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Copy className="w-3.5 h-3.5" />
                                                            <span>Copy Rewrite</span>
                                                        </>
                                                    )}
                                                </button>
                                            </div>
                                            <div className="p-3 rounded-lg bg-emerald-950/30 border border-emerald-500/30 text-xs font-mono text-emerald-200">
                                                "{fix.suggested}"
                                            </div>
                                        </div>

                                        {/* Reason */}
                                        <p className="text-[11px] text-slate-400 italic pt-1 border-t border-slate-800/60">
                                            <strong className="text-slate-300 font-semibold not-italic">
                                                Why this works:{" "}
                                            </strong>
                                            {fix.reason}
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
