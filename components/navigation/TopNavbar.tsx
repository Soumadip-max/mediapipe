"use client";

import React, { useState } from "react";
import {
    BookOpen,
    Video,
    FileText,
    Sparkles,
    MessageSquare,
    ArrowRight,
    ArrowLeft,
} from "lucide-react";
import ThemeToggle from "@/components/ui/ThemeToggle";
import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuList,
    NavigationMenuTrigger,
    NavigationMenuViewport,
} from "@/components/ui/navigation-menu";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import React from "react";
import { BookOpen, Briefcase, MessageSquare, Video, FileText, Sparkles, User, ArrowLeft } from "lucide-react";
import { useUser, SignInButton, UserButton } from "@clerk/nextjs";

export type MainTab = "home" | "learning" | "job-prep" | "doubt-solver" | "profile";
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
    const [mobileOpen, setMobileOpen] = useState(false);
    const { isSignedIn } = useUser();

    const handleNavSelect = (tab: MainTab, subTab?: JobSubTab) => {
        setActiveTab(tab);
        if (subTab) setActiveJobSubTab(subTab);
        setMobileOpen(false);
    };

    return (
        <header className="sticky top-0 inset-x-0 z-50 w-full bg-[#090a0f]/90 backdrop-blur-xl border-b border-white/10 shadow-lg">
            <div className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 flex items-center justify-between h-20 sm:h-[84px] gap-4">
                {/* ── Left: Back Button, Mobile Trigger & Brand Logo ── */}
                <div className="flex items-center gap-3 shrink-0">
                    {/* Entire Left Navigation Back Button */}
                    <button
                        onClick={() => {
                            if (activeTab !== "home") {
                                setActiveTab("home");
                            } else {
                                setActiveTab("learning");
                            }
                        }}
                        className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-[#0c0e14] border border-white/15 hover:border-[#c3f400] hover:bg-slate-800 text-slate-200 hover:text-white transition-all text-xs font-bold group shadow-sm cursor-pointer shrink-0"
                        title={activeTab !== "home" ? "Return to Landing Page" : "Back / Navigate to Learning"}
                    >
                        <div className="w-6 h-6 rounded-full bg-slate-800 group-hover:bg-[#c3f400] group-hover:text-[#07090e] text-slate-300 flex items-center justify-center transition-all shadow-sm">
                            <ArrowLeft className="w-3.5 h-3.5 stroke-[2.5] group-hover:-translate-x-0.5 transition-transform" />
                        </div>
                        <span className="font-bold text-xs tracking-tight hidden sm:inline-block">
                            {activeTab !== "home" ? "Back" : "Back"}
                        </span>
                    </button>

                    {/* Mobile Morphing Hamburger Button with Popover */}
                    <Popover open={mobileOpen} onOpenChange={setMobileOpen}>
                        <PopoverTrigger asChild>
                            <Button
                                className="group size-10 lg:hidden rounded-xl border border-white/15 bg-[#0c0e14] text-slate-200 hover:text-white hover:bg-slate-800"
                                variant="ghost"
                                size="icon"
                                aria-label="Toggle Navigation Menu"
                            >
                                <svg
                                    className="pointer-events-none"
                                    width={20}
                                    height={20}
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2.2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <path
                                        d="M4 12L20 12"
                                        className="origin-center -translate-y-[7px] transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.1)] group-aria-expanded:translate-x-0 group-aria-expanded:translate-y-0 group-aria-expanded:rotate-[315deg]"
                                    />
                                    <path
                                        d="M4 12H20"
                                        className="origin-center transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.8)] group-aria-expanded:rotate-45"
                                    />
                                    <path
                                        d="M4 12H20"
                                        className="origin-center translate-y-[7px] transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.1)] group-aria-expanded:translate-y-0 group-aria-expanded:rotate-[135deg]"
                                    />
                                </svg>
                            </Button>
                        </PopoverTrigger>

                        <PopoverContent align="start" className="w-80 p-3 bg-[#0c0e14]/98 border border-slate-800 text-slate-100 shadow-2xl backdrop-blur-2xl rounded-2xl lg:hidden">
                            <div className="space-y-3 p-1">
                                <button
                                    onClick={() => handleNavSelect("home")}
                                    className={cn(
                                        "w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all text-left",
                                        activeTab === "home"
                                            ? "bg-[#c3f400] text-[#283500] font-bold"
                                            : "bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white"
                                    )}
                                >
                                    <span className="material-symbols-outlined text-[#c3f400] text-base">home</span>
                                    <span>Home Landing Page</span>
                                </button>

                                <div className="h-px bg-slate-800/80 w-full" />

                                <div>
                                    <div className="text-[11px] font-bold uppercase tracking-wider text-[#c3f400] px-3.5 py-1">
                                        Roadmaps & Learning
                                    </div>
                                    <button
                                        onClick={() => handleNavSelect("learning")}
                                        className={cn(
                                            "w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all text-left",
                                            activeTab === "learning"
                                                ? "bg-[#c3f400] text-[#283500] font-bold"
                                                : "text-slate-300 hover:bg-white/10 hover:text-white"
                                        )}
                                    >
                                        <BookOpen className="w-4 h-4 text-[#c3f400] shrink-0" />
                                        <div>
                                            <div className="font-semibold text-white">Dynamic Roadmaps</div>
                                            <div className="text-[11px] text-slate-400">DAG skill trees & fullstack learning paths</div>
                                        </div>
                                    </button>
                                </div>

                                <div className="h-px bg-slate-800/80 w-full" />

                                <div>
                                    <div className="text-[11px] font-bold uppercase tracking-wider text-[#c3f400] px-3.5 py-1">
                                        Job Prep Studio
                                    </div>
                                    <div className="space-y-1 mt-1">
                                        <button
                                            onClick={() => handleNavSelect("job-prep", "mock-interview")}
                                            className={cn(
                                                "w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all text-left",
                                                activeTab === "job-prep" && activeJobSubTab === "mock-interview"
                                                    ? "bg-[#c3f400] text-[#283500] font-bold"
                                                    : "text-slate-300 hover:bg-white/10 hover:text-white"
                                            )}
                                        >
                                            <Video className="w-4 h-4 text-[#c3f400] shrink-0" />
                                            <span>Live Interview Vision</span>
                                        </button>
                                        <button
                                            onClick={() => handleNavSelect("job-prep", "ats-checker")}
                                            className={cn(
                                                "w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all text-left",
                                                activeTab === "job-prep" && activeJobSubTab === "ats-checker"
                                                    ? "bg-[#c3f400] text-[#283500] font-bold"
                                                    : "text-slate-300 hover:bg-white/10 hover:text-white"
                                            )}
                                        >
                                            <FileText className="w-4 h-4 text-[#c3f400] shrink-0" />
                                            <span>Instant ATS Resume Matcher</span>
                                        </button>
                                        <button
                                            onClick={() => handleNavSelect("job-prep", "linkedin-optimizer")}
                                            className={cn(
                                                "w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all text-left",
                                                activeTab === "job-prep" && activeJobSubTab === "linkedin-optimizer"
                                                    ? "bg-[#c3f400] text-[#283500] font-bold"
                                                    : "text-slate-300 hover:bg-white/10 hover:text-white"
                                            )}
                                        >
                                            <Sparkles className="w-4 h-4 text-[#c3f400] shrink-0" />
                                            <span>LinkedIn Profile Inspector</span>
                                        </button>
                                    </div>
                                </div>

                                <div className="h-px bg-slate-800/80 w-full" />

                                <div>
                                    <div className="text-[11px] font-bold uppercase tracking-wider text-[#c3f400] px-3.5 py-1">
                                        AI Assistance
                                    </div>
                                    <button
                                        onClick={() => handleNavSelect("doubt-solver")}
                                        className={cn(
                                            "w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all text-left",
                                            activeTab === "doubt-solver"
                                                ? "bg-[#c3f400] text-[#283500] font-bold"
                                                : "text-slate-300 hover:bg-white/10 hover:text-white"
                                        )}
                                    >
                                        <MessageSquare className="w-4 h-4 text-[#c3f400] shrink-0" />
                                        <div className="font-semibold text-white">Doubt Engine</div>
                                    </button>
                                </div>
                            </div>
                        </PopoverContent>
                    </Popover>

                    {/* Zenith Brand Logo */}
                    <button
                        onClick={() => setActiveTab("home")}
                        className="flex items-center gap-3.5 group cursor-pointer focus:outline-none"
                    >
                        <div className="w-10 h-10 rounded-full bg-[#0c0e14] border border-[#444933] flex items-center justify-center p-2 shadow-[0_0_15px_rgba(195,244,0,0.25)] group-hover:border-[#c3f400] group-hover:scale-105 transition-all">
                            <span className="material-symbols-outlined text-[#c3f400] text-2xl font-bold">hub</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <span className="text-2xl font-bold tracking-tight text-white group-hover:text-[#c3f400] transition-colors">
                                Zenith
                            </span>
                        </div>
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
                                    ? "bg-[#c4f82a] text-[#07090e] font-extrabold shadow-[0_0_15px_rgba(196,248,42,0.3)]"
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
                                    ? "bg-[#c4f82a] text-[#07090e] font-extrabold shadow-[0_0_15px_rgba(196,248,42,0.3)]"
                                    : "text-slate-400 hover:text-white hover:bg-slate-800/60"
                            }`}
                        >
                            <MessageSquare className="w-3.5 h-3.5" />
                            <span>Doubt Solver</span>
                        </button>

                        <button
                            onClick={() => setActiveTab("profile")}
                            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                                activeTab === "profile"
                                    ? "bg-[#c4f82a] text-[#07090e] font-extrabold shadow-[0_0_15px_rgba(196,248,42,0.3)]"
                                    : "text-slate-400 hover:text-white hover:bg-slate-800/60"
                            }`}
                        >
                            <User className="w-3.5 h-3.5" />
                            <span>Evaluation Profile</span>
                        </button>
                    </nav>

                    {/* Right Hand User Avatar / Profile */}
                    <div className="flex items-center gap-3">
                        {!isSignedIn ? (
                            <SignInButton mode="modal">
                                <button className="px-4 py-1.5 rounded-full text-xs font-bold bg-[#c4f82a] text-[#07090e] hover:bg-[#b0df26] transition-colors shadow-sm cursor-pointer">
                                    Sign In
                                </button>
                            </SignInButton>
                        ) : (
                            <UserButton />
                        )}
                    </div>
                </div>

                {/* ── Center: Desktop NavigationMenu (Centered in Nav) ── */}
                <div className="hidden lg:flex items-center justify-center">
                    <NavigationMenu>
                        <NavigationMenuList className="gap-2 bg-[#0c0e14]/80 p-1.5 rounded-full border border-white/10 shadow-inner">
                            
                            {/* Roadmaps */}
                            <NavigationMenuItem>
                                <button
                                    onClick={() => setActiveTab("learning")}
                                    className={cn(
                                        "px-5 py-2 font-semibold text-sm rounded-full transition-all cursor-pointer flex items-center gap-2",
                                        activeTab === "learning"
                                            ? "bg-[#c3f400] text-[#283500] font-bold shadow-[0_0_15px_rgba(195,244,0,0.3)]"
                                            : "text-[#c4c9ac] hover:text-white hover:bg-white/10"
                                    )}
                                >
                                    <BookOpen className="w-4 h-4" />
                                    <span>Roadmaps</span>
                                </button>
                            </NavigationMenuItem>

                            {/* Job Prep Studio */}
                            <NavigationMenuItem>
                                <NavigationMenuTrigger
                                    onClick={() => {
                                        setActiveTab("job-prep");
                                        setActiveJobSubTab("mock-interview");
                                    }}
                                    className={cn(
                                        "px-5 py-2 font-semibold text-sm rounded-full transition-all cursor-pointer bg-transparent border-0 shadow-none",
                                        activeTab === "job-prep"
                                            ? "bg-[#c3f400] text-[#283500] font-bold shadow-[0_0_15px_rgba(195,244,0,0.3)] data-[state=open]:bg-[#c3f400] data-[state=open]:text-[#283500]"
                                            : "text-[#c4c9ac] hover:text-white hover:bg-white/10"
                                    )}
                                >
                                    <div className="flex items-center gap-2">
                                        <Video className="w-4 h-4" />
                                        <span>Job Prep Studio</span>
                                    </div>
                                </NavigationMenuTrigger>
                                <NavigationMenuContent className="p-2.5 bg-[#0c0e14]/98 border border-white/10 rounded-2xl shadow-xl backdrop-blur-2xl">
                                    <ul className="grid w-[380px] gap-2 p-1">
                                        <li>
                                            <button
                                                onClick={() => handleNavSelect("job-prep", "mock-interview")}
                                                className={cn(
                                                    "w-full flex items-center gap-3.5 p-3 rounded-xl transition-all text-left group cursor-pointer",
                                                    activeTab === "job-prep" && activeJobSubTab === "mock-interview"
                                                        ? "bg-[#1f2214] border border-[#c3f400]/40 text-white"
                                                        : "hover:bg-white/10 text-white"
                                                )}
                                            >
                                                <div className="w-9 h-9 rounded-xl bg-[#c3f400]/10 text-[#c3f400] flex items-center justify-center shrink-0 border border-[#c3f400]/20">
                                                    <Video className="w-4 h-4 text-[#c3f400]" />
                                                </div>
                                                <div className="text-sm font-bold text-white group-hover:text-[#c3f400] transition-colors flex items-center gap-2">
                                                    <span>Live Interview Vision</span>
                                                </div>
                                            </button>
                                        </li>

                                        <li>
                                            <button
                                                onClick={() => handleNavSelect("job-prep", "ats-checker")}
                                                className={cn(
                                                    "w-full flex items-center gap-3.5 p-3 rounded-xl transition-all text-left group cursor-pointer",
                                                    activeTab === "job-prep" && activeJobSubTab === "ats-checker"
                                                        ? "bg-[#1f2214] border border-[#c3f400]/40 text-white"
                                                        : "hover:bg-white/10 text-white"
                                                )}
                                            >
                                                <div className="w-9 h-9 rounded-xl bg-[#c3f400]/10 text-[#c3f400] flex items-center justify-center shrink-0 border border-[#c3f400]/20">
                                                    <FileText className="w-4 h-4 text-[#c3f400]" />
                                                </div>
                                                <div className="text-sm font-bold text-white group-hover:text-[#c3f400] transition-colors">
                                                    <span>Instant ATS Resume Matcher</span>
                                                </div>
                                            </button>
                                        </li>

                                        <li>
                                            <button
                                                onClick={() => handleNavSelect("job-prep", "linkedin-optimizer")}
                                                className={cn(
                                                    "w-full flex items-center gap-3.5 p-3 rounded-xl transition-all text-left group cursor-pointer",
                                                    activeTab === "job-prep" && activeJobSubTab === "linkedin-optimizer"
                                                        ? "bg-[#1f2214] border border-[#c3f400]/40 text-white"
                                                        : "hover:bg-white/10 text-white"
                                                )}
                                            >
                                                <div className="w-9 h-9 rounded-xl bg-[#c3f400]/10 text-[#c3f400] flex items-center justify-center shrink-0 border border-[#c3f400]/20">
                                                    <Sparkles className="w-4 h-4 text-[#c3f400]" />
                                                </div>
                                                <div className="text-sm font-bold text-white group-hover:text-[#c3f400] transition-colors">
                                                    <span>LinkedIn Profile Inspector</span>
                                                </div>
                                            </button>
                                        </li>
                                    </ul>
                                </NavigationMenuContent>
                            </NavigationMenuItem>

                            {/* Doubt Engine */}
                            <NavigationMenuItem>
                                <button
                                    onClick={() => setActiveTab("doubt-solver")}
                                    className={cn(
                                        "px-5 py-2 font-semibold text-sm rounded-full transition-all cursor-pointer flex items-center gap-2",
                                        activeTab === "doubt-solver"
                                            ? "bg-[#c3f400] text-[#283500] font-bold shadow-[0_0_15px_rgba(195,244,0,0.3)]"
                                            : "text-[#c4c9ac] hover:text-white hover:bg-white/10"
                                    )}
                                >
                                    <MessageSquare className="w-4 h-4" />
                                    <span>Doubt Engine</span>
                                </button>
                            </NavigationMenuItem>
                        </NavigationMenuList>
                        <NavigationMenuViewport />
                    </NavigationMenu>
                </div>

                {/* ── Right: Action Buttons, Theme Toggle, Auth & Profile ── */}
                <div className="flex items-center gap-3.5 shrink-0">
                    <ThemeToggle variant="pill" />
                    
                    <SignedOut>
                        <SignInButton mode="modal">
                            <Button
                                variant="ghost"
                                size="sm"
                                className="hidden sm:inline-flex text-xs font-semibold text-white border border-white/15 bg-white/5 hover:bg-white/10 px-4 py-2 rounded-full cursor-pointer"
                            >
                                Log In
                            </Button>
                        </SignInButton>

                        <SignInButton mode="modal">
                            <Button
                                size="sm"
                                className="hidden sm:inline-flex text-xs font-bold bg-[#c3f400] text-[#283500] hover:bg-[#abd600] px-4 py-2 rounded-full shadow-[0_0_18px_rgba(195,244,0,0.35)] cursor-pointer"
                            >
                                <span>Get Started</span>
                                <ArrowRight className="w-3.5 h-3.5 ml-1" />
                            </Button>
                        </SignInButton>
                    </SignedOut>

                    <SignedIn>
                        <UserButton
                            appearance={{
                                elements: {
                                    avatarBox: "w-9 h-9 border border-[#c3f400]/40 shadow-sm",
                                },
                            }}
                        />
                    </SignedIn>
                </div>
            </div>
        </header>
    );
}
