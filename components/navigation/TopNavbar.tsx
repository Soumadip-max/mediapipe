"use client";

import React from "react";
import { BookOpen, Briefcase, MessageSquare, Video, FileText, Sparkles, User, ArrowLeft } from "lucide-react";
import { useUser } from '@auth0/nextjs-auth0/client';

export type MainTab = "home" | "learning" | "job-prep" | "doubt-solver";
export type JobSubTab = "mock-interview" | "ats-checker" | "linkedin-optimizer";

const ZenithLogo = () => (
    <div className="relative flex items-center justify-center w-8 h-8 rounded-full bg-[#0d111a] border border-slate-700/80 shadow-[0_0_12px_rgba(34,197,94,0.15)] group-hover:border-emerald-500/50 transition-all shrink-0">
        <svg viewBox="0 0 24 24" className="w-4 h-4">
            <path
                d="M 6.5 17.5 C 6.5 13.5 8 10.5 9.8 9 C 10.8 8.2 11.2 7.2 11.2 6.5 C 11.2 5.5 11.5 5 12 5 C 12.5 5 12.8 5.5 12.8 6.5 C 12.8 7.2 13.2 8.2 14.2 9 C 16 10.5 17.5 13.5 17.5 17.5"
                fill="none"
                stroke="#34d399"
                strokeWidth="2.4"
                strokeLinecap="round"
            />
            <path d="M 4.5 17.5 H 7" stroke="#34d399" strokeWidth="2.4" strokeLinecap="round" />
            <path d="M 17 17.5 H 19.5" stroke="#34d399" strokeWidth="2.4" strokeLinecap="round" />
            <circle cx="12" cy="7.2" r="1.4" fill="#facc15" className="animate-pulse" />
        </svg>
    </div>
);

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
    const { user, isLoading } = useUser();

    if (activeTab === "home") return null;

    return (
        <header className="sticky top-0 z-50 bg-[#07090e]/95 backdrop-blur-xl border-b border-slate-800/80 shadow-lg">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16 gap-4">
                    {/* Return Home Back Arrow Button */}
                    <button
                        onClick={() => setActiveTab("home")}
                        className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0f1422] border border-slate-700/80 hover:border-[#c4f82a] hover:bg-slate-800 text-slate-200 hover:text-white transition-all text-xs font-bold group shadow-md cursor-pointer"
                        title="Return to Zenith Landing Page"
                    >
                        <div className="w-6 h-6 rounded-full bg-slate-800 group-hover:bg-[#c4f82a] group-hover:text-[#07090e] text-slate-300 flex items-center justify-center transition-all shadow-sm">
                            <ArrowLeft className="w-3.5 h-3.5 stroke-[2.5] group-hover:-translate-x-0.5 transition-transform" />
                        </div>
                        <ZenithLogo />
                        <span className="font-extrabold text-sm text-white tracking-tight">Zenith</span>
                        <span className="text-[10px] text-[#c4f82a] font-semibold hidden sm:inline-block border-l border-slate-700/80 pl-2 ml-1">
                            ← Landing Page
                        </span>
                    </button>

                    {/* Navigation Tabs for Active Features */}
                    <nav className="flex items-center gap-1.5 bg-[#0f1422] p-1.5 rounded-full border border-slate-800">
                        <button
                            onClick={() => setActiveTab("learning")}
                            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                                activeTab === "learning"
                                    ? "bg-[#c4f82a] text-[#07090e] font-extrabold shadow-[0_0_15px_rgba(196,248,42,0.3)]"
                                    : "text-slate-400 hover:text-white hover:bg-slate-800/60"
                            }`}
                        >
                            <BookOpen className="w-3.5 h-3.5" />
                            <span>Learn & Roadmaps</span>
                        </button>

                        <button
                            onClick={() => {
                                setActiveTab("job-prep");
                                setActiveJobSubTab("mock-interview");
                            }}
                            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                                activeTab === "job-prep"
                                    ? "bg-blue-500 text-white font-extrabold shadow-[0_0_15px_rgba(59,130,246,0.3)]"
                                    : "text-slate-400 hover:text-white hover:bg-slate-800/60"
                            }`}
                        >
                            <Briefcase className="w-3.5 h-3.5" />
                            <span>Job Prep Studio</span>
                        </button>

                        <button
                            onClick={() => setActiveTab("doubt-solver")}
                            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                                activeTab === "doubt-solver"
                                    ? "bg-emerald-500 text-white font-extrabold shadow-[0_0_15px_rgba(16,185,129,0.3)]"
                                    : "text-slate-400 hover:text-white hover:bg-slate-800/60"
                            }`}
                        >
                            <MessageSquare className="w-3.5 h-3.5" />
                            <span>Doubt Solver</span>
                        </button>

                    </nav>

                    {/* Right Hand Profile */}
                    <div className="flex items-center gap-4">
                        {isLoading ? (
                            <div className="w-8 h-8 rounded-full bg-slate-800 animate-pulse border border-slate-700"></div>
                        ) : user ? (
                            <div className="flex items-center gap-3">
                                <span className="text-xs font-medium text-slate-300 hidden sm:inline-block">
                                    {user.name || user.email}
                                </span>
                                {user.picture ? (
                                    <img src={user.picture} alt="Profile" className="w-8 h-8 rounded-full border border-slate-600" />
                                ) : (
                                    <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300">
                                        <User className="w-4 h-4" />
                                    </div>
                                )}
                                <a href="/auth/logout" className="text-xs font-semibold text-slate-400 hover:text-white transition-colors">
                                    Logout
                                </a>
                            </div>
                        ) : (
                            <a href="/auth/login" className="px-4 py-1.5 rounded-full text-xs font-bold bg-[#c4f82a] text-[#07090e] hover:bg-[#b0df26] transition-colors shadow-sm">
                                Login
                            </a>
                        )}
                    </div>
                </div>
            </div>

            {/* Sub-Navigation Bar for Job Prep */}
            {activeTab === "job-prep" && (
                <div className="bg-[#0b0e17]/90 border-t border-slate-800/60 py-2">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-center gap-3 overflow-x-auto custom-scrollbar">
                        <button
                            onClick={() => setActiveJobSubTab("mock-interview")}
                            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                                activeJobSubTab === "mock-interview"
                                    ? "bg-blue-500/20 text-blue-300 border border-blue-500/40 shadow-sm"
                                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/40"
                            }`}
                        >
                            <Video className="w-3.5 h-3.5 text-blue-400" />
                            <span>1:1 Computer Vision AI Mock Interview</span>
                        </button>

                        <button
                            onClick={() => setActiveJobSubTab("ats-checker")}
                            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                                activeJobSubTab === "ats-checker"
                                    ? "bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm"
                                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/40"
                            }`}
                        >
                            <FileText className="w-3.5 h-3.5 text-amber-400" />
                            <span>Instant ATS Resume Matcher</span>
                        </button>

                        <button
                            onClick={() => setActiveJobSubTab("linkedin-optimizer")}
                            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                                activeJobSubTab === "linkedin-optimizer"
                                    ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm"
                                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/40"
                            }`}
                        >
                            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                            <span>LinkedIn Profile Inspector</span>
                        </button>
                    </div>
                </div>
            )}
        </header>
    );
}
