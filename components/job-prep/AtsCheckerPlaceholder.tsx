"use client";

import React from "react";
import { FileText, Sparkles, CheckCircle2, AlertTriangle, ArrowUpRight } from "lucide-react";

export default function AtsCheckerPlaceholder() {
    return (
        <div className="w-full max-w-6xl mx-auto py-8 px-4 space-y-8">
            {/* Header Banner */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-950 via-slate-900 to-teal-950 border border-emerald-500/20 p-8 shadow-2xl">
                <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
                <div className="relative z-10 space-y-3">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold">
                        <FileText className="w-3.5 h-3.5" />
                        <span>ATS Keyword & Impact Scorecard</span>
                    </div>
                    <h2 className="text-3xl font-extrabold text-white tracking-tight">
                        ATS Resume Match & Keyword Optimizer
                    </h2>
                    <p className="text-slate-300 max-w-2xl text-sm leading-relaxed">
                        Compare your resume against any Job Description to calculate your ATS match percentage, identify missing key technical skills, and get AI-rewritten high-impact bullet points.
                    </p>
                </div>
            </div>

            {/* Layout Preview Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Resume Input Preview */}
                <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-6 space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-base font-bold text-white flex items-center gap-2">
                            <FileText className="w-4 h-4 text-emerald-400" />
                            <span>1. Resume Content & Job Description</span>
                        </h3>
                        <span className="text-[11px] font-mono text-slate-400">Step 1 of 2</span>
                    </div>
                    <div className="h-40 rounded-xl bg-slate-950 border border-slate-800 p-4 text-xs text-slate-500 font-mono overflow-hidden relative">
                        <span>Paste resume content or drop .pdf / .docx here...</span>
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-950/60 to-slate-950 flex items-center justify-center">
                            <button className="px-5 py-2.5 rounded-full bg-emerald-500 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/20 hover:scale-105 transition-all">
                                Analyze ATS Compatibility
                            </button>
                        </div>
                    </div>
                </div>

                {/* Scorecard Preview */}
                <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-6 space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-base font-bold text-white flex items-center gap-2">
                            <Sparkles className="w-4 h-4 text-emerald-400" />
                            <span>2. Match Scorecard Preview</span>
                        </h3>
                        <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold font-mono">
                            84% ATS Score
                        </span>
                    </div>

                    <div className="space-y-3 text-xs">
                        <div className="p-3 rounded-xl bg-slate-950 border border-emerald-500/30 flex items-center justify-between">
                            <span className="text-slate-300 font-semibold">Matched Keywords</span>
                            <span className="text-emerald-400 font-mono">14 / 18 Skills Found</span>
                        </div>
                        <div className="p-3 rounded-xl bg-slate-950 border border-rose-500/30 flex items-center justify-between">
                            <span className="text-slate-300 font-semibold">Missing Key Terms</span>
                            <span className="text-rose-400 font-mono">GraphQL, Redis, Docker, CI/CD</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Feature Status Note */}
            <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    </div>
                    <div>
                        <h4 className="text-sm font-bold text-white">Module 3A Integration Pending</h4>
                        <p className="text-xs text-slate-400">ATS resume evaluator route (`app/api/resume-ats/route.ts`) will be wired next.</p>
                    </div>
                </div>
                <div className="flex items-center gap-2 text-xs text-emerald-400 font-mono">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Shell Mounted</span>
                </div>
            </div>
        </div>
    );
}
