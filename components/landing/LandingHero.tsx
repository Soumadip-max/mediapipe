"use client";

import React, { useState } from "react";
import { MainTab, JobSubTab } from "@/components/navigation/TopNavbar";

interface LandingHeroProps {
    setActiveTab: (tab: MainTab) => void;
    setActiveJobSubTab: (subTab: JobSubTab) => void;
}

export default function LandingHero({ setActiveTab, setActiveJobSubTab }: LandingHeroProps) {
    const [searchRole, setSearchRole] = useState("");
    const [ctaEmail, setCtaEmail] = useState("");
    const [ctaSubmitted, setCtaSubmitted] = useState(false);
    const [isCalibrating, setIsCalibrating] = useState(false);

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!searchRole.trim()) return;
        setIsCalibrating(true);
        setTimeout(() => {
            setIsCalibrating(false);
            setActiveTab("learning");
        }, 600);
    };

    const handleTagClick = (role: string) => {
        setSearchRole(role);
        setActiveTab("learning");
    };

    const handleCtaSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (ctaEmail && ctaEmail.includes("@")) {
            setCtaSubmitted(true);
            setTimeout(() => setCtaSubmitted(false), 3000);
        }
    };

    return (
        <div className="w-full bg-[#111319] text-[#e2e2eb] font-sans antialiased selection:bg-[#c3f400] selection:text-[#283500] min-h-screen">
            {/* ==========================================
                HEADER BAR (Stitch Nav matching provided HTML)
                ========================================== */}
            <header className="fixed top-0 inset-x-0 z-50 bg-[#111319]/80 backdrop-blur-md border-b border-white/10">
                <div className="h-20 max-w-[1360px] mx-auto px-6 lg:px-8 flex items-center justify-between gap-6">
                    {/* Brand Logo & Name */}
                    <button
                        onClick={() => setActiveTab("home")}
                        className="flex items-center gap-3 group cursor-pointer focus:outline-none"
                    >
                        <div className="w-8 h-8 rounded-full bg-[#0c0e14] border border-[#444933] flex items-center justify-center p-1.5 shadow-[0_0_12px_rgba(195,244,0,0.2)]">
                            <span className="material-symbols-outlined text-[#c3f400] text-xl">hub</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <span className="font-[#Plus_Jakarta_Sans] text-xl font-bold tracking-tight text-white group-hover:text-[#c3f400] transition-colors">
                                Zenith
                            </span>
                        </div>
                    </button>

                    {/* Navbar Links */}
                    <nav className="hidden xl:flex items-center gap-1 p-1 rounded-full bg-[#0c0e14]/60 border border-white/5">
                        <button
                            onClick={() => setActiveTab("learning")}
                            className="px-4 py-1.5 font-medium text-xs text-[#c4c9ac] hover:text-white hover:bg-white/10 rounded-full transition-all"
                        >
                            Roadmaps
                        </button>
                        <button
                            onClick={() => {
                                setActiveTab("job-prep");
                                setActiveJobSubTab("mock-interview");
                            }}
                            className="px-4 py-1.5 font-medium text-xs text-[#c4c9ac] hover:text-white hover:bg-white/10 rounded-full transition-all"
                        >
                            Mock Interview
                        </button>
                        <button
                            onClick={() => setActiveTab("doubt-solver")}
                            className="px-4 py-1.5 font-medium text-xs text-[#c4c9ac] hover:text-white hover:bg-white/10 rounded-full transition-all"
                        >
                            Doubt Engine
                        </button>
                    </nav>

                    {/* Action buttons */}
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setActiveTab("learning")}
                            className="hidden sm:inline-flex items-center justify-center px-4 py-2 rounded-full border border-white/15 bg-white/5 text-xs font-semibold text-white hover:bg-white/10 transition-all"
                        >
                            Log In
                        </button>
                        <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-[#283500] shrink-0">
                            <span className="material-symbols-outlined text-lg">person</span>
                        </div>
                    </div>
                </div>
            </header>

            {/* ==========================================
                MAIN CONTENT
                ========================================== */}
            <main className="w-full pt-20 bg-[#111319]">
                <div className="flex flex-col w-full">
                    {/* ==========================================
                       SECTION 1: THE UPPER COSMOS (MIDNIGHT HERO)
                       ========================================== */}
                    <section className="relative w-full bg-[#0c0e14] overflow-hidden pb-28 pt-8">
                        {/* Ambient Neon Mesh Glows */}
                        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-gradient-to-b from-[#c3f400]/15 via-[#c0c1ff]/10 to-transparent blur-3xl pointer-events-none rounded-full" />
                        <div className="absolute top-96 -left-48 w-96 h-96 bg-[#c3f400]/10 blur-[120px] pointer-events-none rounded-full" />
                        <div className="absolute top-80 -right-48 w-[420px] h-[420px] bg-[#d4004b]/20 blur-[130px] pointer-events-none rounded-full" />

                        <div className="relative max-w-[1360px] mx-auto px-6 lg:px-8 flex flex-col items-center text-center">

                            {/* Main Hero Headline */}
                            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold tracking-tight text-[#e2e2eb] max-w-4xl mx-auto leading-[1.08]">
                                From Learning to{" "}
                                <span className="bg-gradient-to-r from-[#c3f400] via-[#abd600] to-[#c3f400] bg-clip-text text-transparent underline decoration-[#c3f400]/30 decoration-wavy decoration-2 underline-offset-8">
                                    Job-Ready
                                </span>{" "}
                                in One Seamless Platform
                            </h1>

                            {/* Subheading */}
                            <p className="text-sm sm:text-lg lg:text-xl text-[#c4c9ac] max-w-2xl mx-auto mt-4 mb-10 leading-relaxed font-normal">
                                AI-guided career roadmaps, real-time 1:1 computer vision mock interviews, and instant doubt resolution engineered for ambitious engineers.
                            </p>

                            {/* ==========================================================
                               FAN-OUT STAGE (3 Wireframe-Inspired Glowing Bento Cards)
                               ========================================================== */}
                            <div className="relative w-full max-w-5xl py-8 min-h-[460px] flex items-center justify-center">
                                {/* Stage Arc Radial Light Backdrop */}
                                <div className="absolute inset-0 bg-gradient-to-t from-[#c3f400]/5 via-[#282a30]/30 to-transparent rounded-[48px] pointer-events-none" />
                                <div className="relative w-full grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-0 items-center justify-items-center">

                                    {/* CARD 1: LEFT FAN (-8deg tilt) - DOUBT SOLVER */}
                                    <div
                                        onClick={() => setActiveTab("doubt-solver")}
                                        className="group relative w-full max-w-[310px] md:-mr-8 md:-rotate-6 hover:rotate-0 hover:z-30 hover:scale-105 transition-all duration-300 ease-out z-10 cursor-pointer"
                                    >
                                        <div className="relative rounded-3xl p-6 bg-gradient-to-br from-emerald-950/70 via-[#282a30]/90 to-[#0c0e14] text-left shadow-2xl backdrop-blur-xl overflow-hidden border border-emerald-500/20 group-hover:border-emerald-400/50">
                                            <div className="absolute -right-8 -top-8 w-32 h-32 bg-emerald-500/20 rounded-full blur-2xl group-hover:bg-emerald-400/30 transition-all" />
                                            {/* Card Header */}
                                            <div className="flex items-center justify-between mb-4">
                                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold uppercase tracking-wider">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                                    Instant Solve
                                                </span>
                                                <span className="text-xs text-[#c4c9ac] font-mono">&lt; 120ms</span>
                                            </div>
                                            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 flex items-center justify-center mb-4">
                                                <span className="material-symbols-outlined text-emerald-300 text-2xl">memory</span>
                                            </div>
                                            <h3 className="text-xl font-bold text-white mb-1">Doubt Solver</h3>
                                            <p className="text-xs text-[#c4c9ac] mb-4">Contextual AI Debugger & Code Inspector available 24/7.</p>
                                            
                                            {/* Code Syntax Snippet Preview */}
                                            <div className="p-3.5 rounded-xl bg-[#0c0e14]/90 font-mono text-[11px] text-emerald-200/90 space-y-1 border border-white/5">
                                                <div className="flex items-center justify-between text-[#c4c9ac] text-[10px] pb-1 border-b border-white/5">
                                                    <span>DAG_Scheduler.ts</span>
                                                    <span className="text-emerald-400 font-bold">✓ Fixed</span>
                                                </div>
                                                <div className="pt-1"><span className="text-[#ffb2ba]">const</span> topo = <span className="text-[#c3f400]">solveRace</span>(tree);</div>
                                                <div className="text-[#c4c9ac]">// Zero latency resolution</div>
                                            </div>
                                            
                                            {/* Pill Indicator */}
                                            <div className="mt-4 pt-3 flex items-center justify-between border-t border-white/10 text-xs text-[#c4c9ac]">
                                                <span className="flex items-center gap-1">
                                                    <span className="material-symbols-outlined text-emerald-400 text-sm">verified</span> Verified Correctness
                                                </span>
                                                <span className="text-[#c3f400] font-bold">99.8%</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* CARD 2: CENTER ELEVATED (0deg, Hero focus) - LEARN */}
                                    <div
                                        onClick={() => setActiveTab("learning")}
                                        className="group relative w-full max-w-[340px] md:scale-105 md:z-20 hover:scale-110 transition-all duration-300 ease-out z-20 cursor-pointer"
                                    >
                                        {/* Glow underlay */}
                                        <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-[#c3f400] via-[#d4004b] to-[#e1e0ff] opacity-40 blur-lg group-hover:opacity-75 transition-opacity" />
                                        <div className="relative rounded-3xl p-7 bg-gradient-to-b from-[#282a30]/95 via-[#1e1f26] to-[#0c0e14] text-left shadow-2xl backdrop-blur-2xl border border-[#c3f400]/40">
                                            {/* Header Badges */}
                                            <div className="flex items-center justify-between mb-5">
                                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#c3f400] text-[#283500] text-[10px] font-black uppercase tracking-wider">
                                                    Core Engine
                                                </span>
                                                <span className="px-2.5 py-0.5 rounded-full bg-white/10 text-xs text-white">Level 4 Candidate</span>
                                            </div>
                                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#c3f400] to-[#abd600] text-[#283500] flex items-center justify-center mb-4 shadow-lg shadow-[#c3f400]/20">
                                                <span className="material-symbols-outlined text-3xl font-bold">hub</span>
                                            </div>
                                            <h3 className="text-2xl font-bold text-white mb-1">Learn</h3>
                                            <p className="text-xs text-[#c4c9ac] mb-5">Dynamic Graph Roadmaps tailored to your hiring target gaps.</p>

                                            {/* Progress Visual Stack */}
                                            <div className="space-y-3.5 p-4 rounded-2xl bg-[#0c0e14]/80 border border-white/5">
                                                <div className="flex items-center justify-between text-xs">
                                                    <span className="text-white font-semibold">Distributed Systems & Go</span>
                                                    <span className="text-[#c3f400] font-bold">78%</span>
                                                </div>
                                                {/* Progress Track */}
                                                <div className="w-full h-2 rounded-full bg-[#282a30] overflow-hidden">
                                                    <div className="h-full bg-gradient-to-r from-[#c3f400] to-[#abd600] rounded-full w-[78%]" />
                                                </div>
                                                <div className="flex items-center gap-2 pt-1 text-[11px] text-[#c4c9ac] font-mono">
                                                    <span className="px-2 py-0.5 rounded bg-[#1e1f26] text-white">Kafka</span>
                                                    <span className="px-2 py-0.5 rounded bg-[#1e1f26] text-white">Raft</span>
                                                    <span className="px-2 py-0.5 rounded bg-[#1e1f26] text-white">gRPC</span>
                                                </div>
                                            </div>

                                            <div className="mt-5 flex items-center justify-between">
                                                <div className="flex -space-x-2">
                                                    <span className="w-7 h-7 rounded-full bg-[#c3f400] text-[#283500] text-xs flex items-center justify-center font-bold">Z</span>
                                                    <span className="w-7 h-7 rounded-full bg-white text-black text-xs flex items-center justify-center font-bold">AI</span>
                                                    <span className="w-7 h-7 rounded-full bg-[#d4004b] text-white text-xs flex items-center justify-center font-bold">9+</span>
                                                </div>
                                                <span className="text-xs text-[#c3f400] flex items-center gap-1 font-bold group-hover:translate-x-1 transition-transform">
                                                    Active Roadmap →
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* CARD 3: RIGHT FAN (+8deg tilt) - JOB PREP */}
                                    <div
                                        onClick={() => {
                                            setActiveTab("job-prep");
                                            setActiveJobSubTab("mock-interview");
                                        }}
                                        className="group relative w-full max-w-[310px] md:-ml-8 md:rotate-6 hover:rotate-0 hover:z-30 hover:scale-105 transition-all duration-300 ease-out z-10 cursor-pointer"
                                    >
                                        <div className="relative rounded-3xl p-6 bg-gradient-to-br from-indigo-950/70 via-[#282a30]/90 to-[#0c0e14] text-left shadow-2xl backdrop-blur-xl overflow-hidden border border-indigo-500/20 group-hover:border-indigo-400/50">
                                            <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-indigo-500/20 rounded-full blur-2xl group-hover:bg-indigo-400/30 transition-all" />
                                            <div className="flex items-center justify-between mb-4">
                                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-[10px] font-bold uppercase tracking-wider">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                                                    Interview AI
                                                </span>
                                                <span className="text-xs text-[#c4c9ac] font-mono">Live Cam</span>
                                            </div>
                                            <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 flex items-center justify-center mb-4">
                                                <span className="material-symbols-outlined text-indigo-300 text-2xl">videocam</span>
                                            </div>
                                            <h3 className="text-xl font-bold text-white mb-1">Job Prep</h3>
                                            <p className="text-xs text-[#c4c9ac] mb-4">Vision & Speech Mock Interviews + Instant ATS Resume Matching.</p>

                                            {/* ATS & Vision Metrics Grid */}
                                            <div className="p-3.5 rounded-xl bg-[#0c0e14]/90 grid grid-cols-2 gap-2 text-center border border-white/5">
                                                <div className="p-2 rounded-lg bg-[#1e1f26]">
                                                    <div className="text-lg font-bold text-[#c3f400] leading-none">94<span className="text-xs text-[#c4c9ac]">/100</span></div>
                                                    <div className="text-[10px] uppercase text-[#c4c9ac] mt-1 font-semibold">ATS Score</div>
                                                </div>
                                                <div className="p-2 rounded-lg bg-[#1e1f26]">
                                                    <div className="text-lg font-bold text-emerald-400 leading-none">92%</div>
                                                    <div className="text-[10px] uppercase text-[#c4c9ac] mt-1 font-semibold">Gaze Metric</div>
                                                </div>
                                            </div>

                                            {/* Pill Indicator */}
                                            <div className="mt-4 pt-3 flex items-center justify-between border-t border-white/10 text-xs text-[#c4c9ac]">
                                                <span className="flex items-center gap-1">
                                                    <span className="material-symbols-outlined text-indigo-400 text-sm">psychology</span> Behavioral & Tech
                                                </span>
                                                <span className="text-white font-semibold">Tier 1 Target</span>
                                            </div>
                                        </div>
                                    </div>

                                </div>

                                {/* Overlapping Center Pulse Ecosystem Badge */}
                                <div
                                    onClick={() => setActiveTab("learning")}
                                    className="hidden md:flex absolute -bottom-6 left-1/2 -translate-x-1/2 items-center gap-2 px-5 py-2.5 rounded-full bg-[#282a30]/95 text-white shadow-2xl backdrop-blur-xl z-30 group cursor-pointer hover:bg-[#33343b] transition-all border border-white/10"
                                >
                                    <span className="w-2.5 h-2.5 rounded-full bg-[#c3f400] animate-ping" />
                                    <span className="text-xs font-bold">Synchronized Career Telemetry</span>
                                    <span className="material-symbols-outlined text-[#c3f400] text-base group-hover:rotate-45 transition-transform">autorenew</span>
                                </div>
                            </div>

                            {/* ==========================================================
                               INTERACTIVE PATH FINDER
                               ========================================================== */}
                            <div className="w-full max-w-3xl mt-14 flex flex-col items-center">
                                <form
                                    onSubmit={handleSearchSubmit}
                                    className="w-full p-2 rounded-full bg-[#282a30]/80 backdrop-blur-xl shadow-2xl flex items-center gap-2 border border-white/10 transition-all hover:border-[#c3f400]/40"
                                >
                                    <div className="hidden sm:flex items-center gap-1.5 pl-4 pr-3 py-2 rounded-full bg-[#33343b] text-white text-xs font-semibold whitespace-nowrap">
                                        <span className="w-2 h-2 rounded-full bg-[#c3f400]" />
                                        Your Ambition
                                    </div>
                                    <div className="flex-1 flex items-center gap-2 px-3">
                                        <span className="material-symbols-outlined text-[#c4c9ac] text-xl">search</span>
                                        <input
                                            type="text"
                                            value={searchRole}
                                            onChange={(e) => setSearchRole(e.target.value)}
                                            placeholder="Enter your target role (e.g. Distributed Systems Engineer, AI/ML Specialist...)..."
                                            className="w-full bg-transparent border-0 outline-none text-white placeholder:text-[#c4c9ac]/60 text-sm font-medium focus:ring-0"
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#c3f400] text-[#283500] font-bold text-xs hover:bg-[#abd600] transition-all shadow-[0_0_24px_-4px_rgba(195,244,0,0.5)] shrink-0 active:scale-95 cursor-pointer"
                                    >
                                        <span>{isCalibrating ? "Calibrating..." : "Start Path"}</span>
                                        <span className="material-symbols-outlined text-base font-bold">arrow_forward</span>
                                    </button>
                                </form>

                                {/* Quick Interest Tags */}
                                <div className="flex flex-wrap items-center justify-center gap-2 mt-4 text-xs text-[#c4c9ac]">
                                    <span className="text-[#c4c9ac]/60 font-mono text-[11px]">Popular Paths:</span>
                                    {["FullStackGo", "SystemDesign", "LLMEngineering", "CloudKubernetes", "FinTechBackend"].map((tag) => (
                                        <button
                                            key={tag}
                                            onClick={() => handleTagClick(tag)}
                                            className="px-3 py-1 rounded-full bg-[#282a30]/60 hover:bg-[#c3f400] hover:text-[#283500] text-white transition-colors cursor-pointer text-xs font-semibold"
                                        >
                                            #{tag}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Horizon Curve Divider */}
                    <div className="relative w-full -mt-1 z-30 pointer-events-none select-none">
                        <svg className="w-full h-12 md:h-20 object-cover text-[#0c0e14]" fill="none" viewBox="0 0 1440 80" xmlns="http://www.w3.org/2000/svg">
                            <path d="M0 0 C480 80 960 80 1440 0 L1440 80 L0 80 Z" fill="#F8FAFC" />
                        </svg>
                    </div>

                    {/* ==========================================================
                       SECTION 2: LOWER HORIZON (PORCELAIN BENTO SECTION)
                       ========================================================== */}
                    <section className="w-full bg-[#F8FAFC] text-slate-900 pt-8 pb-24 px-6 lg:px-8">
                        <div className="max-w-[1360px] mx-auto">
                            {/* Section Header */}
                            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
                                <div>
                                    <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-slate-200/80 text-slate-800 text-xs font-bold uppercase tracking-wider mb-3">
                                        <span className="w-1.5 h-1.5 rounded-full bg-[#8fb300]" />
                                        Why Ambitious Engineers Choose Zenith
                                    </div>
                                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight">
                                        Engineered to Turn Ambition into Offers.
                                    </h2>
                                    <p className="text-base sm:text-lg text-slate-600 max-w-2xl mt-2">
                                        Traditional bootcamps give you outdated recorded videos. Zenith gives you a live telemetry engine that isolates your blindspots in real time.
                                    </p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="text-xs text-slate-500 font-medium">Platform Cohort Q2:</span>
                                    <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">Applications Open</span>
                                </div>
                            </div>

                            {/* Bento Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                                {/* BENTO 1: ADAPTIVE DAG ROADMAPS (Col-Span 7) */}
                                <div
                                    onClick={() => setActiveTab("learning")}
                                    className="md:col-span-7 bg-white rounded-3xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between cursor-pointer border border-slate-100 hover:border-slate-300"
                                >
                                    <div>
                                        <div className="flex items-center justify-between mb-4">
                                            <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-[10px] font-bold uppercase tracking-wide">
                                                Bento 01 • Directed Acyclic Graph
                                            </span>
                                            <span className="text-xs font-mono text-slate-400">Status: Dynamic Route</span>
                                        </div>
                                        <h3 className="text-2xl font-bold text-slate-900 mb-2">
                                            Adaptive DAG Learning Roadmaps
                                        </h3>
                                        <p className="text-sm text-slate-600 mb-6 max-w-xl">
                                            Knowledge isn’t linear. Zenith maps 1,200+ micro-skills into dependency graphs. If you master Distributed Caching ahead of time, your curriculum automatically recalibrates to system fault tolerance.
                                        </p>

                                        {/* Visual Graph Demonstration */}
                                        <div className="p-6 rounded-2xl bg-slate-50 relative overflow-hidden">
                                            <div className="text-[11px] uppercase text-slate-400 font-bold mb-4 tracking-wider flex items-center justify-between">
                                                <span>Active Branch: Principal Cloud Architect</span>
                                                <span className="text-emerald-600 font-bold">8 Weeks Remaining</span>
                                            </div>

                                            {/* Interactive Node Graph Simulation */}
                                            <div className="grid grid-cols-3 gap-4 items-center">
                                                {/* Node 1 */}
                                                <div className="p-3.5 rounded-xl bg-white shadow-sm flex flex-col">
                                                    <div className="flex items-center justify-between text-[10px] text-emerald-600 font-bold mb-1">
                                                        <span>COMPLETED</span>
                                                        <span className="material-symbols-outlined text-sm">check_circle</span>
                                                    </div>
                                                    <span className="text-xs font-bold text-slate-800">Concurrency Primitives</span>
                                                    <span className="text-[10px] text-slate-500 font-mono mt-0.5">Go Channels & Mutexes</span>
                                                </div>
                                                {/* Node 2 (Active) */}
                                                <div className="p-3.5 rounded-xl bg-slate-900 text-white shadow-md flex flex-col scale-105 border border-[#c3f400]/40">
                                                    <div className="flex items-center justify-between text-[10px] text-[#c3f400] font-bold mb-1">
                                                        <span>IN PROGRESS</span>
                                                        <span className="w-2 h-2 rounded-full bg-[#c3f400] animate-pulse" />
                                                    </div>
                                                    <span className="text-xs font-bold text-white">Event Streams & Kafka</span>
                                                    <span className="text-[10px] text-slate-300 font-mono mt-0.5">Partition Rebalancing</span>
                                                </div>
                                                {/* Node 3 */}
                                                <div className="p-3.5 rounded-xl bg-white shadow-sm flex flex-col opacity-60">
                                                    <div className="flex items-center justify-between text-[10px] text-slate-400 font-bold mb-1">
                                                        <span>NEXT UNLOCKED</span>
                                                        <span className="material-symbols-outlined text-sm">lock</span>
                                                    </div>
                                                    <span className="text-xs font-bold text-slate-800">Consensus Algorithms</span>
                                                    <span className="text-[10px] text-slate-500 font-mono mt-0.5">Paxos & Raft Quorums</span>
                                                </div>
                                            </div>

                                            <div className="mt-4 flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-200">
                                                <span className="flex items-center gap-1">
                                                    <span className="material-symbols-outlined text-base text-slate-600">tune</span>
                                                    Auto-adjusts based on quiz and mock interview scores
                                                </span>
                                                <span className="font-mono font-semibold text-slate-800">42/54 Modules Done</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mt-6 flex items-center justify-between pt-4 border-t border-slate-100">
                                        <span className="text-xs text-slate-500">Benchmark comparison against L5 staff evaluations</span>
                                        <span className="text-xs font-bold text-slate-900 hover:text-emerald-700 flex items-center gap-1">
                                            Explore Live Graph Example →
                                        </span>
                                    </div>
                                </div>

                                {/* BENTO 2: COMPUTER VISION MOCK INTERVIEWS (Col-Span 5) */}
                                <div
                                    onClick={() => {
                                        setActiveTab("job-prep");
                                        setActiveJobSubTab("mock-interview");
                                    }}
                                    className="md:col-span-5 bg-white rounded-3xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between cursor-pointer border border-slate-100 hover:border-slate-300"
                                >
                                    <div>
                                        <div className="flex items-center justify-between mb-4">
                                            <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-[10px] font-bold uppercase tracking-wide">
                                                Bento 02 • Biometric Telemetry
                                            </span>
                                            <span className="inline-flex items-center gap-1 text-xs text-rose-600 font-bold">
                                                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" /> REC 00:14:32
                                            </span>
                                        </div>
                                        <h3 className="text-2xl font-bold text-slate-900 mb-2">
                                            Vision & Speech Mock Engine
                                        </h3>
                                        <p className="text-sm text-slate-600 mb-6">
                                            Zenith’s multimodal model observes your eye contact, pause cadence, filler words, and whiteboard problem structure.
                                        </p>

                                        {/* Visual Simulated Screen */}
                                        <div className="rounded-2xl bg-slate-900 p-4 text-white relative overflow-hidden">
                                            <div className="relative w-full h-40 rounded-xl overflow-hidden bg-slate-800 flex items-center justify-center">
                                                <div className="w-full h-full bg-gradient-to-tr from-slate-900 via-indigo-950 to-slate-800 flex items-center justify-center">
                                                    <span className="material-symbols-outlined text-6xl text-slate-600">person_play</span>
                                                </div>
                                                {/* Overlay */}
                                                <div className="absolute inset-x-4 inset-y-3 border border-dashed border-emerald-400/70 rounded-lg pointer-events-none flex flex-col justify-between p-2">
                                                    <div className="flex justify-between items-center text-[10px] font-mono text-emerald-300 bg-black/60 px-2 py-0.5 rounded backdrop-blur">
                                                        <span>Gaze Alignment: 94%</span>
                                                        <span>No Glare</span>
                                                    </div>
                                                    <div className="text-[10px] font-mono text-[#c3f400] bg-black/60 px-2 py-0.5 rounded w-max backdrop-blur">
                                                        Speech Cadence: 138 WPM (Optimal)
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Feedback Readout */}
                                            <div className="mt-3 grid grid-cols-3 gap-2 text-center text-xs">
                                                <div className="p-2 rounded-lg bg-slate-800/80">
                                                    <div className="text-slate-400 text-[10px]">Filler Words</div>
                                                    <div className="font-bold text-white mt-0.5">1.2 / min</div>
                                                </div>
                                                <div className="p-2 rounded-lg bg-slate-800/80">
                                                    <div className="text-slate-400 text-[10px]">Clarity</div>
                                                    <div className="font-bold text-emerald-400 mt-0.5">Top 4%</div>
                                                </div>
                                                <div className="p-2 rounded-lg bg-slate-800/80">
                                                    <div className="text-slate-400 text-[10px]">Confidence</div>
                                                    <div className="font-bold text-[#c3f400] mt-0.5">High</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                                        <span>Integrated with FAANG rubric guidelines</span>
                                        <span className="font-bold text-slate-800">1:1 Simulation</span>
                                    </div>
                                </div>

                                {/* BENTO 3: ATS RESUME & PORTFOLIO SCANNER (Col-Span 5) */}
                                <div
                                    onClick={() => {
                                        setActiveTab("job-prep");
                                        setActiveJobSubTab("ats-checker");
                                    }}
                                    className="md:col-span-5 bg-white rounded-3xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between cursor-pointer border border-slate-100 hover:border-slate-300"
                                >
                                    <div>
                                        <div className="flex items-center justify-between mb-4">
                                            <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-[10px] font-bold uppercase tracking-wide">
                                                Bento 03 • Hiring Screen Pass
                                            </span>
                                            <span className="px-2.5 py-0.5 rounded-full bg-[#c3f400] text-[#283500] text-xs font-bold">
                                                Match 96%
                                            </span>
                                        </div>
                                        <h3 className="text-2xl font-bold text-slate-900 mb-2">
                                            ATS Deep Scanner & Project Verifier
                                        </h3>
                                        <p className="text-sm text-slate-600 mb-5">
                                            Parse your resume against real job descriptions from Tier-1 engineering teams. Detect missing keywords and architectural impact metrics.
                                        </p>

                                        {/* Radial Gauge Visual Presentation */}
                                        <div className="p-5 rounded-2xl bg-slate-50 flex items-center gap-6">
                                            <div className="relative w-24 h-24 shrink-0 flex items-center justify-center">
                                                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                                                    <circle cx="50" cy="50" fill="transparent" r="40" stroke="#E2E8F0" strokeWidth="10" />
                                                    <circle cx="50" cy="50" fill="transparent" r="40" stroke="#0ea5e9" strokeDasharray="251.2" strokeDashoffset="15" strokeLinecap="round" strokeWidth="10" />
                                                </svg>
                                                <div className="absolute flex flex-col items-center justify-center">
                                                    <span className="text-xl font-bold text-slate-900 leading-none">96%</span>
                                                    <span className="text-[9px] uppercase text-slate-500 font-bold mt-0.5">Parse Rate</span>
                                                </div>
                                            </div>

                                            {/* Checklist */}
                                            <div className="space-y-2 flex-1 text-xs">
                                                <div className="flex items-center justify-between text-slate-700 font-medium">
                                                    <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-500" /> Distributed Tracing</span>
                                                    <span className="font-mono text-emerald-600 font-bold">MATCH</span>
                                                </div>
                                                <div className="flex items-center justify-between text-slate-700 font-medium">
                                                    <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-500" /> Kubernetes Operator</span>
                                                    <span className="font-mono text-emerald-600 font-bold">MATCH</span>
                                                </div>
                                                <div className="flex items-center justify-between text-slate-700 font-medium">
                                                    <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-amber-500" /> eBPF Profiling</span>
                                                    <span className="font-mono text-amber-600 font-bold">SUGGESTED</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                                        <span>Includes 1-click GitHub repo impact transformer</span>
                                        <span className="text-slate-900 font-bold">v3.2 Scanner</span>
                                    </div>
                                </div>

                                {/* BENTO 4: SUB-SECOND CODE DOUBT ENGINE (Col-Span 7) */}
                                <div
                                    onClick={() => setActiveTab("doubt-solver")}
                                    className="md:col-span-7 bg-white rounded-3xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between cursor-pointer border border-slate-100 hover:border-slate-300"
                                >
                                    <div>
                                        <div className="flex items-center justify-between mb-4">
                                            <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-[10px] font-bold uppercase tracking-wide">
                                                Bento 04 • Real-Time AI Pairing
                                            </span>
                                            <span className="font-mono text-xs text-emerald-700 font-semibold">Latency: 84ms</span>
                                        </div>
                                        <h3 className="text-2xl font-bold text-slate-900 mb-2">
                                            Sub-Second Code Doubt Engine
                                        </h3>
                                        <p className="text-sm text-slate-600 mb-5">
                                            Stuck on pointer mechanics, memory leaks, or dynamic programming logic? Highlight the segment and get an architectural breakdown in plain English.
                                        </p>

                                        {/* Split Panel */}
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 rounded-2xl bg-slate-900 p-4 text-white text-xs font-mono">
                                            <div className="p-3 rounded-xl bg-slate-800/90 flex flex-col justify-between">
                                                <div>
                                                    <div className="text-slate-400 text-[10px] uppercase mb-2">Candidate Code Highlight</div>
                                                    <pre className="text-rose-300 font-mono leading-relaxed overflow-x-auto">
                                                        <code>
{`for idx, worker := range pool {
  go func() {
    worker.Run(ctx) // ⚠️ Race
  }()
}`}
                                                        </code>
                                                    </pre>
                                                </div>
                                                <div className="text-[11px] text-rose-400 font-sans mt-3">Bug: Goroutine captures loop pointer variable.</div>
                                            </div>

                                            <div className="p-3 rounded-xl bg-slate-800/90 flex flex-col justify-between border-l-2 border-[#c3f400]">
                                                <div>
                                                    <div className="text-[#c3f400] text-[10px] uppercase mb-2">Zenith Context Explanation</div>
                                                    <p className="text-slate-300 font-sans text-xs leading-relaxed">
                                                        Pass <code className="text-white bg-slate-700 px-1 py-0.5 rounded">worker</code> as an explicit argument to the anonymous closure to bind its memory frame before the next loop tick.
                                                    </p>
                                                </div>
                                                <div className="mt-3 flex items-center gap-1.5 text-[#c3f400] font-sans text-xs font-bold">
                                                    <span className="material-symbols-outlined text-sm">auto_fix_high</span> Applied & Verified in Sandbox
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                                        <span>Supports 28 programming languages and distributed frameworks</span>
                                        <span className="font-bold text-slate-900">Zero Hallucination Guaranteed</span>
                                    </div>
                                </div>
                            </div>

                            {/* ==========================================================
                               METRICS ROW & HIRING PROOF
                               ========================================================== */}
                            <div className="mt-16 grid grid-cols-2 lg:grid-cols-4 gap-6">
                                <div className="bg-white rounded-3xl p-6 shadow-sm flex flex-col">
                                    <span className="text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">50+</span>
                                    <span className="text-sm font-bold text-slate-800 mt-1">Adaptive Curricula</span>
                                    <span className="text-xs text-slate-500 mt-1">Calibrated directly to Big Tech & unicorn hiring matrices</span>
                                </div>
                                <div className="bg-white rounded-3xl p-6 shadow-sm flex flex-col">
                                    <span className="text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">14k+</span>
                                    <span className="text-sm font-bold text-slate-800 mt-1">Mocks Conducted</span>
                                    <span className="text-xs text-slate-500 mt-1">Real-time computer vision sentiment feedback generated</span>
                                </div>
                                <div className="bg-white rounded-3xl p-6 shadow-sm flex flex-col">
                                    <span className="text-4xl lg:text-5xl font-extrabold text-emerald-600 tracking-tight">98.2%</span>
                                    <span className="text-sm font-bold text-slate-800 mt-1">Round 1 Pass Rate</span>
                                    <span className="text-xs text-slate-500 mt-1">For candidates completing their designated DAG tier</span>
                                </div>
                                <div className="bg-white rounded-3xl p-6 shadow-sm flex flex-col">
                                    <span className="text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">3.4x</span>
                                    <span className="text-sm font-bold text-slate-800 mt-1">Faster Time-to-Offer</span>
                                    <span className="text-xs text-slate-500 mt-1">Average reduction from start date to signing accepted role</span>
                                </div>
                            </div>

                            {/* Partner Badges */}
                            <div className="mt-12 py-8 px-6 rounded-3xl bg-slate-100 flex flex-col md:flex-row items-center justify-between gap-6">
                                <div className="text-xs uppercase text-slate-500 font-bold tracking-wider whitespace-nowrap">
                                    Zenith Alumni Engineering At
                                </div>
                                <div className="flex flex-wrap items-center justify-center md:justify-end gap-8 text-slate-700 text-sm font-bold tracking-tight opacity-75">
                                    <span className="hover:text-slate-900 transition-colors">GOOGLE CLOUD</span>
                                    <span className="hover:text-slate-900 transition-colors">STRIPE</span>
                                    <span className="hover:text-slate-900 transition-colors">DATADOG</span>
                                    <span className="hover:text-slate-900 transition-colors">AMAZON AWS</span>
                                    <span className="hover:text-slate-900 transition-colors">UBER PLATFORM</span>
                                    <span className="hover:text-slate-900 transition-colors">SNOWFLAKE</span>
                                </div>
                            </div>

                            {/* ==========================================================
                               CALL TO ACTION BANNER
                               ========================================================== */}
                            <div className="mt-16 rounded-[36px] bg-[#0c0e14] text-[#e2e2eb] p-8 md:p-14 relative overflow-hidden shadow-2xl border border-white/10">
                                <div className="absolute -right-20 -top-20 w-80 h-80 bg-[#c3f400]/20 rounded-full blur-3xl pointer-events-none" />
                                <div className="absolute -left-20 -bottom-20 w-80 h-80 bg-[#d4004b]/20 rounded-full blur-3xl pointer-events-none" />
                                <div className="relative z-10 max-w-3xl mx-auto text-center flex flex-col items-center">
                                    <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white/10 text-white text-xs font-semibold uppercase mb-6 tracking-wider">
                                        Ready to reach your Zenith?
                                    </span>
                                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight mb-4">
                                        Accelerate your engineering trajectory today.
                                    </h2>
                                    <p className="text-sm sm:text-base text-[#c4c9ac] max-w-xl mb-8">
                                        Create your account in under 60 seconds. Our intelligence model will evaluate your GitHub, assess your core strengths, and build your personalized hiring DAG.
                                    </p>

                                    {/* Form */}
                                    <form onSubmit={handleCtaSubmit} className="w-full max-w-md flex flex-col sm:flex-row items-center gap-3">
                                        <input
                                            type="email"
                                            value={ctaEmail}
                                            onChange={(e) => setCtaEmail(e.target.value)}
                                            placeholder="Enter your engineer email..."
                                            className="w-full px-5 py-3.5 rounded-full bg-[#282a30]/90 text-white placeholder:text-[#c4c9ac]/60 border-0 outline-none focus:ring-2 focus:ring-[#c3f400] text-sm"
                                        />
                                        <button
                                            type="submit"
                                            className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-[#c3f400] text-[#283500] font-bold text-xs hover:bg-[#abd600] transition-all shadow-[0_0_20px_-4px_rgba(195,244,0,0.5)] shrink-0 cursor-pointer"
                                        >
                                            {ctaSubmitted ? "Welcome to Zenith!" : "Get Started Free"}
                                        </button>
                                    </form>

                                    <div className="flex items-center gap-6 mt-6 text-xs text-[#c4c9ac]">
                                        <span className="flex items-center gap-1.5">
                                            <span className="material-symbols-outlined text-sm text-[#c3f400]">check_circle</span> No Credit Card Required
                                        </span>
                                        <span className="flex items-center gap-1.5">
                                            <span className="material-symbols-outlined text-sm text-[#c3f400]">check_circle</span> 1 Free Pro Mock Session Included
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </main>

            {/* ==========================================
                FOOTER
                ========================================== */}
            <footer className="w-full bg-[#0c0e14] border-t border-white/5 py-12">
                <div className="max-w-[1360px] mx-auto px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-8 border-b border-white/5">
                        <div className="flex items-center gap-3">
                            <span className="material-symbols-outlined text-[#c3f400] text-2xl">hub</span>
                            <span className="text-xl font-bold text-white">Zenith</span>
                        </div>
                        <p className="text-xs text-[#c4c9ac] max-w-md">
                            Next-generation AI-powered career readiness ecosystem accelerating engineering talent from campus to high-impact careers.
                        </p>
                    </div>

                    <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#c4c9ac]">
                        <span>© 2026 Zenith Systems Inc. All rights reserved.</span>
                        <div className="flex items-center gap-6">
                            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
                            <a href="#" className="hover:text-white transition-colors">Security Trust</a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
