"use client";

import { useEffect, useState } from "react";

export interface UseTypewriterOptions {
    typeMs?: number;
    deleteMs?: number;
    holdMs?: number;
    gapMs?: number;
    enabled?: boolean;
}

export type TypewriterPhase = "typing" | "holding" | "deleting" | "idle";

export function useTypewriter(
    prompts: string[],
    {
        typeMs = 48,
        deleteMs = 14,
        holdMs = 3400,
        gapMs = 900,
        enabled = true,
    }: UseTypewriterOptions = {}
) {
    const [promptIndex, setPromptIndex] = useState(0);
    const [charIndex, setCharIndex] = useState(0);
    const [phase, setPhase] = useState<TypewriterPhase>("typing");

    useEffect(() => {
        if (!enabled || !prompts || prompts.length === 0) {
            setPhase("idle");
            return;
        }

        const currentPrompt = prompts[promptIndex % prompts.length];

        let timer: NodeJS.Timeout;

        if (phase === "typing") {
            if (charIndex < currentPrompt.length) {
                timer = setTimeout(() => {
                    setCharIndex((prev) => prev + 1);
                }, typeMs);
            } else {
                setPhase("holding");
            }
        } else if (phase === "holding") {
            timer = setTimeout(() => {
                setPhase("deleting");
            }, holdMs);
        } else if (phase === "deleting") {
            if (charIndex > 0) {
                timer = setTimeout(() => {
                    setCharIndex((prev) => prev - 1);
                }, deleteMs);
            } else {
                setPhase("idle");
                timer = setTimeout(() => {
                    setPromptIndex((prev) => (prev + 1) % prompts.length);
                    setPhase("typing");
                }, gapMs);
            }
        } else if (phase === "idle") {
            timer = setTimeout(() => {
                setPhase("typing");
            }, gapMs);
        }

        return () => clearTimeout(timer);
    }, [charIndex, phase, promptIndex, prompts, typeMs, deleteMs, holdMs, gapMs, enabled]);

    const currentPrompt = prompts && prompts.length > 0 ? prompts[promptIndex % prompts.length] : "";
    const text = currentPrompt.slice(0, charIndex);

    return { text, phase };
}
