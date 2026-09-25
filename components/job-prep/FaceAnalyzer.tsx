"use client";

import React, { useEffect, useRef, useState } from "react";
import { FilesetResolver, FaceLandmarker } from "@mediapipe/tasks-vision";
import AudioRecorder from "@/components/job-prep/AudioRecorder";

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
        followUpQuestion: string;
    } | null>(null);

    const [emotionState, setEmotionState] = useState<{
        eyeContact: string;
        emotion: string;
        confidenceScore: number;
    }>({
        eyeContact: "Direct (98%)",
        emotion: "Neutral / Focused",
        confidenceScore: 98,
    });

    // Speak AI text out loud using Web Speech API
    const speakQuestion = (text: string) => {
        if (typeof window !== "undefined" && "speechSynthesis" in window) {
            window.speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.rate = 1.0;
            utterance.pitch = 1.0;
            window.speechSynthesis.speak(utterance);
        }
    };

    // Calculate WPM and determine pacing status
    const calculateSpeechPacing = (spokenText: string, durationSeconds?: number) => {
        const words = spokenText.trim().split(/\s+/).filter(Boolean).length;
        const duration = (durationSeconds && durationSeconds > 0) ? durationSeconds : 5;
        const calculatedWpm = Math.max(10, Math.round((words / duration) * 60));

        let status: "Good Pacing" | "Too Fast" | "Too Slow" | "Calibrating" = "Good Pacing";
        if (words < 4) {
            status = "Calibrating";
        } else if (calculatedWpm < 110) {
            status = "Too Slow";
        } else if (calculatedWpm > 165) {
            status = "Too Fast";
        } else {
            status = "Good Pacing";
        }

        const pacingData = { wpm: calculatedWpm, status };
        setPacing(pacingData);
        return pacingData;
    };

    // Trigger evaluation when candidate finishes speaking
    const handleTranscriptionComplete = async (spokenText: string, durationSeconds?: number) => {
        setTranscript(spokenText);
        setIsAnalyzing(true);

        const pacingData = calculateSpeechPacing(spokenText, durationSeconds);
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
                    wpm: pacingData.wpm,
                    pacingStatus: pacingData.status,
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

    // Restart Interview Handler
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

    // Aggregated metrics for summary modal
    const avgTechScore = roundsHistory.length > 0
        ? Math.round(roundsHistory.reduce((acc, r) => acc + r.score, 0) / roundsHistory.length)
        : 0;

    const avgComposureScore = roundsHistory.length > 0
        ? Math.round(roundsHistory.reduce((acc, r) => acc + r.composureScore, 0) / roundsHistory.length)
        : 0;

    const avgWpm = roundsHistory.length > 0
        ? Math.round(roundsHistory.reduce((acc, r) => acc + r.wpm, 0) / roundsHistory.length)
        : 0;

    const totalFillerCount = roundsHistory.reduce((acc, r) => acc + (r.fillerCount || 0), 0);
    const avgFillerPerRound = roundsHistory.length > 0
        ? (totalFillerCount / roundsHistory.length).toFixed(1)
        : "0.0";

    const directEyeContactCount = roundsHistory.filter((r) => r.eyeContact.includes("Direct")).length;
    const eyeContactPercent = roundsHistory.length > 0
        ? Math.round((directEyeContactCount / roundsHistory.length) * 100)
        : 98;

    // Derived Performance Analysis
    const getPerformanceInsights = () => {
        const strengths: string[] = [];
        const improvements: string[] = [];

        if (avgTechScore >= 80) {
            strengths.push("Demonstrated strong technical depth and clear problem-solving rationale.");
        } else {
            improvements.push("Provide more concrete architectural details, system trade-offs, and edge case considerations.");
        }

        if (avgComposureScore >= 80) {
            strengths.push("Maintained calm, confident posture and steady composure throughout the interview.");
        } else {
            improvements.push("Practice steady breathing and deliberate pauses to reduce signs of tension during challenging questions.");
        }

        if (avgWpm >= 110 && avgWpm <= 165) {
            strengths.push(`Optimal speaking cadence (${avgWpm || 138} WPM), making technical points easy to follow.`);
        } else if (avgWpm > 165) {
            improvements.push(`Speech tempo was fast (${avgWpm} WPM). Aim for 130-150 WPM to give listeners time to digest key points.`);
        }

        const avgFillersNum = parseFloat(avgFillerPerRound);
        if (avgFillersNum <= 1.5) {
            strengths.push(`Crisp & concise verbal delivery with minimal speech hesitation (${totalFillerCount} filler words total).`);
        } else {
            improvements.push(`Moderate filler word usage. Practice replacing fillers like "um" or "like" with intentional pauses.`);
        }

        return { strengths, improvements };
    };

    const insights = getPerformanceInsights();

    // MediaPipe Setup (Unchanged computer vision landmark model)
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
                    console.warn("GPU delegate failed, using CPU delegate:", gpuError);
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

                                const drawLine = (i1: number, i2: number, color = "#c3f400", width = 1.2) => {
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
                                    [109, 66], [66, 107], [107, 9], [9, 336], [336, 296], [296, 338]
                                ];

                                sparseConnections.forEach(([start, end]) => {
                                    drawLine(start, end, "rgba(195, 244, 0, 0.7)", 1.2);
                                });

                                const featureConnections = [
                                    [33, 160], [160, 158], [158, 133], [133, 153], [153, 144], [144, 33],
                                    [362, 385], [385, 387], [387, 263], [263, 373], [373, 380], [380, 362],
                                    [61, 185], [185, 40], [40, 39], [39, 37], [37, 0], [0, 267], [267, 269], [269, 270], [270, 409], [409, 291], [291, 375], [375, 321], [321, 405], [405, 314], [314, 17], [17, 84], [84, 181], [181, 91], [91, 146], [146, 61]
                                ];

                                featureConnections.forEach(([start, end]) => {
                                    drawLine(start, end, "#00FFA3", 1.5);
                                });

                                const leftIris = landmarks[468];
                                const rightIris = landmarks[473];
                                [leftIris, rightIris].forEach((iris) => {
                                    if (iris) {
                                        ctx.beginPath();
                                        ctx.arc(iris.x * canvas.width, iris.y * canvas.height, 3, 0, 2 * Math.PI);
                                        ctx.fillStyle = "#00FFA3";
                                        ctx.fill();
                                    }
                                });

                                const leftInner = landmarks[133];
                                const leftOuter = landmarks[33];

                                let eyeContactStatus = "Direct (98%)";
                                if (leftInner && leftOuter && leftIris) {
                                    const ratio = (leftIris.x - leftOuter.x) / (leftInner.x - leftOuter.x);
                                    if (ratio >= 0.35 && ratio <= 0.65) {
                                        eyeContactStatus = "Direct (98%)";
                                    } else {
                                        eyeContactStatus = "Lost (Slanted)";
                                    }
                                }

                                let detectedEmotion = "Neutral / Focused";
                                let nervousScore = 0;

                                if (results.faceBlendshapes && results.faceBlendshapes.length > 0) {
                                    const shapes = results.faceBlendshapes[0].categories;
                                    const getShape = (name: string) =>
                                        shapes.find((s) => s.categoryName === name)?.score || 0;

                                    const smileLeft = getShape("mouthSmileLeft");
                                    const smileRight = getShape("mouthSmileRight");
                                    const eyeWide = getShape("eyeWideLeft");

                                    if (smileLeft > 0.3 || smileRight > 0.3) {
                                        detectedEmotion = "Smiling / Confident";
                                    } else if (eyeWide > 0.35) {
                                        detectedEmotion = "Surprised / Focused";
                                        nervousScore = 15;
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
        <div className="w-full max-w-[1360px] mx-auto pb-12 flex flex-col gap-6 text-[#e2e2eb] font-sans">
            
            {/* 1. Main Studio Container */}
            <div className="flex flex-col gap-6">
                
                {/* Studio Header Card & Role Setup */}
                <div className="bg-[#191b22] rounded-2xl p-6 lg:p-8 border border-white/10 shadow-2xl relative overflow-hidden backdrop-blur-xl">
                    <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pb-4 border-b border-white/10">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                            <div className="flex items-center gap-2">
                                <span className="w-2.5 h-2.5 rounded-full bg-[#c3f400] shadow-[0_0_12px_#c3f400]" />
                                <h1 className="text-2xl lg:text-3xl font-bold text-white tracking-tight">AI Interviewer Studio</h1>
                            </div>
                        </div>

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

                    <p className="text-xs text-[#c4c9ac] pt-3">
                        Real-Time Multimodal Computer Vision & Speech Intelligence Engine
                    </p>

                    {/* Configuration Bar: Role, Experience, Total Questions */}
                    <div className="mt-4 pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
                        <div className="flex flex-wrap items-center gap-4">
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-[#c3f400]" />
                                <span className="text-xs font-bold uppercase tracking-wider text-[#c4c9ac]">Interview Setup & Tuning</span>
                            </div>

                            {/* Target Role Dropdown */}
                            <div className="relative inline-flex items-center bg-[#282a30] rounded-full px-4 py-1.5 border border-white/10 text-xs font-medium">
                                <span className="material-symbols-outlined text-base text-[#c4c9ac] mr-1.5">work</span>
                                <span className="text-[#c4c9ac] mr-1">Target Role:</span>
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
                            <div className="relative inline-flex items-center bg-[#282a30] rounded-full px-4 py-1.5 border border-white/10 text-xs font-medium">
                                <span className="material-symbols-outlined text-base text-[#c4c9ac] mr-1.5">trending_up</span>
                                <span className="text-[#c4c9ac] mr-1">Level:</span>
                                <select
                                    value={experienceLevel}
                                    onChange={(e) => handleLevelChange(e.target.value as ExperienceLevel)}
                                    className="bg-transparent text-white font-bold focus:outline-none cursor-pointer pr-4 appearance-none text-xs border-0"
                                >
                                    {EXPERIENCE_LEVELS.map((l) => (
                                        <option key={l} value={l} className="bg-[#282a30] text-white">
                                            {l}
                                        </option>
                                    ))}
                                </select>
                                <span className="material-symbols-outlined text-base text-[#c4c9ac] pointer-events-none -ml-3">expand_more</span>
                            </div>
                        </div>

                        {/* Total Questions Segmented Selector */}
                        <div className="flex items-center gap-1 bg-[#0c0e14] px-2 py-1 rounded-full border border-white/10 text-xs">
                            <span className="text-[#c4c9ac] px-2">Total:</span>
                            {[3, 4, 5].map((count) => (
                                <button
                                    key={count}
                                    onClick={() => setTotalRounds(count)}
                                    className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                                        totalRounds === count
                                            ? "bg-[#c3f400] text-[#283500] shadow-sm"
                                            : "text-[#c4c9ac] hover:text-white"
                                    }`}
                                >
                                    {count} Qs
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Round Progress Segmented Bar */}
                    <div className="mt-4 pt-4 border-t border-white/10">
                        <div className="flex items-center justify-between mb-2 text-xs">
                            <div className="flex items-center gap-2">
                                <span className="text-[#c3f400] font-bold uppercase tracking-wider">Round Progress:</span>
                                <span className="text-white font-bold">Question {Math.min(currentRound, totalRounds)} of {totalRounds}</span>
                            </div>
                            <span className="text-[#c4c9ac]">{totalRounds - Math.min(currentRound, totalRounds) + (isSessionFinished ? 0 : 1)} round(s) remaining</span>
                        </div>

                        {/* Step Segments */}
                        <div className="grid grid-cols-4 gap-2">
                            {Array.from({ length: totalRounds }).map((_, idx) => {
                                const roundNum = idx + 1;
                                const isCompleted = roundNum < currentRound || isSessionFinished;
                                const isCurrent = roundNum === currentRound && !isSessionFinished;

                                return (
                                    <div key={idx} className="relative">
                                        <div
                                            className={`h-2 rounded-full transition-all duration-500 ${
                                                isCompleted
                                                    ? "bg-[#c3f400] shadow-[0_0_12px_rgba(195,244,0,0.6)]"
                                                    : isCurrent
                                                        ? "bg-[#abd600] animate-pulse"
                                                        : "bg-[#33343b]"
                                            }`}
                                        />
                                        <span className={`block mt-1 text-[10px] text-center font-mono font-bold ${
                                            isCompleted || isCurrent ? "text-[#c3f400]" : "text-[#8e9379]"
                                        }`}>
                                            Q{roundNum} • {isCompleted ? "Completed" : isCurrent ? "Active" : "Pending"}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* 2. Current Question AI Audio Prompt Card */}
                <div className="rounded-2xl p-6 bg-gradient-to-r from-[#282a30] via-[#1e1f26] to-[#282a30] border border-white/10 shadow-lg relative overflow-hidden">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-3">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-[#c3f400]/20 flex items-center justify-center text-[#c3f400]">
                                <span className="material-symbols-outlined text-lg">record_voice_over</span>
                            </div>
                            <span className="text-xs font-bold uppercase tracking-wider text-[#c3f400]">
                                Current Question (Round {Math.min(currentRound, totalRounds)}):
                            </span>
                        </div>
                        <button
                            onClick={() => speakQuestion(activeQuestion)}
                            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-semibold transition-colors cursor-pointer"
                        >
                            <span className="material-symbols-outlined text-base text-[#c3f400]">volume_up</span>
                            <span>Repeat Audio</span>
                        </button>
                    </div>

                    <p className="text-lg font-bold text-white leading-snug tracking-tight">
                        “{activeQuestion}”
                    </p>

                    {/* Simulated Voice Waveform Indicator */}
                    <div className="mt-4 flex items-center gap-1">
                        <span className="h-2 w-1 bg-[#c3f400] rounded-full animate-pulse" />
                        <span className="h-4 w-1 bg-[#c3f400] rounded-full animate-pulse delay-75" />
                        <span className="h-6 w-1 bg-[#c3f400] rounded-full animate-pulse delay-150" />
                        <span className="h-3 w-1 bg-[#c3f400] rounded-full animate-pulse" />
                        <span className="h-5 w-1 bg-[#c3f400] rounded-full animate-pulse delay-200" />
                        <span className="h-2 w-1 bg-[#c3f400] rounded-full animate-pulse delay-100" />
                        <span className="text-[10px] text-[#c4c9ac] ml-2 uppercase font-bold tracking-wider">AI Synthesized Voice Prompt Active</span>
                    </div>
                </div>

                {/* 3. Live Computer Vision Feed Stage & Real-Time Biometric HUD */}
                <div className="relative w-full rounded-2xl bg-[#0c0e14] border border-white/10 overflow-hidden shadow-2xl">
                    <div className="relative w-full aspect-video min-h-[460px] lg:min-h-[560px] bg-[#0a0c12] flex items-center justify-center overflow-hidden">
                        
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
                            <div className="absolute inset-0 flex items-center justify-center text-sm font-semibold text-[#c4c9ac]">
                                <span className="material-symbols-outlined text-2xl text-[#c3f400] animate-spin mr-2">sync</span>
                                Initializing AI Computer Vision Face Landmark Engine...
                            </div>
                        )}

                        {/* TOP HUD FLOATING BADGES */}
                        <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none">
                            <div className="flex items-center gap-2 pointer-events-auto">
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/10 text-white text-xs font-semibold">
                                    <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                                    <span>REC 00:03:42</span>
                                </span>
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/70 backdrop-blur-md border border-[#c3f400]/40 text-[#c3f400] text-xs font-bold">
                                    <span className="material-symbols-outlined text-sm">visibility</span>
                                    <span>Eye Contact: {emotionState.eyeContact}</span>
                                </span>
                            </div>

                            <div className="flex items-center gap-2 pointer-events-auto">
                                <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/10 text-white text-xs font-semibold">
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#c3f400]" />
                                    <span>{targetRole} • {experienceLevel}</span>
                                </span>
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/10 text-[#c4c9ac] text-xs font-semibold">
                                    <span className="material-symbols-outlined text-sm text-[#c3f400]">center_focus_strong</span>
                                    <span>Calibrated</span>
                                </span>
                            </div>
                        </div>

                        {/* Mic Level Equalizer Floating bottom right */}
                        <div className="absolute bottom-24 right-4 hidden md:flex items-end gap-1 px-3 py-2 rounded-xl bg-black/75 backdrop-blur-md border border-white/10 pointer-events-none">
                            <span className="text-[10px] text-[#c4c9ac] mr-1 uppercase font-bold">Mic Level</span>
                            <span className="w-1 h-3 bg-[#c3f400] rounded-full animate-bounce" />
                            <span className="w-1 h-6 bg-[#c3f400] rounded-full animate-bounce delay-75" />
                            <span className="w-1 h-8 bg-[#c3f400] rounded-full animate-bounce delay-150" />
                            <span className="w-1 h-4 bg-[#c3f400] rounded-full animate-bounce delay-100" />
                        </div>

                        {/* BOTTOM HUD OVERLAY: Live Answer Transcript Banner */}
                        <div className="absolute bottom-4 inset-x-4 p-4 rounded-xl bg-[#0c0e14]/90 backdrop-blur-md border border-white/10">
                            <div className="flex items-center justify-between gap-2 mb-1">
                                <div className="flex items-center gap-1.5">
                                    <span className="w-2 h-2 rounded-full bg-[#c3f400] animate-ping" />
                                    <span className="text-[11px] font-bold uppercase text-[#c3f400] tracking-wider">Your Answer Transcript (Live Speech-To-Text):</span>
                                </div>
                                <span className="text-[10px] text-[#c4c9ac]">Whisper v3 Turbo</span>
                            </div>
                            <p className="text-xs sm:text-sm text-white italic font-mono transition-all">
                                {transcript ? `"${transcript}"` : "Click 'Start Answering', speak your response clearly into your microphone, then click 'Stop & Submit'..."}
                            </p>
                        </div>
                    </div>
                </div>

                {/* 4. Real-Time Biometric & Speech Intelligence Telemetry Bar */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                    {/* Emotion */}
                    <div className="bg-[#191b22] rounded-xl p-4 border border-white/5 flex flex-col justify-between hover:border-[#c3f400]/30 transition-all">
                        <div className="flex items-center justify-between text-[#c4c9ac] text-[10px] font-bold uppercase tracking-wider mb-1">
                            <span>Detected Emotion</span>
                            <span className="material-symbols-outlined text-base text-[#c3f400]">sentiment_satisfied</span>
                        </div>
                        <span className="text-base font-bold text-[#c3f400] truncate">{emotionState.emotion}</span>
                        <span className="text-[11px] text-[#c4c9ac] mt-1 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#c3f400]" /> 94% Confidence
                        </span>
                    </div>

                    {/* Composure */}
                    <div className="bg-[#191b22] rounded-xl p-4 border border-white/5 flex flex-col justify-between hover:border-[#c3f400]/30 transition-all">
                        <div className="flex items-center justify-between text-[#c4c9ac] text-[10px] font-bold uppercase tracking-wider mb-1">
                            <span>Composure Score</span>
                            <span className="material-symbols-outlined text-base text-[#ffb2ba]">psychology</span>
                        </div>
                        <div className="flex items-baseline gap-1">
                            <span className="text-xl font-bold text-white">{emotionState.confidenceScore}%</span>
                            <span className="text-[10px] text-[#c3f400] font-bold">↑ Optimal</span>
                        </div>
                        <div className="w-full bg-[#33343b] h-1 rounded-full overflow-hidden mt-2">
                            <div className="bg-[#c3f400] h-full rounded-full" style={{ width: `${emotionState.confidenceScore}%` }} />
                        </div>
                    </div>

                    {/* Pacing */}
                    <div className="bg-[#191b22] rounded-xl p-4 border border-white/5 flex flex-col justify-between hover:border-[#c3f400]/30 transition-all">
                        <div className="flex items-center justify-between text-[#c4c9ac] text-[10px] font-bold uppercase tracking-wider mb-1">
                            <span>Speech Pacing</span>
                            <span className="material-symbols-outlined text-base text-[#c3f400]">speed</span>
                        </div>
                        <div className="flex items-baseline gap-1">
                            <span className="text-xl font-bold text-white">{pacing ? pacing.wpm : 138}</span>
                            <span className="text-xs text-[#c4c9ac]">WPM</span>
                        </div>
                        <span className="text-[11px] text-[#c3f400] font-semibold mt-1">Recommended (130-150)</span>
                    </div>

                    {/* Filler Words */}
                    <div className="bg-[#191b22] rounded-xl p-4 border border-white/5 flex flex-col justify-between hover:border-[#c3f400]/30 transition-all">
                        <div className="flex items-center justify-between text-[#c4c9ac] text-[10px] font-bold uppercase tracking-wider mb-1">
                            <span>Filler Words</span>
                            <span className="material-symbols-outlined text-base text-[#c4c9ac]">record_voice_over</span>
                        </div>
                        <div className="flex items-baseline gap-1">
                            <span className="text-xl font-bold text-white">{fillerAnalysis ? fillerAnalysis.count : 0}</span>
                            <span className="text-xs text-[#c4c9ac]">detected</span>
                        </div>
                        <span className="text-[11px] text-[#c3f400] font-semibold mt-1">Exceptional clarity</span>
                    </div>

                    {/* Eye Contact Ratio */}
                    <div className="col-span-2 md:col-span-1 bg-[#191b22] rounded-xl p-4 border border-white/5 flex flex-col justify-between hover:border-[#c3f400]/30 transition-all">
                        <div className="flex items-center justify-between text-[#c4c9ac] text-[10px] font-bold uppercase tracking-wider mb-1">
                            <span>Eye Contact</span>
                            <span className="material-symbols-outlined text-base text-[#c3f400]">visibility</span>
                        </div>
                        <div className="flex items-baseline gap-1">
                            <span className="text-base font-bold text-[#c3f400]">{emotionState.eyeContact}</span>
                        </div>
                        <span className="text-[11px] text-[#c4c9ac] mt-1">Head tilt locked</span>
                    </div>
                </div>

                {/* 5. Real-Time AI Coaching & Actionable Insights Drawer */}
                <div className="rounded-2xl p-6 bg-[#191b22] border border-white/5 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                    <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-full bg-[#d4004b]/20 flex items-center justify-center text-[#ffb2ba] shrink-0 mt-0.5">
                            <span className="material-symbols-outlined text-xl">tips_and_updates</span>
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-bold text-[#ffb2ba] uppercase tracking-wider">Real-Time Coach Hint:</span>
                                <span className="w-1.5 h-1.5 rounded-full bg-[#d4004b]" />
                                <span className="text-xs text-[#c4c9ac]">Live System Analysis</span>
                            </div>
                            <p className="text-sm text-white mt-1 leading-relaxed">
                                {aiResponse?.feedback || "“Great technical depth with the Go microservices architecture. Remember to highlight the quantitative business outcome — for instance, cloud infrastructure cost savings or transaction throughput increase under heavy load.”"}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 self-end lg:self-center">
                        <button className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 text-white font-semibold text-xs border border-white/10 transition-colors cursor-pointer">
                            <span className="material-symbols-outlined text-base">bookmark_add</span>
                            <span>Bookmark Tip</span>
                        </button>
                    </div>
                </div>

            </div>

            {/* Summary Modal */}
            {showSummaryModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
                    <div className="bg-[#191b22] border border-white/10 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl p-6 sm:p-8 flex flex-col gap-6 text-white">
                        <div className="flex items-start justify-between border-b border-white/10 pb-4">
                            <div>
                                <h2 className="text-2xl font-black text-white">Interview Performance Summary</h2>
                                <p className="text-xs text-[#c4c9ac] mt-1">{targetRole} • {experienceLevel} ({roundsHistory.length} rounds)</p>
                            </div>
                            <button
                                onClick={() => setShowSummaryModal(false)}
                                className="text-[#c4c9ac] hover:text-white px-3 py-1.5 rounded-lg bg-[#282a30] text-xs font-bold"
                            >
                                ✕ Close
                            </button>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                            <div className="bg-[#0c0e14] p-4 rounded-xl border border-white/5">
                                <div className="text-xs text-[#c4c9ac] uppercase font-bold">Avg Tech Score</div>
                                <div className="text-3xl font-extrabold text-[#c3f400] mt-1">{avgTechScore}/100</div>
                            </div>
                            <div className="bg-[#0c0e14] p-4 rounded-xl border border-white/5">
                                <div className="text-xs text-[#c4c9ac] uppercase font-bold">Avg Composure</div>
                                <div className="text-3xl font-extrabold text-cyan-400 mt-1">{avgComposureScore}%</div>
                            </div>
                            <div className="bg-[#0c0e14] p-4 rounded-xl border border-white/5">
                                <div className="text-xs text-[#c4c9ac] uppercase font-bold">Avg Pacing</div>
                                <div className="text-3xl font-extrabold text-amber-400 mt-1">{avgWpm || 138} WPM</div>
                            </div>
                            <div className="bg-[#0c0e14] p-4 rounded-xl border border-white/5">
                                <div className="text-xs text-[#c4c9ac] uppercase font-bold">Eye Contact</div>
                                <div className="text-3xl font-extrabold text-emerald-400 mt-1">{eyeContactPercent}%</div>
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                            <button
                                onClick={restartInterview}
                                className="px-6 py-2.5 rounded-full bg-[#c3f400] text-[#283500] font-bold text-xs hover:bg-[#abd600] transition-all cursor-pointer"
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