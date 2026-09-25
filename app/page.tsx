"use client";

import React, { useState } from "react";
import TopNavbar, { MainTab, JobSubTab } from "@/components/navigation/TopNavbar";
import FaceAnalyzer from "@/components/FaceAnalyzer";
import RoadmapGraph from "@/components/learning/RoadmapGraph";
import AtsChecker from "@/components/job-prep/AtsChecker";
import LinkedinOptimizer from "@/components/job-prep/LinkedinOptimizer";
import ChatDrawer from "@/components/doubt-solver/ChatDrawer";

export default function Home() {
    const [activeTab, setActiveTab] = useState<MainTab>("job-prep");
    const [activeJobSubTab, setActiveJobSubTab] = useState<JobSubTab>("mock-interview");

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-500/30 selection:text-amber-200">
            {/* Top Bar Router Navigation Shell */}
            <TopNavbar
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                activeJobSubTab={activeJobSubTab}
                setActiveJobSubTab={setActiveJobSubTab}
            />

            {/* Main Content Area */}
            <main className="flex-1 w-full flex flex-col items-center justify-start p-4 md:p-6 transition-all duration-300">
                {/* 1. Learning Prep Pillar */}
                {activeTab === "learning" && <RoadmapGraph />}

                {/* 2. Job Prep Pillar */}
                {activeTab === "job-prep" && (
                    <div className="w-full flex justify-center">
                        {activeJobSubTab === "mock-interview" && <FaceAnalyzer />}
                        {activeJobSubTab === "ats-checker" && <AtsChecker />}
                        {activeJobSubTab === "linkedin-optimizer" && <LinkedinOptimizer />}
                    </div>
                )}

                {/* 3. Doubt Solver Pillar */}
                {activeTab === "doubt-solver" && <ChatDrawer />}
            </main>
        </div>
    );
}