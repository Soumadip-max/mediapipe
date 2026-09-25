"use client";

import React from "react";
import { MessageSquare, Sparkles, CheckCircle2, Code2, Bot, Send } from "lucide-react";

export default function DoubtSolverPlaceholder() {
    return (
        <div className="w-full max-w-6xl mx-auto py-8 px-4 space-y-8">
            {/* Header Banner */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-purple-950 via-slate-900 to-indigo-950 border border-purple-500/20 p-8 shadow-2xl">
                <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
                <div className="relative z-10 space-y-3">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-semibold">
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>24/7 AI Technical Mentor & Doubt Solver</span>
                    </div>
                    <h2 className="text-3xl font-extrabold text-white tracking-tight">
                        Instant Technical Doubt Solver & Code Assistant
                    </h2>
                    <p className="text-slate-300 max-w-2xl text-sm leading-relaxed">
                        Got stuck on an algorithm, system design trade-off, or interview question? Ask your 24/7 AI Technical Mentor for step-by-step explanations, code snippets, and error debugging.
                    </p>
                </div>
            </div>

            {/* Chat Interface Preview */}
            <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center">
                            <Bot className="w-5 h-5 text-purple-400" />
                        </div>
                        <div>
                            <h3 className="text-sm font-bold text-white">AI Technical Mentor</h3>
                            <p className="text-xs text-slate-400">Context-Aware Career & Coding Assistant</p>
                        </div>
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-semibold border border-emerald-500/20">
                        Online
                    </span>
                </div>

                {/* Sample Messages */}
                <div className="space-y-3 py-4 text-xs">
                    <div className="flex justify-end">
                        <div className="max-w-md bg-purple-600 text-white p-3 rounded-2xl rounded-tr-none">
                            How do I optimize a React component re-rendering issue with useMemo vs useCallback?
                        </div>
                    </div>
                    <div className="flex justify-start">
                        <div className="max-w-md bg-slate-950 border border-slate-800 text-slate-300 p-3.5 rounded-2xl rounded-tl-none space-y-2">
                            <p className="font-semibold text-purple-400">Here is the key distinction:</p>
                            <ul className="list-disc pl-4 space-y-1 text-slate-400">
                                <li><strong className="text-slate-200">useMemo:</strong> Caches the calculated value of an expensive computation.</li>
                                <li><strong className="text-slate-200">useCallback:</strong> Caches the function instance itself to prevent re-creating callback props.</li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Disabled Input Bar Preview */}
                <div className="relative">
                    <input
                        disabled
                        type="text"
                        placeholder="Ask your technical doubt or paste code snippet..."
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 pl-4 pr-12 text-xs text-slate-400 disabled:opacity-60"
                    />
                    <button disabled className="absolute right-2 top-2 p-1.5 rounded-lg bg-purple-600 text-white opacity-50">
                        <Send className="w-3.5 h-3.5" />
                    </button>
                </div>
            </div>

            {/* Feature Status Note */}
            <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-purple-500/10 border border-purple-500/30 flex items-center justify-center">
                        <CheckCircle2 className="w-4 h-4 text-purple-400" />
                    </div>
                    <div>
                        <h4 className="text-sm font-bold text-white">Module 4 Integration Pending</h4>
                        <p className="text-xs text-slate-400">Doubt solver chatbot API (`app/api/doubt-solver/route.ts`) will be wired next.</p>
                    </div>
                </div>
                <div className="flex items-center gap-2 text-xs text-purple-400 font-mono">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Shell Mounted</span>
                </div>
            </div>
        </div>
    );
}
