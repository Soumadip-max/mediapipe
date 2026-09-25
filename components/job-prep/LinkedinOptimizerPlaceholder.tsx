"use client";

import React from "react";
import { Sparkles, CheckCircle2, Search, Award } from "lucide-react";

const LinkedinIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.25V10.9H6.46M7.86 6.74a1.63 1.63 0 1 0 0 3.26 1.63 1.63 0 0 0 0-3.26Z" />
    </svg>
);

export default function LinkedinOptimizerPlaceholder() {
    return (
        <div className="w-full max-w-6xl mx-auto py-8 px-4 space-y-8">
            {/* Header Banner */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-950/80 via-slate-900 to-[#07090e] border border-[#c4f82a]/20 p-8 shadow-2xl">
                <div className="absolute top-0 right-0 w-96 h-96 bg-[#c4f82a]/10 rounded-full blur-3xl pointer-events-none" />
                <div className="relative z-10 space-y-3">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#c4f82a]/10 border border-[#c4f82a]/30 text-[#c4f82a] text-xs font-semibold">
                        <LinkedinIcon className="w-3.5 h-3.5" />
                        <span>Recruiter Visibility & Profile Optimizer</span>
                    </div>
                    <h2 className="text-3xl font-extrabold text-white tracking-tight">
                        LinkedIn Profile Strength & Recruiter Searchability
                    </h2>
                    <p className="text-slate-300 max-w-2xl text-sm leading-relaxed">
                        Optimize your LinkedIn headline, summary, and experience section for high recruiter search rank. Get instant AI suggestions to boost inbound interview requests.
                    </p>
                </div>
            </div>

            {/* Feature Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    {
                        icon: Search,
                        title: "Recruiter Searchability",
                        desc: "Analyze keyword density for tech stack terms recruiters search on LinkedIn Recruiter Pro.",
                    },
                    {
                        icon: Sparkles,
                        title: "AI Headline Generator",
                        desc: "Generate high-converting headlines tailored to your target role and experience level.",
                    },
                    {
                        icon: Award,
                        title: "Impact Audit",
                        desc: "Detect weak descriptions and turn vague bullet points into outcome-driven statements.",
                    },
                ].map((item, idx) => (
                    <div
                        key={idx}
                        className="rounded-2xl bg-slate-900/80 border border-slate-800 p-6 space-y-3 hover:border-[#c4f82a]/40 transition-all"
                    >
                        <div className="w-10 h-10 rounded-xl bg-[#c4f82a]/10 border border-[#c4f82a]/30 flex items-center justify-center">
                            <item.icon className="w-5 h-5 text-[#c4f82a]" />
                        </div>
                        <h3 className="text-base font-bold text-white">{item.title}</h3>
                        <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
                    </div>
                ))}
            </div>

            {/* Feature Status Note */}
            <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#c4f82a]/10 border border-[#c4f82a]/30 flex items-center justify-center">
                        <CheckCircle2 className="w-4 h-4 text-[#c4f82a]" />
                    </div>
                    <div>
                        <h4 className="text-sm font-bold text-white">Module 3B Integration Pending</h4>
                        <p className="text-xs text-slate-400">LinkedIn feedback engine route (`app/api/linkedin/route.ts`) will be wired next.</p>
                    </div>
                </div>
                <div className="flex items-center gap-2 text-xs text-[#c4f82a] font-mono">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Shell Mounted</span>
                </div>
            </div>
        </div>
    );
}
