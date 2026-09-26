"use client";

import React from "react";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

interface ThemeToggleProps {
    className?: string;
    variant?: "pill" | "icon";
}

export default function ThemeToggle({ className = "", variant = "pill" }: ThemeToggleProps) {
    const { theme, toggleTheme } = useTheme();
    const isLight = theme === "light";

    if (variant === "icon") {
        return (
            <button
                type="button"
                onClick={toggleTheme}
                className={`relative p-2 rounded-full border transition-all duration-300 focus:outline-none cursor-pointer ${
                    isLight
                        ? "bg-slate-100 hover:bg-slate-200 border-slate-300 text-amber-600 shadow-sm"
                        : "bg-[#0f1422] hover:bg-slate-800 border-slate-700/80 text-[#c4f82a] shadow-[0_0_12px_rgba(196,248,42,0.15)]"
                } ${className}`}
                title={isLight ? "Switch to Dark Mode" : "Switch to Light Mode"}
                aria-label={isLight ? "Switch to Dark Mode" : "Switch to Light Mode"}
            >
                {isLight ? (
                    <Moon className="w-4 h-4 transition-transform duration-300 rotate-0 hover:-rotate-12" />
                ) : (
                    <Sun className="w-4 h-4 transition-transform duration-300 rotate-0 hover:rotate-45" />
                )}
            </button>
        );
    }

    return (
        <button
            type="button"
            onClick={toggleTheme}
            className={`group relative flex items-center gap-2.5 px-3.5 py-2 rounded-full border text-xs font-semibold transition-all duration-300 focus:outline-none cursor-pointer select-none ${
                isLight
                    ? "bg-white hover:bg-slate-50 border-slate-200 text-slate-700 shadow-sm hover:border-slate-300"
                    : "bg-[#0c0e14] hover:bg-slate-800 border-white/10 text-slate-200 hover:text-white shadow-[0_0_10px_rgba(0,0,0,0.4)]"
            } ${className}`}
            title={isLight ? "Switch to Dark Mode" : "Switch to Light Mode"}
            aria-label={isLight ? "Switch to Dark Mode" : "Switch to Light Mode"}
        >
            <div
                className={`w-6 h-6 rounded-full flex items-center justify-center transition-all duration-300 ${
                    isLight
                        ? "bg-amber-100 text-amber-600"
                        : "bg-slate-800 group-hover:bg-[#c4f82a] group-hover:text-[#07090e] text-[#c4f82a]"
                }`}
            >
                {isLight ? (
                    <Moon className="w-3.5 h-3.5 transition-transform duration-300 group-hover:-rotate-12" />
                ) : (
                    <Sun className="w-3.5 h-3.5 transition-transform duration-300 group-hover:rotate-45" />
                )}
            </div>
            <span className="text-xs font-semibold tracking-tight">
                {isLight ? "Dark Mode" : "Light Mode"}
            </span>
        </button>
    );
}
