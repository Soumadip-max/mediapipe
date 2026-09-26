"use client";

import React, { useState } from "react";
import { MainTab, JobSubTab } from "@/components/navigation/TopNavbar";
import { useUser, SignInButton, UserButton } from "@clerk/nextjs";
import HoverFooter from "@/components/ui/hover-footer";

interface LandingHeroProps {
    setActiveTab: (tab: MainTab) => void;
    setActiveJobSubTab: (subTab: JobSubTab) => void;
}

export default function LandingHero({ setActiveTab, setActiveJobSubTab }: LandingHeroProps) {
    const { isSignedIn } = useUser();
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
        <div className="w-full bg-transparent text-[#e2e2eb] font-sans antialiased selection:bg-[#c3f400] selection:text-[#283500] min-h-screen">
            {/* ==========================================
                HEADER BAR (Stitch Nav matching provided HTML)
                ========================================== */}
            <header className="fixed top-0 inset-x-0 z-50 bg-[#090a0f]/80 backdrop-blur-md border-b border-white/10">
                <div className="h-20 max-w-[1360px] mx-auto px-6 lg:px-8 flex items-center justify-between gap-6">
                    {/* Brand Logo & Name */}
                    <button
                        onClick={() => setActiveTab("learning")}
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
                        {!isSignedIn ? (
                            <SignInButton mode="modal">
                                <button className="inline-flex items-center justify-center px-4 py-2 rounded-full border border-white/15 bg-white/5 text-xs font-semibold text-white hover:bg-white/10 transition-all cursor-pointer">
                                    Log In
                                </button>
                            </SignInButton>
                        ) : null}
                        <button
                            onClick={() => setActiveTab("learning")}
                            className="inline-flex items-center justify-center px-5 py-2 rounded-full bg-[#c3f400] text-xs font-bold text-[#283500] hover:bg-[#abd600] transition-all shadow-[0_0_20px_-4px_rgba(195,244,0,0.5)] cursor-pointer"
                        >
                            Get Started
                        </button>
                        {isSignedIn ? <UserButton /> : null}
                    </div>
                </div>
            </header>

            {/* ==========================================
                MAIN CONTENT
                ========================================== */}
            <main className="w-full pt-4 sm:pt-6 bg-transparent">
                <div className="flex flex-col w-full">
                    {/* ==========================================
                       SECTION 1: THE UPPER COSMOS (MIDNIGHT HERO)
                       ========================================== */}
                    <section className="relative w-full bg-transparent overflow-hidden pb-28 pt-4">
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
                </div>
            </main>

            {/* ==========================================
                HOVER FOOTER COMPONENT
                ========================================== */}
            <HoverFooter />
        </div>
    );
}
