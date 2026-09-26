"use client";

import React, { useState } from "react";
import TopNavbar, { MainTab, JobSubTab } from "@/components/navigation/TopNavbar";
import LandingHero from "@/components/landing/LandingHero";
import FaceAnalyzer from "@/components/job-prep/FaceAnalyzer";
import RoadmapGraph from "@/components/learning/RoadmapGraph";
import AtsChecker from "@/components/job-prep/AtsChecker";
import LinkedinOptimizer from "@/components/job-prep/LinkedinOptimizer";
import ChatDrawer from "@/components/doubt-solver/ChatDrawer";
import UserProfileView from "@/components/profile/UserProfileView";
import KineticGrid from "@/components/ui/kinetic-grid";

export default function Home() {
    const [activeTab, setActiveTab] = useState<MainTab>("home");
    const [activeJobSubTab, setActiveJobSubTab] = useState<JobSubTab>("mock-interview");

    const handleTabChange = (tab: MainTab) => {
        setActiveTab(tab);
    };

    return (
        <KineticGrid className="min-h-screen text-slate-100 flex flex-col font-sans selection:bg-[#c4f82a]/30 selection:text-[#c4f82a]">
            {/* Top Bar Navigation Header */}
            <TopNavbar
                activeTab={activeTab}
                setActiveTab={handleTabChange}
                activeJobSubTab={activeJobSubTab}
                setActiveJobSubTab={setActiveJobSubTab}
            />

            {/* Main Application Container */}
            <main className="flex-1 w-full flex flex-col items-center justify-start p-4 md:p-6 transition-all duration-300">
                {/* 1. Zenith Landing Page Hero Showcase */}
                {activeTab === "home" && (
                    <LandingHero
                        setActiveTab={handleTabChange}
                        setActiveJobSubTab={setActiveJobSubTab}
                    />
                )}

                {/* 2. Roadmaps (Learning Prep Pillar) */}
                {activeTab === "learning" && (
                    <div className="w-full max-w-7xl">
                        <RoadmapGraph onOpenDoubtSolver={() => setActiveTab("doubt-solver")} />
                    </div>
                )}

                {/* 3. Job Prep Pillar (Mock Interview / Resume ATS / LinkedIn) */}
                {activeTab === "job-prep" && (
                    <div className="w-full max-w-7xl flex justify-center">
                        {activeJobSubTab === "mock-interview" && <FaceAnalyzer />}
                        {activeJobSubTab === "ats-checker" && <AtsChecker />}
                        {activeJobSubTab === "linkedin-optimizer" && <LinkedinOptimizer />}
                    </div>
                )}

                {/* 4. Doubt Solver Pillar */}
                {activeTab === "doubt-solver" && (
                    <div className="w-full max-w-7xl">
                        <ChatDrawer />
                    </div>
                )}

                {/* 5. Candidate Evaluation Profile Pillar */}
                {activeTab === "profile" && (
                    <div className="w-full max-w-7xl">
                        <UserProfileView onNavigateTab={handleTabChange} />
                    </div>
                )}
            </main>

            {/* Footer */}
            <footer className="w-full border-t border-slate-800/60 py-6 px-4 bg-[#05070b] text-center text-xs text-slate-500">
                <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-300">Zenith AI Platform</span>
                        <span>© 2026 Zenith Career Systems Inc. All rights reserved.</span>
                    </div>
                    <div className="flex items-center gap-4 text-slate-400">
                        <button onClick={() => handleTabChange("home")} className="hover:text-[#c4f82a] transition-colors">
                            Home
                        </button>
                        <button onClick={() => handleTabChange("learning")} className="hover:text-[#c4f82a] transition-colors">
                            Roadmaps
                        </button>
                    </div>
                </div>
            </footer>
        </KineticGrid>
    );
}