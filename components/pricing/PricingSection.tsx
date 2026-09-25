"use client";

import React from "react";
import { Check, Sparkles, Zap, Shield, ChevronRight } from "lucide-react";
import { MainTab } from "@/components/navigation/TopNavbar";

interface PricingSectionProps {
    setActiveTab: (tab: MainTab) => void;
}

export default function PricingSection({ setActiveTab }: PricingSectionProps) {
    return (
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col items-center">
            {/* Header */}
            <div className="text-center max-w-3xl mb-12 space-y-4">
                <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#c4f82a]/10 text-[#c4f82a] border border-[#c4f82a]/30">
                    PLACEMENT ACCELERATION PRICING
                </span>
                <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
                    Invest in Your <span className="text-[#c4f82a]">Career Growth</span>
                </h2>
                <p className="text-slate-400 text-sm sm:text-base">
                    Choose the plan that fits your engineering placement goals. Unlocks computer vision mock interviews, ATS resume optimization, and 24/7 AI doubt solving.
                </p>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full items-stretch">
                {/* Starter */}
                <div className="bg-[#0d111a] border border-slate-800 rounded-2xl p-8 flex flex-col justify-between hover:border-slate-700 transition-all">
                    <div>
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold text-white">Starter</h3>
                            <Zap className="w-5 h-5 text-slate-500" />
                        </div>
                        <p className="text-xs text-slate-400 mb-6">Essential prep for engineers exploring top tech roles.</p>
                        <div className="mb-6">
                            <span className="text-4xl font-black text-white">$0</span>
                            <span className="text-slate-500 text-xs font-semibold ml-1">/ forever free</span>
                        </div>

                        <ul className="space-y-3 text-xs text-slate-300 border-t border-slate-800/80 pt-6">
                            <li className="flex items-center gap-2">
                                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                                <span>3 AI Mock Interviews / month</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                                <span>Basic Dynamic Learning Roadmaps</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                                <span>ATS Resume Checker (5 scans)</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                                <span>Community Doubt Solver</span>
                            </li>
                        </ul>
                    </div>

                    <button
                        onClick={() => setActiveTab("learning")}
                        className="mt-8 w-full py-3 rounded-full bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition-all"
                    >
                        Get Started Free
                    </button>
                </div>

                {/* Pro (Featured) */}
                <div className="relative bg-[#0e1422] border-2 border-[#c4f82a] rounded-2xl p-8 flex flex-col justify-between shadow-[0_0_40px_rgba(196,248,42,0.15)] transform md:-translate-y-2">
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-[#c4f82a] text-[#07090e] font-black text-[10px] uppercase tracking-wider shadow-md">
                        MOST POPULAR FOR TIER 1 PLACEMENT
                    </div>

                    <div>
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-2xl font-black text-white">Pro Apex</h3>
                            <Sparkles className="w-5 h-5 text-[#c4f82a]" />
                        </div>
                        <p className="text-xs text-slate-300 mb-6">Full computer vision telemetry & unlimited interview practice.</p>
                        <div className="mb-6">
                            <span className="text-5xl font-black text-[#c4f82a]">$29</span>
                            <span className="text-slate-400 text-xs font-semibold ml-1">/ month</span>
                        </div>

                        <ul className="space-y-3 text-xs text-slate-200 border-t border-slate-800 pt-6">
                            <li className="flex items-center gap-2">
                                <Check className="w-4 h-4 text-[#c4f82a] shrink-0" />
                                <strong>Unlimited Real-Time CV Mock Interviews</strong>
                            </li>
                            <li className="flex items-center gap-2">
                                <Check className="w-4 h-4 text-[#c4f82a] shrink-0" />
                                <span>Eye Contact & Emotion Telemetry</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <Check className="w-4 h-4 text-[#c4f82a] shrink-0" />
                                <span>Unlimited Instant ATS Scans & Rewrites</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <Check className="w-4 h-4 text-[#c4f82a] shrink-0" />
                                <span>24/7 Contextual Code Inspector & Debugger</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <Check className="w-4 h-4 text-[#c4f82a] shrink-0" />
                                <span>LinkedIn Profile AI Transformer</span>
                            </li>
                        </ul>
                    </div>

                    <button
                        onClick={() => setActiveTab("learning")}
                        className="mt-8 w-full py-3 rounded-full bg-[#c4f82a] hover:bg-[#b4ee1b] text-[#07090e] font-extrabold text-xs shadow-[0_0_20px_rgba(196,248,42,0.4)] transition-all flex items-center justify-center gap-1"
                    >
                        <span>Start Pro Trial</span>
                        <ChevronRight className="w-4 h-4 stroke-[3]" />
                    </button>
                </div>

                {/* Enterprise / Team */}
                <div className="bg-[#0d111a] border border-slate-800 rounded-2xl p-8 flex flex-col justify-between hover:border-slate-700 transition-all">
                    <div>
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold text-white">University / Team</h3>
                            <Shield className="w-5 h-5 text-purple-400" />
                        </div>
                        <p className="text-xs text-slate-400 mb-6">Dedicated placement dashboard for colleges & coding bootcamps.</p>
                        <div className="mb-6">
                            <span className="text-4xl font-black text-white">$99</span>
                            <span className="text-slate-500 text-xs font-semibold ml-1">/ seat / year</span>
                        </div>

                        <ul className="space-y-3 text-xs text-slate-300 border-t border-slate-800/80 pt-6">
                            <li className="flex items-center gap-2">
                                <Check className="w-4 h-4 text-purple-400 shrink-0" />
                                <span>Cohort Analytics & Candidate Ranking</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <Check className="w-4 h-4 text-purple-400 shrink-0" />
                                <span>Custom Interview Questions & Rubrics</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <Check className="w-4 h-4 text-purple-400 shrink-0" />
                                <span>Bulk ATS Resume Batch Processing</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <Check className="w-4 h-4 text-purple-400 shrink-0" />
                                <span>Dedicated Account Manager & API Access</span>
                            </li>
                        </ul>
                    </div>

                    <button
                        onClick={() => setActiveTab("home")}
                        className="mt-8 w-full py-3 rounded-full bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition-all"
                    >
                        Contact Sales
                    </button>
                </div>
            </div>
        </div>
    );
}
