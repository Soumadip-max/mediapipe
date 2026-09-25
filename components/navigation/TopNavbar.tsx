"use client";

import React from "react";
import { BookOpen, Briefcase, MessageSquare, Video, FileText, Sparkles, CheckCircle2 } from "lucide-react";

const LinkedinIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.25V10.9H6.46M7.86 6.74a1.63 1.63 0 1 0 0 3.26 1.63 1.63 0 0 0 0-3.26Z" />
    </svg>
);

export type MainTab = "learning" | "job-prep" | "doubt-solver";
export type JobSubTab = "mock-interview" | "ats-checker" | "linkedin-optimizer";

interface TopNavbarProps {
    activeTab: MainTab;
    setActiveTab: (tab: MainTab) => void;
    activeJobSubTab: JobSubTab;
    setActiveJobSubTab: (subTab: JobSubTab) => void;
}

export default function TopNavbar({
    activeTab,
    setActiveTab,
    activeJobSubTab,
    setActiveJobSubTab,
}: TopNavbarProps) {
    return (
        <header className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/80">
            {/* Top Branding & Main Navigation Bar */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Brand Logo & Title */}
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 via-emerald-500 to-cyan-500 p-[2px] shadow-lg shadow-emerald-500/20">
                            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                                <Sparkles className="w-5 h-5 text-amber-400" />
                            </div>
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h1 className="font-extrabold text-lg text-white tracking-tight bg-gradient-to-r from-white via-slate-200 to-amber-400 bg-clip-text text-transparent">
                                    Career Launchpad AI
                                </h1>
                                <span className="px-2 py-0.5 text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full">
                                    PRO
                                </span>
                            </div>
                            <p className="text-xs text-slate-400">All-in-One Placement & Career Acceleration</p>
                        </div>
                    </div>

                    {/* Primary Navigation Tabs */}
                    <nav className="flex items-center gap-1 bg-slate-900/90 p-1.5 rounded-2xl border border-slate-800/80">
                        <button
                            onClick={() => setActiveTab("learning")}
                            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                                activeTab === "learning"
                                    ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/20 font-bold"
                                    : "text-slate-400 hover:text-white hover:bg-slate-800/50"
                            }`}
                        >
                            <BookOpen className="w-4 h-4" />
                            <span>📘 Learning Prep</span>
                        </button>

                        <button
                            onClick={() => setActiveTab("job-prep")}
                            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                                activeTab === "job-prep"
                                    ? "bg-gradient-to-r from-amber-500 to-emerald-600 text-white shadow-md shadow-amber-500/20 font-bold"
                                    : "text-slate-400 hover:text-white hover:bg-slate-800/50"
                            }`}
                        >
                            <Briefcase className="w-4 h-4" />
                            <span>💼 Job Prep</span>
                        </button>

                        <button
                            onClick={() => setActiveTab("doubt-solver")}
                            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                                activeTab === "doubt-solver"
                                    ? "bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-md shadow-purple-500/20 font-bold"
                                    : "text-slate-400 hover:text-white hover:bg-slate-800/50"
                            }`}
                        >
                            <MessageSquare className="w-4 h-4" />
                            <span>💬 Doubt Solver</span>
                        </button>
                    </nav>

                    {/* Status Badge */}
                    <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-xs text-slate-300">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                        <span className="font-mono text-[11px] text-emerald-400">AI Models Active</span>
                    </div>
                </div>
            </div>

            {/* Sub-Navigation Bar for Job Prep */}
            {activeTab === "job-prep" && (
                <div className="bg-slate-900/60 border-t border-slate-800/60 py-2">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-center gap-2">
                        <button
                            onClick={() => setActiveJobSubTab("mock-interview")}
                            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                                activeJobSubTab === "mock-interview"
                                    ? "bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm"
                                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/40"
                            }`}
                        >
                            <Video className="w-3.5 h-3.5 text-amber-400" />
                            <span>AI Mock Interview Studio</span>
                        </button>

                        <button
                            onClick={() => setActiveJobSubTab("ats-checker")}
                            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                                activeJobSubTab === "ats-checker"
                                    ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm"
                                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/40"
                            }`}
                        >
                            <FileText className="w-3.5 h-3.5 text-emerald-400" />
                            <span>ATS Resume Checker</span>
                        </button>

                        <button
                            onClick={() => setActiveJobSubTab("linkedin-optimizer")}
                            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                                activeJobSubTab === "linkedin-optimizer"
                                    ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm"
                                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/40"
                            }`}
                        >
                            <LinkedinIcon className="w-3.5 h-3.5 text-cyan-400" />
                            <span>LinkedIn Profile Optimizer</span>
                        </button>
                    </div>
                </div>
            )}
        </header>
    );
}
