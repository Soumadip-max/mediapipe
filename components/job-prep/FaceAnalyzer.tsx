"use client";

import React, { useEffect, useRef, useState } from "react";
import { FilesetResolver, FaceLandmarker } from "@mediapipe/tasks-vision";
import AudioRecorder from "@/components/job-prep/AudioRecorder";
import {
    Bot,
    User,
    Volume2,
    RotateCcw,
    Sparkles,
    Mic,
    Smile,
    Activity,
    Eye,
    Zap,
    CheckCircle2,
    Award,
    MessageSquare,
    Play,
    Radio,
    TrendingUp,
    Briefcase,
    Sliders,
    HelpCircle,
    Copy,
    Check
} from "lucide-react";

interface RoundRecord {
    round: number;
    question: string;
    transcript: string;
    score: number;
    composureScore: number;
    emotion: string;
    eyeContact: string;
    wpm: number;
    pacingStatus: "Good Pacing" | "Too Fast" | "Too Slow" | "Calibrating";
    fillerCount: number;
    fillerBreakdown: Record<string, number>;
    feedback: string;
}

export interface FillerWordAnalysis {
    count: number;
    breakdown: Record<string, number>;
    status: "Clean Delivery" | "Mild Hesitation" | "High Hesitation";
}

const FILLER_PATTERNS = [
    { word: "you know", regex: /\byou\s+know\b/gi },
    { word: "um", regex: /\bum+\b/gi },
    { word: "uh", regex: /\buh+\b/gi },
    { word: "like", regex: /\blike\b/gi },
    { word: "basically", regex: /\bbasically\b/gi },
    { word: "actually", regex: /\bactually\b/gi },
];

export const parseFillerWords = (text: string): FillerWordAnalysis => {
    if (!text || !text.trim()) {
        return { count: 0, breakdown: {}, status: "Clean Delivery" };
    }

    const breakdown: Record<string, number> = {};
    let totalCount = 0;

    for (const { word, regex } of FILLER_PATTERNS) {
        const matches = text.match(regex);
        if (matches && matches.length > 0) {
            breakdown[word] = matches.length;
            totalCount += matches.length;
        }
    }

    let status: "Clean Delivery" | "Mild Hesitation" | "High Hesitation" = "Clean Delivery";
    if (totalCount >= 4) {
        status = "High Hesitation";
    } else if (totalCount >= 2) {
        status = "Mild Hesitation";
    } else {
        status = "Clean Delivery";
    }

    return {
        count: totalCount,
        breakdown,
        status,
    };
};

const TARGET_ROLES = [
    "Full-Stack Engineer",
    "Backend Developer",
    "Frontend Architect",
    "Applied AI / ML Engineer",
    "Data Structures & Algorithms",
] as const;

const EXPERIENCE_LEVELS = [
    "Entry-Level (0-2 yrs)",
    "Mid-Level (2-5 yrs)",
    "Senior / Staff (5+ yrs)",
] as const;

type TargetRole = typeof TARGET_ROLES[number];
type ExperienceLevel = typeof EXPERIENCE_LEVELS[number];

const getInitialQuestion = (role: TargetRole, level: ExperienceLevel) => {
    switch (role) {
        case "Frontend Architect":
            return `Welcome to your ${role} (${level}) technical interview! Please introduce yourself, summarize your experience with modern frontend architecture and web performance, and walk me through a complex user interface or application you recently engineered.`;
        case "Backend Developer":
            return `Welcome to your ${role} (${level}) technical interview! Please introduce yourself, your experience with server-side architecture and data persistence, and walk me through a distributed service or backend system you recently designed.`;
        case "Applied AI / ML Engineer":
            return `Welcome to your ${role} (${level}) technical interview! Please introduce yourself, your experience deploying machine learning models to production, and describe a complex model serving architecture you recently built.`;
        case "Data Structures & Algorithms":
            return `Welcome to your ${role} (${level}) technical interview! Please introduce yourself, your problem-solving methodology, and describe a challenging algorithmic problem or performance optimization you solved recently.`;
        case "Full-Stack Engineer":
        default:
            return `Welcome to your ${role} (${level}) technical interview! Please introduce yourself, your background across the full development stack, and walk me through a complete end-to-end application you recently architected.`;
    }
};

export default function FaceAnalyzer() {
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const chatEndRef = useRef<HTMLDivElement | null>(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [transcript, setTranscript] = useState<string>("");
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    // Target Role & Experience Level State
    const [targetRole, setTargetRole] = useState<TargetRole>("Full-Stack Engineer");
    const [experienceLevel, setExperienceLevel] = useState<ExperienceLevel>("Mid-Level (2-5 yrs)");

    // Multi-Round Session State
    const [totalRounds, setTotalRounds] = useState<number>(4);
    const [currentRound, setCurrentRound] = useState<number>(1);
    const [activeQuestion, setActiveQuestion] = useState<string>(() =>
        getInitialQuestion("Full-Stack Engineer", "Mid-Level (2-5 yrs)")
    );
    const [roundsHistory, setRoundsHistory] = useState<RoundRecord[]>([]);
    const [isSessionFinished, setIsSessionFinished] = useState<boolean>(false);
    const [showSummaryModal, setShowSummaryModal] = useState<boolean>(false);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [roundsHistory, currentRound, transcript, isAnalyzing]);

    // Handle Role & Level changes
    const handleRoleChange = (newRole: TargetRole) => {
        setTargetRole(newRole);
        if (roundsHistory.length === 0) {
            setActiveQuestion(getInitialQuestion(newRole, experienceLevel));
        }
    };

    const handleLevelChange = (newLevel: ExperienceLevel) => {
        setExperienceLevel(newLevel);
        if (roundsHistory.length === 0) {
            setActiveQuestion(getInitialQuestion(targetRole, newLevel));
        }
    };

    // Speech Pacing State
    const [pacing, setPacing] = useState<{
        wpm: number;
        status: "Good Pacing" | "Too Fast" | "Too Slow" | "Calibrating";
    } | null>(null);

    // Filler Word Analysis State
    const [fillerAnalysis, setFillerAnalysis] = useState<FillerWordAnalysis | null>(null);

    // AI Response for Current Round
    const [aiResponse, setAiResponse] = useState<{
        feedback: string;
        score: string | number;
        followUpQuestion?: string;
    } | null>(null);

    // Real-Time Computer Vision State
    const [emotionState, setEmotionState] = useState<{
        eyeContact: string;
        emotion: string;
        confidenceScore: number;
    }>({
        eyeContact: "Direct",
        emotion: "Smiling / Confident",
        confidenceScore: 92,
    });

    // Helper: Speak Question aloud using Web Speech API
    const speakQuestion = (text: string) => {
        if (typeof window !== "undefined" && "speechSynthesis" in window) {
            window.speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.rate = 0.95;
            utterance.pitch = 1.0;

            const voices = window.speechSynthesis.getVoices();
            const preferredVoice = voices.find(
                (v) =>
                    v.lang.startsWith("en") &&
                    (v.name.includes("Google") || v.name.includes("Natural") || v.name.includes("Samantha"))
            );
            if (preferredVoice) utterance.voice = preferredVoice;

            window.speechSynthesis.speak(utterance);
        }
    };

    // Auto-speak initial question on first load
    useEffect(() => {
        speakQuestion(activeQuestion);
    }, []);

    // Handle Transcription completion from AudioRecorder
    const handleTranscriptionComplete = async (spokenText: string, durationSeconds: number = 0) => {
        setTranscript(spokenText);
        setIsAnalyzing(true);

        if (durationSeconds > 0 && spokenText) {
            const wordCount = spokenText.trim().split(/\s+/).length;
            const minutes = durationSeconds / 60;
            const wpm = Math.round(wordCount / minutes);

            let pacingStatus: "Good Pacing" | "Too Fast" | "Too Slow" | "Calibrating" = "Good Pacing";
            if (wpm < 110) pacingStatus = "Too Slow";
            else if (wpm > 165) pacingStatus = "Too Fast";
            else pacingStatus = "Good Pacing";

            setPacing({ wpm, status: pacingStatus });
        }

        const fillerData = parseFillerWords(spokenText);
        setFillerAnalysis(fillerData);

        try {
            const res = await fetch("/api/interview", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    transcript: spokenText,
                    emotion: emotionState.emotion,
                    confidenceScore: emotionState.confidenceScore,
                    role: targetRole,
                    level: experienceLevel,
                }),
            });

            if (!res.ok) {
                const errorText = await res.text();
                try {
                    const errorJson = JSON.parse(errorText);
                    alert("AI Error: " + (errorJson.error || errorJson.message || res.statusText));
                } catch {
                    alert(`AI Interviewer Error (${res.status}): ${errorText || res.statusText}`);
                }
                return;
            }

            const data = await res.json();
            if (data.followUpQuestion) {
                setAiResponse(data);

                const numericScore = typeof data.score === "number" ? data.score : (parseInt(data.score) || 75);

                const currentRecord: RoundRecord = {
                    round: currentRound,
                    question: activeQuestion,
                    transcript: spokenText,
                    score: numericScore,
                    composureScore: emotionState.confidenceScore,
                    emotion: emotionState.emotion,
                    eyeContact: emotionState.eyeContact,
                    wpm: pacing ? pacing.wpm : 138,
                    pacingStatus: pacing ? pacing.status : "Good Pacing",
                    fillerCount: fillerData.count,
                    fillerBreakdown: fillerData.breakdown,
                    feedback: data.feedback || "Answer evaluated.",
                };

                const updatedHistory = [...roundsHistory, currentRecord];
                setRoundsHistory(updatedHistory);

                if (currentRound >= totalRounds) {
                    setIsSessionFinished(true);
                    setShowSummaryModal(true);
                    speakQuestion("Congratulations! You have completed your mock interview session. Review your final performance breakdown on the screen.");
                } else {
                    setCurrentRound((prev) => prev + 1);
                    setActiveQuestion(data.followUpQuestion);
                    speakQuestion(data.followUpQuestion);
                }
            } else {
                alert("AI Error: " + (data.error || "Failed to generate evaluation"));
            }
        } catch (err) {
            console.error("Error calling AI interviewer:", err);
        } finally {
            setIsAnalyzing(false);
        }
    };

    const restartInterview = () => {
        if (typeof window !== "undefined" && "speechSynthesis" in window) {
            window.speechSynthesis.cancel();
        }
        setCurrentRound(1);
        setActiveQuestion(getInitialQuestion(targetRole, experienceLevel));
        setTranscript("");
        setAiResponse(null);
        setPacing(null);
        setFillerAnalysis(null);
        setRoundsHistory([]);
        setIsSessionFinished(false);
        setShowSummaryModal(false);
    };

    const avgTechScore = roundsHistory.length > 0
        ? Math.round(roundsHistory.reduce((acc, r) => acc + r.score, 0) / roundsHistory.length)
        : 0;

    const avgComposureScore = roundsHistory.length > 0
        ? Math.round(roundsHistory.reduce((acc, r) => acc + r.composureScore, 0) / roundsHistory.length)
        : 0;

    const avgWpm = roundsHistory.length > 0
        ? Math.round(roundsHistory.reduce((acc, r) => acc + r.wpm, 0) / roundsHistory.length)
        : 0;

    const directEyeContactCount = roundsHistory.filter((r) => r.eyeContact === "Direct").length;
    const eyeContactPercent = roundsHistory.length > 0
        ? Math.round((directEyeContactCount / roundsHistory.length) * 100)
        : 0;

    useEffect(() => {
        let faceLandmarker: FaceLandmarker | null = null;
        let animationFrameId: number;
        let stream: MediaStream | null = null;
        let lastVideoTime = -1;

        async function setupMediaPipe() {
            try {
                const fileset = await FilesetResolver.forVisionTasks(
                    "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
                );

                const baseModelConfig = {
                    modelAssetPath:
                        "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task",
                };

                try {
                    faceLandmarker = await FaceLandmarker.createFromOptions(fileset, {
                        baseOptions: { ...baseModelConfig, delegate: "GPU" },
                        outputFaceBlendshapes: true,
                        runningMode: "VIDEO",
                        numFaces: 1,
                    });
                } catch (gpuError) {
                    console.warn("GPU delegate failed for MediaPipe, falling back to CPU delegate:", gpuError);
                    faceLandmarker = await FaceLandmarker.createFromOptions(fileset, {
                        baseOptions: { ...baseModelConfig, delegate: "CPU" },
                        outputFaceBlendshapes: true,
                        runningMode: "VIDEO",
                        numFaces: 1,
                    });
                }

                stream = await navigator.mediaDevices.getUserMedia({
                    video: { width: 1280, height: 720 },
                    audio: false,
                });

                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                    videoRef.current.onloadeddata = () => {
                        setIsLoaded(true);
                        detectLoop();
                    };
                }
            } catch (err) {
                console.error("Error setting up MediaPipe or Camera:", err);
            }
        }

        function detectLoop() {
            if (videoRef.current && canvasRef.current && faceLandmarker) {
                const video = videoRef.current;
                const canvas = canvasRef.current;
                const ctx = canvas.getContext("2d");

                if (
                    video.readyState >= 2 &&
                    video.videoWidth > 0 &&
                    video.videoHeight > 0 &&
                    video.currentTime !== lastVideoTime
                ) {
                    lastVideoTime = video.currentTime;

                    if (canvas.width !== video.videoWidth) canvas.width = video.videoWidth;
                    if (canvas.height !== video.videoHeight) canvas.height = video.videoHeight;

                    try {
                        const results = faceLandmarker.detectForVideo(video, performance.now());

                        if (ctx) {
                            ctx.clearRect(0, 0, canvas.width, canvas.height);

                            if (results.faceLandmarks && results.faceLandmarks.length > 0) {
                                const landmarks = results.faceLandmarks[0];

                                const drawSparseLine = (i1: number, i2: number, color = "rgba(234, 179, 8, 0.75)", width = 1.2) => {
                                    const p1 = landmarks[i1];
                                    const p2 = landmarks[i2];
                                    if (!p1 || !p2) return;
                                    ctx.beginPath();
                                    ctx.moveTo(p1.x * canvas.width, p1.y * canvas.height);
                                    ctx.lineTo(p2.x * canvas.width, p2.y * canvas.height);
                                    ctx.strokeStyle = color;
                                    ctx.lineWidth = width;
                                    ctx.stroke();
                                };

                                const sparseConnections = [
                                    [10, 338], [338, 297], [297, 332], [332, 284], [284, 251], [251, 389], [389, 356], [356, 454], [454, 323], [323, 361], [361, 288], [288, 397], [397, 365], [365, 379], [379, 152], [152, 150], [150, 136], [136, 172], [172, 58], [58, 132], [132, 93], [93, 234], [234, 127], [127, 162], [162, 21], [21, 54], [54, 103], [103, 67], [67, 109], [109, 10],
                                    [10, 168], [168, 6], [6, 197], [197, 195], [195, 5],
                                    [109, 66], [66, 107], [107, 9], [9, 336], [336, 296], [296, 338],
                                    [103, 68], [68, 104], [104, 69], [69, 108],
                                    [332, 298], [298, 333], [333, 299], [299, 337],
                                    [198, 126], [126, 217], [217, 198],
                                    [420, 355], [355, 437], [437, 420],
                                ];

                                sparseConnections.forEach(([i1, i2]) => drawSparseLine(i1, i2));

                                const rightIris = [469, 470, 471, 472];
                                const leftIris = [474, 475, 476, 477];

                                rightIris.forEach((idx, i) => {
                                    const nextIdx = rightIris[(i + 1) % rightIris.length];
                                    drawSparseLine(idx, nextIdx, "rgba(250, 204, 21, 0.95)", 1.5);
                                });
                                leftIris.forEach((idx, i) => {
                                    const nextIdx = leftIris[(i + 1) % leftIris.length];
                                    drawSparseLine(idx, nextIdx, "rgba(250, 204, 21, 0.95)", 1.5);
                                });

                                const noseTip = landmarks[1];
                                let eyeContactStatus = "Direct";
                                if (noseTip) {
                                    const devX = Math.abs(noseTip.x - 0.5);
                                    const devY = Math.abs(noseTip.y - 0.5);
                                    if (devX > 0.12 || devY > 0.12) {
                                        eyeContactStatus = "Slightly Averted";
                                    } else {
                                        eyeContactStatus = "Direct";
                                    }
                                }

                                let detectedEmotion = "Smiling / Confident";
                                let nervousScore = 0;

                                if (results.faceBlendshapes && results.faceBlendshapes.length > 0) {
                                    const categories = results.faceBlendshapes[0].categories;
                                    const getScore = (name: string) =>
                                        categories.find((c) => c.categoryName === name)?.score || 0;

                                    const smileLeft = getScore("mouthSmileLeft");
                                    const smileRight = getScore("mouthSmileRight");
                                    const browDownLeft = getScore("browDownLeft");
                                    const browDownRight = getScore("browDownRight");
                                    const jawOpen = getScore("jawOpen");

                                    const avgSmile = (smileLeft + smileRight) / 2;
                                    const avgBrow = (browDownLeft + browDownRight) / 2;

                                    if (avgSmile > 0.35) {
                                        detectedEmotion = "Smiling / Confident";
                                        nervousScore = 5;
                                    } else if (avgBrow > 0.25) {
                                        detectedEmotion = "Tense / Confused";
                                        nervousScore = 35;
                                    } else if (jawOpen > 0.3) {
                                        detectedEmotion = "Surprised / Thinking";
                                        nervousScore = 20;
                                    } else {
                                        detectedEmotion = "Calm / Focused";
                                        nervousScore = 10;
                                    }
                                }

                                setEmotionState({
                                    eyeContact: eyeContactStatus,
                                    emotion: detectedEmotion,
                                    confidenceScore: Math.max(80, 100 - nervousScore),
                                });
                            }
                        }
                    } catch (err) {
                        console.warn("Face detection frame error:", err);
                    }
                }
            }
            animationFrameId = requestAnimationFrame(detectLoop);
        }

        setupMediaPipe();

        return () => {
            if (animationFrameId) cancelAnimationFrame(animationFrameId);
            if (stream) stream.getTracks().forEach((track) => track.stop());
            if (faceLandmarker) faceLandmarker.close();
        };
    }, []);

    return (
        <div className="w-full max-w-[1520px] mx-auto pb-12 flex flex-col gap-6 text-[#e2e2eb] font-sans">
            
<<<<<<< HEAD
            {/* 1. Studio Header Card & Role Setup */}
            <div className="bg-[#0c0e14]/95 rounded-3xl p-5 sm:p-6 lg:p-7 border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.8)] backdrop-blur-xl">
                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pb-4 border-b border-white/10">
                    <div className="flex items-center gap-3.5">
                        <div className="w-10 h-10 rounded-2xl bg-[#c3f400]/10 border border-[#c3f400]/30 flex items-center justify-center text-[#c3f400] shadow-[0_0_15px_rgba(195,244,0,0.15)] shrink-0">
                            <Bot className="w-5 h-5" />
                        </div>
                        <div>
                            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                                Live Interview Vision
                            </h1>
                            <p className="text-xs text-[#c4c9ac] mt-0.5">
                                Real-Time Computer Vision & Speech Intelligence Copilot
                            </p>
=======
            {/* ==========================================
                TOP CONTROL BAR: Header, Tuning & Round Bar
                ========================================== */}
            <div className="bg-[#191b22] rounded-2xl p-5 lg:p-6 border border-white/10 shadow-2xl relative overflow-hidden backdrop-blur-xl flex flex-col gap-4">
                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pb-4 border-b border-white/10">
                    <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2.5">
                            <span className="w-2.5 h-2.5 rounded-full bg-[#c3f400] shadow-[0_0_12px_#c3f400]" />
                            <h1 className="text-2xl lg:text-3xl font-extrabold text-white tracking-tight">
                                AI Interviewer Studio
                            </h1>
>>>>>>> 9a8a767402371bda53f0d31277e529b94933c92c
                        </div>
                        <p className="text-xs text-[#c4c9ac] pl-5">
                            Real-Time Multimodal Computer Vision & Speech Intelligence Engine
                        </p>
                    </div>

<<<<<<< HEAD
                    {/* Action buttons */}
                    <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                        <button
                            onClick={restartInterview}
                            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-[#c4c9ac] hover:text-white text-xs font-semibold border border-white/10 transition-colors cursor-pointer"
                            title="Reset Interview Session"
                        >
                            <RotateCcw className="w-3.5 h-3.5 text-[#c3f400]" />
                            <span>Restart</span>
                        </button>

                        {isSessionFinished && (
                            <button
                                onClick={() => setShowSummaryModal(true)}
                                className="px-5 py-2 rounded-xl bg-[#c3f400] text-[#283500] font-extrabold text-xs shadow-[0_0_20px_rgba(195,244,0,0.4)] hover:bg-[#abd600] transition-all cursor-pointer flex items-center gap-1.5"
                            >
                                <Award className="w-4 h-4" />
                                <span>View Performance Report</span>
                            </button>
                        )}
                    </div>
                </div>

                {/* Configuration Bar: Role, Experience, Total Questions & Progress */}
                <div className="mt-4 pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
                    <div className="flex flex-wrap items-center gap-3">
                        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#c4c9ac]">
                            <Sliders className="w-3.5 h-3.5 text-[#c3f400]" />
                            <span>Setup:</span>
                        </div>

                        {/* Target Role Dropdown */}
                        <div className="relative inline-flex items-center bg-[#181a24] rounded-xl px-3.5 py-1.5 border border-white/10 text-xs font-medium">
                            <Briefcase className="w-3.5 h-3.5 text-[#c3f400] mr-2" />
                            <span className="text-[#c4c9ac] mr-1">Role:</span>
                            <select
                                value={targetRole}
                                onChange={(e) => handleRoleChange(e.target.value as TargetRole)}
                                className="bg-transparent text-white font-bold focus:outline-none cursor-pointer pr-4 appearance-none text-xs border-0"
                            >
                                {TARGET_ROLES.map((r) => (
                                    <option key={r} value={r} className="bg-[#181a24] text-white">
                                        {r}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Experience Level */}
                        <div className="relative inline-flex items-center bg-[#181a24] rounded-xl px-3.5 py-1.5 border border-white/10 text-xs font-medium">
                            <TrendingUp className="w-3.5 h-3.5 text-[#c3f400] mr-2" />
=======
                    {/* Record / Submit CTA Button */}
                    <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                        <AudioRecorder
                            onTranscriptionComplete={handleTranscriptionComplete}
                            disabled={isAnalyzing || isSessionFinished}
                        />
                        {isSessionFinished && (
                            <button
                                onClick={() => setShowSummaryModal(true)}
                                className="px-5 py-2.5 rounded-full bg-[#c3f400] text-[#283500] font-extrabold text-xs shadow-[0_0_20px_-4px_rgba(195,244,0,0.5)] hover:bg-[#abd600] transition-all cursor-pointer"
                            >
                                📊 View Final Summary
                            </button>
                        )}
                    </div>
                </div>

                {/* Configuration Bar: Role, Experience, Total Questions & Round Progress */}
                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                    {/* Setup Dropdowns */}
                    <div className="flex flex-wrap items-center gap-3">
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-[#c3f400]" />
                            <span className="text-xs font-bold uppercase tracking-wider text-[#c4c9ac]">Setup:</span>
                        </div>

                        {/* Target Role Dropdown */}
                        <div className="relative inline-flex items-center bg-[#282a30] rounded-full px-3.5 py-1.5 border border-white/10 text-xs font-medium">
                            <span className="material-symbols-outlined text-base text-[#c4c9ac] mr-1">work</span>
                            <span className="text-[#c4c9ac] mr-1">Role:</span>
                            <select
                                value={targetRole}
                                onChange={(e) => handleRoleChange(e.target.value as TargetRole)}
                                className="bg-transparent text-white font-bold focus:outline-none cursor-pointer pr-4 appearance-none text-xs border-0"
                            >
                                {TARGET_ROLES.map((r) => (
                                    <option key={r} value={r} className="bg-[#282a30] text-white">
                                        {r}
                                    </option>
                                ))}
                            </select>
                            <span className="material-symbols-outlined text-base text-[#c4c9ac] pointer-events-none -ml-3">expand_more</span>
                        </div>

                        {/* Experience Level */}
                        <div className="relative inline-flex items-center bg-[#282a30] rounded-full px-3.5 py-1.5 border border-white/10 text-xs font-medium">
                            <span className="material-symbols-outlined text-base text-[#c4c9ac] mr-1">trending_up</span>
>>>>>>> 9a8a767402371bda53f0d31277e529b94933c92c
                            <span className="text-[#c4c9ac] mr-1">Level:</span>
                            <select
                                value={experienceLevel}
                                onChange={(e) => handleLevelChange(e.target.value as ExperienceLevel)}
                                className="bg-transparent text-white font-bold focus:outline-none cursor-pointer pr-4 appearance-none text-xs border-0"
                            >
                                {EXPERIENCE_LEVELS.map((l) => (
<<<<<<< HEAD
                                    <option key={l} value={l} className="bg-[#181a24] text-white">
=======
                                    <option key={l} value={l} className="bg-[#282a30] text-white">
>>>>>>> 9a8a767402371bda53f0d31277e529b94933c92c
                                        {l}
                                    </option>
                                ))}
                            </select>
<<<<<<< HEAD
                        </div>

                        {/* Total Questions Segmented Selector */}
                        <div className="flex items-center gap-1 bg-[#181a24] px-2 py-1 rounded-xl border border-white/10 text-xs">
                            <span className="text-[#c4c9ac] px-1 text-[11px]">Questions:</span>
=======
                            <span className="material-symbols-outlined text-base text-[#c4c9ac] pointer-events-none -ml-3">expand_more</span>
                        </div>

                        {/* Total Questions Segmented Selector */}
                        <div className="flex items-center gap-1 bg-[#0c0e14] px-2 py-1 rounded-full border border-white/10 text-xs">
                            <span className="text-[#c4c9ac] px-1 text-[11px]">Length:</span>
>>>>>>> 9a8a767402371bda53f0d31277e529b94933c92c
                            {[3, 4, 5].map((count) => (
                                <button
                                    key={count}
                                    onClick={() => setTotalRounds(count)}
<<<<<<< HEAD
                                    className={`px-2.5 py-0.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
=======
                                    className={`px-2.5 py-0.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
>>>>>>> 9a8a767402371bda53f0d31277e529b94933c92c
                                        totalRounds === count
                                            ? "bg-[#c3f400] text-[#283500]"
                                            : "text-[#c4c9ac] hover:text-white"
                                    }`}
                                >
                                    {count}
                                </button>
                            ))}
                        </div>
                    </div>

<<<<<<< HEAD
                    {/* Compact Step Progress Indicator */}
                    <div className="flex items-center gap-3">
                        <span className="text-xs font-bold text-white">
                            Round <span className="text-[#c3f400]">{Math.min(currentRound, totalRounds)}</span> of {totalRounds}
                        </span>
                        <div className="flex items-center gap-1.5">
=======
                    {/* Compact Segmented Progress Bar */}
                    <div className="w-full lg:w-72 flex flex-col gap-1.5">
                        <div className="flex items-center justify-between text-[11px]">
                            <span className="text-[#c3f400] font-bold uppercase tracking-wider">
                                Round {Math.min(currentRound, totalRounds)} / {totalRounds}
                            </span>
                            <span className="text-[#c4c9ac]">
                                {totalRounds - Math.min(currentRound, totalRounds) + (isSessionFinished ? 0 : 1)} remaining
                            </span>
                        </div>
                        <div className="grid grid-cols-4 gap-1.5">
>>>>>>> 9a8a767402371bda53f0d31277e529b94933c92c
                            {Array.from({ length: totalRounds }).map((_, idx) => {
                                const roundNum = idx + 1;
                                const isCompleted = roundNum < currentRound || isSessionFinished;
                                const isCurrent = roundNum === currentRound && !isSessionFinished;

                                return (
                                    <div
                                        key={idx}
<<<<<<< HEAD
                                        className={`w-6 sm:w-8 h-2 rounded-full transition-all duration-300 ${
                                            isCompleted
                                                ? "bg-[#c3f400]"
                                                : isCurrent
                                                    ? "bg-[#c3f400]/60 animate-pulse"
                                                    : "bg-white/10"
                                        }`}
                                        title={`Question ${roundNum} (${isCompleted ? "Completed" : isCurrent ? "Active" : "Pending"})`}
=======
                                        className={`h-2 rounded-full transition-all duration-500 ${
                                            isCompleted
                                                ? "bg-[#c3f400] shadow-[0_0_10px_rgba(195,244,0,0.6)]"
                                                : isCurrent
                                                    ? "bg-[#abd600] animate-pulse"
                                                    : "bg-[#33343b]"
                                        }`}
>>>>>>> 9a8a767402371bda53f0d31277e529b94933c92c
                                    />
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>

<<<<<<< HEAD
            {/* 2. Main 2-Column Studio Grid: Left (Chat Studio) & Right (Vision & Telemetry) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                
                {/* ── LEFT COLUMN: AI & Candidate Interview Chat Studio (Doubt Engine Template) ── */}
                <div className="lg:col-span-7 xl:col-span-7 flex flex-col rounded-3xl bg-[#0c0e14]/95 border border-white/10 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.9)] backdrop-blur-2xl overflow-hidden min-h-[720px] lg:h-[780px]">
                    
                    {/* Chat Header */}
                    <div className="flex items-center justify-between gap-4 border-b border-white/10 px-6 py-4 bg-[#090a0f]/60 shrink-0">
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-[#c3f400]/10 border border-[#c3f400]/25 flex items-center justify-center text-[#c3f400] shrink-0">
                                <MessageSquare className="w-4 h-4" />
                            </div>
                            <div>
                                <h3 className="text-sm sm:text-base font-bold text-white tracking-tight flex items-center gap-2">
                                    <span>Technical Interview Dialogue</span>
                                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-slate-300 font-mono">
                                        Round {Math.min(currentRound, totalRounds)} / {totalRounds}
                                    </span>
                                </h3>
                                <p className="text-xs text-[#c4c9ac] line-clamp-1">
                                    {targetRole} ({experienceLevel})
                                </p>
                            </div>
                        </div>

                        <button
                            onClick={() => speakQuestion(activeQuestion)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-semibold transition-colors cursor-pointer shrink-0"
                            title="Repeat AI Question via Speech Synthesis"
                        >
                            <Volume2 className="w-3.5 h-3.5 text-[#c3f400]" />
                            <span className="hidden sm:inline">Repeat Audio</span>
                        </button>
                    </div>

                    {/* Scrollable Chat Feed Area */}
                    <div className="flex-1 p-5 sm:p-6 overflow-y-auto space-y-6 custom-scrollbar">
                        
                        {/* Initial Greeting / Orientation Message */}
                        <div className="flex gap-3.5 w-full justify-start">
                            <div className="w-8 h-8 rounded-xl bg-[#c3f400]/10 border border-[#c3f400]/30 flex items-center justify-center text-[#c3f400] shrink-0 mt-1">
                                <Bot className="w-4 h-4" />
                            </div>
                            <div className="bg-[#181a24] text-white rounded-2xl rounded-tl-none border border-white/10 p-4 max-w-[92%] shadow-md">
                                <div className="flex items-center gap-2 mb-1.5">
                                    <span className="text-xs font-bold text-[#c3f400]">Zenith AI Interviewer</span>
                                    <span className="text-[10px] text-[#c4c9ac] font-mono">• Session Initialized</span>
                                </div>
                                <p className="text-sm leading-relaxed text-slate-200">
                                    Welcome! I will be conducting your technical interview for the <strong className="text-white">{targetRole}</strong> position. Answer each prompt verbally using your microphone. I will evaluate your technical clarity, architecture depth, and real-time biometrics.
                                </p>
                            </div>
                        </div>

                        {/* 1. Historical Rounds (Question -> User Transcript -> AI Feedback) */}
                        {roundsHistory.map((rec) => (
                            <div key={rec.round} className="space-y-4 pt-2 border-t border-white/5">
                                
                                {/* AI Round Question */}
                                <div className="flex gap-3.5 w-full justify-start">
                                    <div className="w-8 h-8 rounded-xl bg-[#c3f400]/10 border border-[#c3f400]/30 flex items-center justify-center text-[#c3f400] shrink-0 mt-1">
                                        <Bot className="w-4 h-4" />
                                    </div>
                                    <div className="bg-[#181a24] text-white rounded-2xl rounded-tl-none border border-white/10 p-4 max-w-[92%] shadow-md">
                                        <div className="flex items-center justify-between gap-2 mb-1.5">
                                            <span className="text-xs font-bold text-[#c3f400]">Question {rec.round}</span>
                                            <button
                                                onClick={() => speakQuestion(rec.question)}
                                                className="text-[#c4c9ac] hover:text-white text-xs flex items-center gap-1 cursor-pointer"
                                                title="Play Question"
                                            >
                                                <Volume2 className="w-3 h-3 text-[#c3f400]" />
                                                <span className="text-[10px]">Play</span>
                                            </button>
                                        </div>
                                        <p className="text-sm font-semibold text-white leading-relaxed">
                                            “{rec.question}”
                                        </p>
                                    </div>
                                </div>

                                {/* User Spoken Transcript */}
                                <div className="flex gap-3.5 w-full justify-end">
                                    <div className="bg-[#c3f400] text-[#191b22] rounded-2xl rounded-tr-none p-4 max-w-[92%] shadow-[0_4px_20px_rgba(195,244,0,0.15)]">
                                        <div className="flex items-center justify-between gap-3 mb-1.5 border-b border-[#191b22]/15 pb-1">
                                            <span className="text-xs font-black text-[#191b22] uppercase tracking-wider">Your Spoken Answer</span>
                                            <span className="text-[10px] font-mono text-[#191b22]/80">Whisper v3 Turbo</span>
                                        </div>
                                        <p className="text-sm font-medium leading-relaxed">
                                            "{rec.transcript}"
                                        </p>
                                        
                                        {/* Audio & Speech Delivery Badges */}
                                        <div className="mt-3 pt-2 border-t border-[#191b22]/15 flex flex-wrap items-center gap-2 text-[11px] font-bold text-[#191b22]/90">
                                            <span className="px-2 py-0.5 rounded-md bg-black/10">
                                                ⚡ {rec.wpm} WPM ({rec.pacingStatus})
                                            </span>
                                            <span className="px-2 py-0.5 rounded-md bg-black/10">
                                                🎯 {rec.fillerCount} Fillers
                                            </span>
                                            <span className="px-2 py-0.5 rounded-md bg-black/10">
                                                🧠 {rec.composureScore}% Composure
                                            </span>
                                        </div>
                                    </div>
                                    <div className="w-8 h-8 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 shrink-0 mt-1 font-bold text-xs">
                                        <User className="w-4 h-4" />
                                    </div>
                                </div>

                                {/* AI Evaluation Feedback Card */}
                                <div className="pl-11 pr-2">
                                    <div className="rounded-2xl p-4 bg-[#12141d] border border-white/10 text-xs">
                                        <div className="flex items-center justify-between gap-2 mb-2 pb-2 border-b border-white/10">
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                                                    <CheckCircle2 className="w-3.5 h-3.5 text-[#c3f400]" />
                                                    Round {rec.round} Evaluation
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="px-2.5 py-0.5 rounded-full bg-[#c3f400]/20 text-[#c3f400] font-black text-xs border border-[#c3f400]/30">
                                                    Score: {rec.score}/100
                                                </span>
                                            </div>
                                        </div>
                                        <p className="text-slate-300 leading-relaxed">
                                            {rec.feedback}
                                        </p>
                                    </div>
                                </div>

                            </div>
                        ))}

                        {/* 2. Active Current Round AI Question */}
                        {!isSessionFinished && (
                            <div className="space-y-4 pt-2">
                                <div className="flex gap-3.5 w-full justify-start">
                                    <div className="w-8 h-8 rounded-xl bg-[#c3f400]/20 border border-[#c3f400]/40 flex items-center justify-center text-[#c3f400] shrink-0 mt-1 shadow-[0_0_15px_rgba(195,244,0,0.2)]">
                                        <Bot className="w-4 h-4" />
                                    </div>
                                    <div className="bg-gradient-to-r from-[#181a24] to-[#1e202d] text-white rounded-2xl rounded-tl-none border border-[#c3f400]/30 p-5 max-w-[92%] shadow-lg relative overflow-hidden">
                                        <div className="flex items-center justify-between gap-2 mb-2">
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs font-black text-[#c3f400] uppercase tracking-wider">
                                                    Current Question (Round {Math.min(currentRound, totalRounds)}):
                                                </span>
                                                <span className="w-2 h-2 rounded-full bg-[#c3f400] animate-ping" />
                                            </div>
                                            <button
                                                onClick={() => speakQuestion(activeQuestion)}
                                                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/15 text-white text-xs font-semibold transition-colors cursor-pointer"
                                            >
                                                <Volume2 className="w-3 h-3 text-[#c3f400]" />
                                                <span>Repeat</span>
                                            </button>
                                        </div>

                                        <p className="text-base font-bold text-white leading-relaxed tracking-tight">
                                            “{activeQuestion}”
                                        </p>

                                        {/* Synthesized Voice indicator */}
                                        <div className="mt-3.5 pt-3 border-t border-white/10 flex items-center gap-1">
                                            <span className="h-2 w-1 bg-[#c3f400] rounded-full animate-pulse" />
                                            <span className="h-4 w-1 bg-[#c3f400] rounded-full animate-pulse delay-75" />
                                            <span className="h-6 w-1 bg-[#c3f400] rounded-full animate-pulse delay-150" />
                                            <span className="h-3 w-1 bg-[#c3f400] rounded-full animate-pulse" />
                                            <span className="h-5 w-1 bg-[#c3f400] rounded-full animate-pulse delay-200" />
                                            <span className="text-[10px] text-[#c4c9ac] ml-2 uppercase font-bold tracking-wider">
                                                Ready for your verbal answer
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Loading Evaluator state */}
                                {isAnalyzing && (
                                    <div className="flex items-center gap-3 text-xs sm:text-sm text-[#c3f400] font-semibold p-3.5 rounded-2xl bg-[#181a24] border border-[#c3f400]/30 w-fit ml-11 animate-pulse">
                                        <Bot className="w-4 h-4 animate-spin" />
                                        <span>Zenith AI Evaluator is analyzing your technical response and biometrics...</span>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Session Finished Card */}
                        {isSessionFinished && (
                            <div className="rounded-2xl p-6 bg-gradient-to-r from-[#141620] to-[#1e202d] border border-[#c3f400]/40 text-center flex flex-col items-center gap-3 my-4 shadow-xl">
                                <div className="w-12 h-12 rounded-2xl bg-[#c3f400]/20 text-[#c3f400] flex items-center justify-center border border-[#c3f400]/30 shadow-[0_0_20px_rgba(195,244,0,0.2)]">
                                    <Award className="w-6 h-6" />
                                </div>
                                <h3 className="text-lg font-bold text-white">Interview Complete!</h3>
                                <p className="text-xs text-slate-300 max-w-md">
                                    You have completed all {totalRounds} technical rounds. Review your performance breakdown and AI insights.
                                </p>
                                <button
                                    onClick={() => setShowSummaryModal(true)}
                                    className="px-6 py-2.5 rounded-xl bg-[#c3f400] text-[#283500] font-bold text-xs hover:bg-[#abd600] transition-all cursor-pointer shadow-[0_0_20px_rgba(195,244,0,0.4)]"
                                >
                                    📊 Open Full Summary Report
                                </button>
                            </div>
                        )}

                        <div ref={chatEndRef} />
                    </div>

                    {/* Chat Bottom Audio Recorder & Live Transcription Composer Bar */}
                    <div className="p-4 sm:p-5 bg-[#090a0f]/80 border-t border-white/10 shrink-0">
                        <div className="rounded-2xl bg-[#090b10] border border-white/15 p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-inner">
                            
                            {/* Live transcript feedback indicator */}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="w-2 h-2 rounded-full bg-[#c3f400] animate-ping" />
                                    <span className="text-[11px] font-bold text-[#c3f400] uppercase tracking-wider">
                                        Voice Input (Whisper v3 Turbo):
                                    </span>
                                </div>
                                <p className="text-xs text-slate-300 italic truncate">
                                    {transcript ? `"${transcript}"` : "Click 'Start Answering', speak your response, then click 'Stop & Submit'"}
                                </p>
                            </div>

                            {/* Audio Recorder Action CTA */}
                            <div className="shrink-0 self-end sm:self-center">
                                <AudioRecorder
                                    onTranscriptionComplete={handleTranscriptionComplete}
                                    disabled={isAnalyzing || isSessionFinished}
                                />
                            </div>
                        </div>
                    </div>

                </div>

                {/* ── RIGHT COLUMN: Computer Vision Screen & Detection Telemetry Cards (Bottom) ── */}
                <div className="lg:col-span-5 xl:col-span-5 flex flex-col gap-5">
                    
                    {/* 1. Live Computer Vision Camera Feed & MediaPipe Face Mesh */}
                    <div className="relative w-full rounded-3xl bg-[#0c0e14]/95 border border-white/10 overflow-hidden shadow-[0_20px_60px_-15px_rgba(0,0,0,0.9)] backdrop-blur-2xl">
                        
                        <div className="relative w-full aspect-[4/3] bg-[#07080c] flex items-center justify-center overflow-hidden">
                            {/* Live Webcam Video Feed */}
                            <video
                                ref={videoRef}
                                autoPlay
                                playsInline
                                muted
                                className="absolute inset-0 w-full h-full object-cover -scale-x-100"
                            />

                            {/* MediaPipe Face Landmarker Landmark Canvas Overlay */}
                            <canvas
                                ref={canvasRef}
                                className="absolute inset-0 w-full h-full object-cover -scale-x-100 pointer-events-none"
                            />

                            {!isLoaded && (
                                <div className="absolute inset-0 flex items-center justify-center text-xs font-semibold text-[#c4c9ac] p-4 text-center">
                                    <span className="material-symbols-outlined text-xl text-[#c3f400] animate-spin mr-2">sync</span>
                                    Initializing Computer Vision Face Mesh Engine...
                                </div>
                            )}

                            {/* Floating Top HUD Badges */}
                            <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between pointer-events-none">
                                <div className="flex items-center gap-2 pointer-events-auto">
                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/75 backdrop-blur-md border border-white/15 text-white text-[11px] font-semibold">
                                        <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                                        <span>REC</span>
                                    </span>
                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/75 backdrop-blur-md border border-[#c3f400]/40 text-[#c3f400] text-[11px] font-bold">
                                        <Eye className="w-3 h-3 text-[#c3f400]" />
                                        <span>{emotionState.eyeContact}</span>
                                    </span>
                                </div>

                                <div className="flex items-center gap-1.5 pointer-events-auto">
                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/75 backdrop-blur-md border border-white/15 text-[#c4c9ac] text-[11px] font-semibold">
                                        <span className="w-1.5 h-1.5 rounded-full bg-[#c3f400]" />
                                        <span>Calibrated</span>
                                    </span>
                                </div>
                            </div>

                            {/* Mic Level Equalizer Floating bottom right */}
                            <div className="absolute bottom-3.5 right-3.5 flex items-end gap-1 px-2.5 py-1.5 rounded-xl bg-black/80 backdrop-blur-md border border-white/10 pointer-events-none">
                                <span className="text-[9px] text-[#c4c9ac] mr-1 uppercase font-bold">Mic</span>
                                <span className="w-1 h-2.5 bg-[#c3f400] rounded-full animate-bounce" />
                                <span className="w-1 h-5 bg-[#c3f400] rounded-full animate-bounce delay-75" />
                                <span className="w-1 h-6 bg-[#c3f400] rounded-full animate-bounce delay-150" />
                                <span className="w-1 h-3 bg-[#c3f400] rounded-full animate-bounce delay-100" />
                            </div>
                        </div>
                    </div>

                    {/* 2. Real-Time Detection Telemetry Cards (At the bottom of the Vision Screen) */}
                    <div className="grid grid-cols-2 gap-3">
                        
                        {/* Detected Emotion */}
                        <div className="bg-[#0c0e14]/95 rounded-2xl p-4 border border-white/10 hover:border-[#c3f400]/40 transition-all shadow-md">
                            <div className="flex items-center justify-between text-[#c4c9ac] text-[10px] font-bold uppercase tracking-wider mb-1">
                                <span>Detected Emotion</span>
                                <Smile className="w-4 h-4 text-[#c3f400]" />
                            </div>
                            <span className="text-sm font-bold text-[#c3f400] truncate block">{emotionState.emotion}</span>
                            <span className="text-[10px] text-[#c4c9ac] mt-1 flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#c3f400]" /> 94% Confidence
                            </span>
                        </div>

                        {/* Composure Score */}
                        <div className="bg-[#0c0e14]/95 rounded-2xl p-4 border border-white/10 hover:border-[#c3f400]/40 transition-all shadow-md">
                            <div className="flex items-center justify-between text-[#c4c9ac] text-[10px] font-bold uppercase tracking-wider mb-1">
                                <span>Composure Score</span>
                                <Activity className="w-4 h-4 text-[#c3f400]" />
                            </div>
                            <div className="flex items-baseline gap-1">
                                <span className="text-lg font-bold text-white">{emotionState.confidenceScore}%</span>
                                <span className="text-[10px] text-[#c3f400] font-bold">↑ Optimal</span>
                            </div>
                            <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden mt-2">
                                <div className="bg-[#c3f400] h-full rounded-full" style={{ width: `${emotionState.confidenceScore}%` }} />
                            </div>
                        </div>

                        {/* Speech Pacing */}
                        <div className="bg-[#0c0e14]/95 rounded-2xl p-4 border border-white/10 hover:border-[#c3f400]/40 transition-all shadow-md">
                            <div className="flex items-center justify-between text-[#c4c9ac] text-[10px] font-bold uppercase tracking-wider mb-1">
                                <span>Speech Pacing</span>
                                <Zap className="w-4 h-4 text-[#c3f400]" />
                            </div>
                            <div className="flex items-baseline gap-1">
                                <span className="text-lg font-bold text-white">{pacing ? pacing.wpm : 138}</span>
                                <span className="text-[11px] text-[#c4c9ac]">WPM</span>
                            </div>
                            <span className="text-[10px] text-[#c3f400] font-semibold mt-1 block truncate">Recommended (130-150)</span>
                        </div>

                        {/* Filler Words */}
                        <div className="bg-[#0c0e14]/95 rounded-2xl p-4 border border-white/10 hover:border-[#c3f400]/40 transition-all shadow-md">
                            <div className="flex items-center justify-between text-[#c4c9ac] text-[10px] font-bold uppercase tracking-wider mb-1">
                                <span>Filler Words</span>
                                <Mic className="w-4 h-4 text-[#c3f400]" />
                            </div>
                            <div className="flex items-baseline gap-1">
                                <span className="text-lg font-bold text-white">{fillerAnalysis ? fillerAnalysis.count : 0}</span>
                                <span className="text-[11px] text-[#c4c9ac]">detected</span>
                            </div>
                            <span className="text-[10px] text-[#c3f400] font-semibold mt-1 block truncate">Exceptional clarity</span>
                        </div>

                        {/* Eye Contact */}
                        <div className="col-span-2 bg-[#0c0e14]/95 rounded-2xl p-4 border border-white/10 hover:border-[#c3f400]/40 transition-all shadow-md flex items-center justify-between">
                            <div>
                                <div className="flex items-center gap-1.5 text-[#c4c9ac] text-[10px] font-bold uppercase tracking-wider mb-1">
                                    <Eye className="w-3.5 h-3.5 text-[#c3f400]" />
                                    <span>Eye Contact Engagement</span>
                                </div>
                                <span className="text-base font-bold text-[#c3f400]">{emotionState.eyeContact}</span>
                            </div>
                            <span className="text-[11px] text-slate-400 bg-white/5 px-2.5 py-1 rounded-lg border border-white/10">
                                Head tilt locked
                            </span>
                        </div>
                    </div>

=======
            {/* ==========================================
                SPLIT-PANEL STUDIO DASHBOARD LAYOUT (2-Column)
                ========================================== */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                
                {/* ------------------------------------------
                    LEFT COLUMN: AI Question, Live Transcript & Coach Hint (5 Cols / ~40%)
                    ------------------------------------------ */}
                <div className="lg:col-span-5 flex flex-col gap-6">
                    
                    {/* 1. Current Question Card */}
                    <div className="rounded-2xl p-5 bg-gradient-to-r from-[#282a30] via-[#1e1f26] to-[#282a30] border border-white/10 shadow-lg relative overflow-hidden flex flex-col gap-3">
                        <div className="flex items-center justify-between gap-3 pb-2 border-b border-white/10">
                            <div className="flex items-center gap-2">
                                <div className="w-7 h-7 rounded-full bg-[#c3f400]/20 flex items-center justify-center text-[#c3f400]">
                                    <span className="material-symbols-outlined text-base">record_voice_over</span>
                                </div>
                                <span className="text-xs font-bold uppercase tracking-wider text-[#c3f400]">
                                    Question {Math.min(currentRound, totalRounds)} of {totalRounds}
                                </span>
                            </div>
                            <button
                                onClick={() => speakQuestion(activeQuestion)}
                                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-semibold transition-colors cursor-pointer"
                            >
                                <span className="material-symbols-outlined text-sm text-[#c3f400]">volume_up</span>
                                <span>Repeat</span>
                            </button>
                        </div>

                        <p className="text-base font-bold text-white leading-relaxed tracking-tight">
                            “{activeQuestion}”
                        </p>

                        {/* Simulated Voice Waveform */}
                        <div className="flex items-center gap-1 pt-1">
                            <span className="h-2 w-1 bg-[#c3f400] rounded-full animate-pulse" />
                            <span className="h-4 w-1 bg-[#c3f400] rounded-full animate-pulse delay-75" />
                            <span className="h-5 w-1 bg-[#c3f400] rounded-full animate-pulse delay-150" />
                            <span className="h-3 w-1 bg-[#c3f400] rounded-full animate-pulse" />
                            <span className="h-4 w-1 bg-[#c3f400] rounded-full animate-pulse delay-200" />
                            <span className="text-[10px] text-[#c4c9ac] ml-2 font-bold uppercase tracking-wider">AI Voice Active</span>
                        </div>
                    </div>

                    {/* 2. Your Answer Transcript (Live Speech-to-Text) Card */}
                    <div className="rounded-2xl p-5 bg-[#191b22] border border-white/10 shadow-lg flex flex-col gap-3">
                        <div className="flex items-center justify-between pb-2 border-b border-white/10">
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-[#c3f400] animate-ping" />
                                <span className="text-xs font-bold uppercase tracking-wider text-[#c3f400]">
                                    Your Answer Transcript (Live STT)
                                </span>
                            </div>
                            <span className="text-[10px] text-[#c4c9ac] font-mono">Whisper v3 Turbo</span>
                        </div>

                        <div className="min-h-[140px] max-h-[220px] overflow-y-auto p-3.5 rounded-xl bg-[#0c0e14] border border-white/5 text-xs sm:text-sm text-white italic font-mono leading-relaxed custom-scrollbar">
                            {transcript
                                ? `"${transcript}"`
                                : "Click 'Start Answering', speak your response clearly into your microphone, then click 'Stop & Submit' to evaluate..."}
                        </div>
                    </div>

                    {/* 3. Live Coach Hint Card */}
                    <div className="rounded-2xl p-5 bg-[#191b22] border border-white/10 shadow-lg flex flex-col gap-3">
                        <div className="flex items-center gap-2 pb-2 border-b border-white/10">
                            <div className="w-7 h-7 rounded-full bg-[#d4004b]/20 flex items-center justify-center text-[#ffb2ba]">
                                <span className="material-symbols-outlined text-base">tips_and_updates</span>
                            </div>
                            <span className="text-xs font-bold text-[#ffb2ba] uppercase tracking-wider">
                                Live Coach Hint & Feedback:
                            </span>
                        </div>

                        <p className="text-xs md:text-sm text-slate-200 leading-relaxed">
                            {aiResponse?.feedback ||
                                "Great technical depth with the architecture. Highlight quantitative business metrics — like latency reduction or user scale."}
                        </p>
                    </div>

                </div>

                {/* ------------------------------------------
                    RIGHT COLUMN: Prominent Camera & 5-Metric Telemetry Grid (7 Cols / ~60%)
                    ------------------------------------------ */}
                <div className="lg:col-span-7 flex flex-col gap-6">
                    
                    {/* 1. Camera Feed Stage */}
                    <div className="relative w-full rounded-2xl bg-[#0c0e14] border border-white/10 overflow-hidden shadow-2xl">
                        <div className="relative w-full aspect-video min-h-[380px] lg:min-h-[460px] bg-[#0a0c12] flex items-center justify-center overflow-hidden">
                            
                            {/* Live Webcam Feed */}
                            <video
                                ref={videoRef}
                                autoPlay
                                playsInline
                                muted
                                className="absolute inset-0 w-full h-full object-cover -scale-x-100"
                            />

                            {/* MediaPipe Landmarker Gold Overlay Canvas */}
                            <canvas
                                ref={canvasRef}
                                className="absolute inset-0 w-full h-full object-cover -scale-x-100 pointer-events-none"
                            />

                            {!isLoaded && (
                                <div className="absolute inset-0 flex items-center justify-center text-xs font-semibold text-[#c4c9ac]">
                                    <span className="material-symbols-outlined text-xl text-[#c3f400] animate-spin mr-2">sync</span>
                                    Initializing AI Vision Mesh...
                                </div>
                            )}

                            {/* Floating HUD Overlay Badges */}
                            <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none">
                                <div className="flex items-center gap-2 pointer-events-auto">
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/10 text-white text-xs font-semibold">
                                        <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                                        <span>REC Live</span>
                                    </span>
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/70 backdrop-blur-md border border-[#c3f400]/40 text-[#c3f400] text-xs font-bold">
                                        <span className="material-symbols-outlined text-sm">visibility</span>
                                        <span>Eye Contact: {emotionState.eyeContact}</span>
                                    </span>
                                </div>

                                <div className="flex items-center gap-2 pointer-events-auto">
                                    <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/10 text-white text-xs font-semibold">
                                        <span className="w-1.5 h-1.5 rounded-full bg-[#c3f400]" />
                                        <span>{targetRole}</span>
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 2. Multimodal Telemetry Metrics (5-Column Grid directly under camera) */}
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                        {/* Emotion */}
                        <div className="bg-[#191b22] rounded-xl p-3.5 border border-white/5 flex flex-col justify-between hover:border-[#c3f400]/30 transition-all">
                            <div className="flex items-center justify-between text-[#c4c9ac] text-[10px] font-bold uppercase tracking-wider mb-1">
                                <span>Emotion</span>
                                <span className="material-symbols-outlined text-sm text-[#c3f400]">sentiment_satisfied</span>
                            </div>
                            <span className="text-xs font-bold text-[#c3f400] truncate">{emotionState.emotion}</span>
                            <span className="text-[10px] text-[#c4c9ac] mt-1">94% Confidence</span>
                        </div>

                        {/* Composure */}
                        <div className="bg-[#191b22] rounded-xl p-3.5 border border-white/5 flex flex-col justify-between hover:border-[#c3f400]/30 transition-all">
                            <div className="flex items-center justify-between text-[#c4c9ac] text-[10px] font-bold uppercase tracking-wider mb-1">
                                <span>Composure</span>
                                <span className="material-symbols-outlined text-sm text-[#ffb2ba]">psychology</span>
                            </div>
                            <div className="flex items-baseline gap-1">
                                <span className="text-sm font-bold text-white">{emotionState.confidenceScore}%</span>
                                <span className="text-[9px] text-[#c3f400] font-bold">Optimal</span>
                            </div>
                            <div className="w-full bg-[#33343b] h-1 rounded-full overflow-hidden mt-1.5">
                                <div className="bg-[#c3f400] h-full rounded-full" style={{ width: `${emotionState.confidenceScore}%` }} />
                            </div>
                        </div>

                        {/* Pacing */}
                        <div className="bg-[#191b22] rounded-xl p-3.5 border border-white/5 flex flex-col justify-between hover:border-[#c3f400]/30 transition-all">
                            <div className="flex items-center justify-between text-[#c4c9ac] text-[10px] font-bold uppercase tracking-wider mb-1">
                                <span>Pacing</span>
                                <span className="material-symbols-outlined text-sm text-[#c3f400]">speed</span>
                            </div>
                            <div className="flex items-baseline gap-1">
                                <span className="text-sm font-bold text-white">{pacing ? pacing.wpm : 138}</span>
                                <span className="text-[10px] text-[#c4c9ac]">WPM</span>
                            </div>
                            <span className="text-[10px] text-[#c3f400] font-semibold mt-1">Optimal</span>
                        </div>

                        {/* Filler Words */}
                        <div className="bg-[#191b22] rounded-xl p-3.5 border border-white/5 flex flex-col justify-between hover:border-[#c3f400]/30 transition-all">
                            <div className="flex items-center justify-between text-[#c4c9ac] text-[10px] font-bold uppercase tracking-wider mb-1">
                                <span>Fillers</span>
                                <span className="material-symbols-outlined text-sm text-[#c4c9ac]">record_voice_over</span>
                            </div>
                            <div className="flex items-baseline gap-1">
                                <span className="text-sm font-bold text-white">{fillerAnalysis ? fillerAnalysis.count : 0}</span>
                                <span className="text-[10px] text-[#c4c9ac]">count</span>
                            </div>
                            <span className="text-[10px] text-[#c3f400] font-semibold mt-1">Clear</span>
                        </div>

                        {/* Eye Contact */}
                        <div className="col-span-2 sm:col-span-1 bg-[#191b22] rounded-xl p-3.5 border border-white/5 flex flex-col justify-between hover:border-[#c3f400]/30 transition-all">
                            <div className="flex items-center justify-between text-[#c4c9ac] text-[10px] font-bold uppercase tracking-wider mb-1">
                                <span>Eye Contact</span>
                                <span className="material-symbols-outlined text-sm text-[#c3f400]">visibility</span>
                            </div>
                            <span className="text-xs font-bold text-[#c3f400] truncate">{emotionState.eyeContact}</span>
                            <span className="text-[10px] text-[#c4c9ac] mt-1">Tracking</span>
                        </div>
                    </div>

>>>>>>> 9a8a767402371bda53f0d31277e529b94933c92c
                </div>

            </div>

            {/* Performance Summary Modal */}
            {showSummaryModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
                    <div className="bg-[#0c0e14] border border-white/15 rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl p-6 sm:p-8 flex flex-col gap-6 text-white">
                        <div className="flex items-start justify-between border-b border-white/10 pb-4">
                            <div>
                                <h2 className="text-2xl font-black text-white">Interview Performance Summary</h2>
                                <p className="text-xs text-[#c4c9ac] mt-1">{targetRole} • {experienceLevel} ({roundsHistory.length} rounds)</p>
                            </div>
                            <button
                                onClick={() => setShowSummaryModal(false)}
                                className="text-[#c4c9ac] hover:text-white px-3 py-1.5 rounded-xl bg-white/10 text-xs font-bold transition-colors cursor-pointer"
                            >
                                ✕ Close
                            </button>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                            <div className="bg-[#181a24] p-4 rounded-2xl border border-white/10">
                                <div className="text-xs text-[#c4c9ac] uppercase font-bold">Avg Tech Score</div>
                                <div className="text-3xl font-extrabold text-[#c3f400] mt-1">{avgTechScore}/100</div>
                            </div>
                            <div className="bg-[#181a24] p-4 rounded-2xl border border-white/10">
                                <div className="text-xs text-[#c4c9ac] uppercase font-bold">Avg Composure</div>
                                <div className="text-3xl font-extrabold text-white mt-1">{avgComposureScore}%</div>
                            </div>
                            <div className="bg-[#181a24] p-4 rounded-2xl border border-white/10">
                                <div className="text-xs text-[#c4c9ac] uppercase font-bold">Avg Pacing</div>
                                <div className="text-3xl font-extrabold text-[#c3f400] mt-1">{avgWpm || 138} WPM</div>
                            </div>
                            <div className="bg-[#181a24] p-4 rounded-2xl border border-white/10">
                                <div className="text-xs text-[#c4c9ac] uppercase font-bold">Eye Contact</div>
                                <div className="text-3xl font-extrabold text-emerald-400 mt-1">{eyeContactPercent}%</div>
                            </div>
                        </div>

                        <div className="space-y-4 pt-2">
                            <div className="bg-[#181a24] p-4 rounded-2xl border border-white/10">
                                <h4 className="text-xs font-bold text-[#c3f400] uppercase tracking-wider mb-2">Key Strengths</h4>
                                <ul className="space-y-1 text-xs text-slate-300">
                                    {insights.strengths.map((s, i) => (
                                        <li key={i} className="flex items-center gap-2">
                                            <span className="text-[#c3f400]">✓</span> {s}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="bg-[#181a24] p-4 rounded-2xl border border-white/10">
                                <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-2">Areas for Improvement</h4>
                                <ul className="space-y-1 text-xs text-slate-300">
                                    {insights.improvements.map((imp, i) => (
                                        <li key={i} className="flex items-center gap-2">
                                            <span className="text-amber-400">→</span> {imp}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                            <button
                                onClick={restartInterview}
                                className="px-6 py-2.5 rounded-full bg-[#c3f400] text-[#283500] font-bold text-xs hover:bg-[#abd600] transition-all cursor-pointer shadow-[0_0_20px_rgba(195,244,0,0.3)]"
                            >
                                🔄 Restart New Interview
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}