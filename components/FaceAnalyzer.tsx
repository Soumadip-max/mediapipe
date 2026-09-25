"use client";

import React, { useEffect, useRef, useState } from "react";
import { FilesetResolver, FaceLandmarker } from "@mediapipe/tasks-vision";
import AudioRecorder from "@/components/AudioRecorder";

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
    "Frontend Developer",
    "Backend Developer",
    "Full-Stack Engineer",
    "Data Structures & Algorithms",
] as const;

const EXPERIENCE_LEVELS = [
    "Junior (0-2 yrs)",
    "Mid-Level (2-5 yrs)",
    "Senior (5+ yrs)",
] as const;

type TargetRole = typeof TARGET_ROLES[number];
type ExperienceLevel = typeof EXPERIENCE_LEVELS[number];

const getInitialQuestion = (role: TargetRole, level: ExperienceLevel) => {
    switch (role) {
        case "Frontend Developer":
            return `Welcome to your ${role} (${level}) technical interview! Please introduce yourself, summarize your experience with modern frontend architecture and web performance, and walk me through a complex user interface or application you recently engineered.`;
        case "Backend Developer":
            return `Welcome to your ${role} (${level}) technical interview! Please introduce yourself, your experience with server-side architecture and data persistence, and walk me through a distributed service or backend system you recently designed.`;
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

    // Filler Word Analysis State (Live & Latest Round)
    const [fillerAnalysis, setFillerAnalysis] = useState<FillerWordAnalysis | null>(null);

    // AI Interviewer Response for Current Round
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
        eyeContact: "Checking...",
        emotion: "Neutral / Focused",
        confidenceScore: 100,
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

    // Trigger Gemini evaluation when candidate stops recording
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

                // Check if session reached the total rounds limit
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

    // Calculate aggregated metrics for summary
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

    const directEyeContactCount = roundsHistory.filter((r) => r.eyeContact === "Direct").length;
    const eyeContactPercent = roundsHistory.length > 0
        ? Math.round((directEyeContactCount / roundsHistory.length) * 100)
        : 0;

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
            strengths.push(`Optimal speaking cadence (${avgWpm} WPM), making technical points easy to follow.`);
        } else if (avgWpm > 165) {
            improvements.push(`Speech tempo was fast (${avgWpm} WPM). Aim for 120-150 WPM to give listeners time to digest key points.`);
        } else if (avgWpm > 0 && avgWpm < 110) {
            improvements.push(`Speech tempo was slower (${avgWpm} WPM). Try organizing your thoughts upfront to build momentum.`);
        }

        // Filler word communication feedback
        const avgFillersNum = parseFloat(avgFillerPerRound);
        if (avgFillersNum <= 1.5) {
            strengths.push(`Crisp & concise verbal delivery with minimal speech hesitation (${totalFillerCount} filler words total, ${avgFillerPerRound}/round).`);
        } else if (avgFillersNum <= 3.0) {
            improvements.push(`Moderate filler word usage (${totalFillerCount} fillers total, ~${avgFillerPerRound}/round). Practice substituting filler words like "like" or "basically" with brief pauses.`);
        } else {
            improvements.push(`Noticeable speech hesitation (${totalFillerCount} fillers total, ~${avgFillerPerRound}/round). Use deliberate pauses to structure thoughts before answering.`);
        }

        if (eyeContactPercent >= 75) {
            strengths.push(`Exceptional eye contact engagement (${eyeContactPercent}%), conveying high confidence.`);
        } else {
            improvements.push(`Eye contact dropped during certain rounds (${eyeContactPercent}% direct). Look directly into the camera when articulating key conclusions.`);
        }

        return { strengths, improvements };
    };

    const insights = getPerformanceInsights();

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
                                    [234, 116], [116, 117], [117, 118], [118, 119], [119, 120],
                                    [454, 345], [345, 346], [346, 347], [347, 348], [348, 349]
                                ];

                                sparseConnections.forEach(([start, end]) => {
                                    drawSparseLine(start, end, "rgba(234, 179, 8, 0.75)", 1.2);
                                });

                                const featureConnections = [
                                    [33, 160], [160, 158], [158, 133], [133, 153], [153, 144], [144, 33],
                                    [362, 385], [385, 387], [387, 263], [263, 373], [373, 380], [380, 362],
                                    [61, 185], [185, 40], [40, 39], [39, 37], [37, 0], [0, 267], [267, 269], [269, 270], [270, 409], [409, 291], [291, 375], [375, 321], [321, 405], [405, 314], [314, 17], [17, 84], [84, 181], [181, 91], [91, 146], [146, 61]
                                ];

                                featureConnections.forEach(([start, end]) => {
                                    drawSparseLine(start, end, "#fde047", 1.4);
                                });

                                const leftIris = landmarks[468];
                                const rightIris = landmarks[473];
                                [leftIris, rightIris].forEach((iris) => {
                                    if (iris) {
                                        ctx.beginPath();
                                        ctx.arc(iris.x * canvas.width, iris.y * canvas.height, 2.5, 0, 2 * Math.PI);
                                        ctx.fillStyle = "#38bdf8";
                                        ctx.fill();
                                    }
                                });

                                const leftInner = landmarks[133];
                                const leftOuter = landmarks[33];

                                let eyeContactStatus = "Lost";
                                if (leftInner && leftOuter && leftIris) {
                                    const ratio = (leftIris.x - leftOuter.x) / (leftInner.x - leftOuter.x);
                                    if (ratio >= 0.35 && ratio <= 0.65) {
                                        eyeContactStatus = "Direct";
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
                                    const browDownLeft = getShape("browDownLeft");
                                    const mouthPucker = getShape("mouthPucker");

                                    if (smileLeft > 0.3 || smileRight > 0.3) {
                                        detectedEmotion = "Smiling / Confident";
                                    } else if (eyeWide > 0.35) {
                                        detectedEmotion = "Surprised / Scared";
                                        nervousScore = 35;
                                    } else if (browDownLeft > 0.25) {
                                        detectedEmotion = "Tense / Confused";
                                        nervousScore = 20;
                                    } else if (mouthPucker > 0.2) {
                                        detectedEmotion = "Hesitant / Thinking";
                                        nervousScore = 15;
                                    }
                                }

                                setEmotionState({
                                    eyeContact: eyeContactStatus,
                                    emotion: detectedEmotion,
                                    confidenceScore: Math.max(0, 100 - nervousScore),
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

    const getPacingBadgeStyle = (status: string) => {
        switch (status) {
            case "Good Pacing":
                return "bg-emerald-500/20 border-emerald-500/40 text-emerald-400";
            case "Too Fast":
                return "bg-rose-500/20 border-rose-500/40 text-rose-400";
            case "Too Slow":
                return "bg-amber-500/20 border-amber-500/40 text-amber-400";
            default:
                return "bg-slate-700/40 border-slate-600/40 text-slate-400";
        }
    };

    const getFillerBadgeStyle = (count: number) => {
        if (count <= 1) {
            return "bg-emerald-500/20 border-emerald-500/40 text-emerald-400";
        } else if (count <= 3) {
            return "bg-amber-500/20 border-amber-500/40 text-amber-400";
        } else {
            return "bg-rose-500/20 border-rose-500/40 text-rose-400";
        }
    };

    return (
        <div className="w-full max-w-6xl bg-slate-900 border border-slate-800 rounded-2xl flex flex-col overflow-hidden shadow-2xl p-6 gap-6 relative">
            {/* Header: Title, Active Badge & Audio Controls */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                <div className="flex items-center gap-3">
                    <span className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse" />
                    <div>
                        <div className="flex items-center flex-wrap gap-2">
                            <h1 className="text-xl font-bold tracking-wide text-white flex items-center gap-2">
                                AI Interviewer Studio
                            </h1>
                            <span className="text-xs px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-semibold">
                                Live Session
                            </span>
                            {/* Active HUD Badge in Header */}
                            <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-sky-950/80 border border-sky-500/30 text-xs text-sky-200">
                                <span className="font-bold text-sky-300">🎯 {targetRole}</span>
                                <span className="text-slate-500">·</span>
                                <span className="text-slate-300 font-medium">{experienceLevel}</span>
                            </div>
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5">Real-Time Computer Vision & Speech Intelligence</p>
                    </div>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                    {/* View Final Summary Button (if session finished) */}
                    {isSessionFinished && (
                        <button
                            onClick={() => setShowSummaryModal(true)}
                            className="px-4 py-2 rounded-full bg-sky-500 hover:bg-sky-600 text-white font-bold text-xs transition-all shadow-md shadow-sky-500/20"
                        >
                            📊 View Final Summary
                        </button>
                    )}

                    <AudioRecorder
                        onTranscriptionComplete={handleTranscriptionComplete}
                        disabled={isSessionFinished || isAnalyzing}
                    />
                </div>
            </div>

            {/* Role & Experience Level Setup Controls (Visible before interview starts) */}
            {roundsHistory.length === 0 && (
                <div className="w-full bg-slate-950/90 border border-sky-500/30 rounded-xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-lg shadow-sky-950/20">
                    <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-sky-400 animate-pulse" />
                        <span className="text-xs font-bold text-sky-400 uppercase tracking-wider">
                            Interview Setup & Tuning
                        </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                        {/* Role Selector */}
                        <div className="flex items-center gap-2 bg-slate-900 border border-slate-700/80 rounded-lg px-3 py-1.5 hover:border-sky-500/50 transition-colors">
                            <label className="text-xs text-slate-400 font-medium whitespace-nowrap">💼 Target Role:</label>
                            <select
                                value={targetRole}
                                onChange={(e) => handleRoleChange(e.target.value as TargetRole)}
                                className="bg-transparent text-xs font-bold text-white focus:outline-none cursor-pointer"
                            >
                                {TARGET_ROLES.map((r) => (
                                    <option key={r} value={r} className="bg-slate-900 text-white">
                                        {r}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Experience Level Selector */}
                        <div className="flex items-center gap-2 bg-slate-900 border border-slate-700/80 rounded-lg px-3 py-1.5 hover:border-sky-500/50 transition-colors">
                            <label className="text-xs text-slate-400 font-medium whitespace-nowrap">📈 Experience Level:</label>
                            <select
                                value={experienceLevel}
                                onChange={(e) => handleLevelChange(e.target.value as ExperienceLevel)}
                                className="bg-transparent text-xs font-bold text-white focus:outline-none cursor-pointer"
                            >
                                {EXPERIENCE_LEVELS.map((l) => (
                                    <option key={l} value={l} className="bg-slate-900 text-white">
                                        {l}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Round Target Selector */}
                        <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-700/80 px-3 py-1 rounded-lg text-xs text-slate-300">
                            <span className="text-slate-400">Total:</span>
                            {[3, 4, 5].map((count) => (
                                <button
                                    key={count}
                                    onClick={() => setTotalRounds(count)}
                                    className={`px-2 py-0.5 rounded font-bold transition-all ${totalRounds === count
                                        ? "bg-sky-500 text-white shadow-sm"
                                        : "hover:text-white text-slate-400"
                                        }`}
                                >
                                    {count} Qs
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Multi-Round Progress Tracker */}
            <div className="w-full bg-slate-950/80 border border-slate-800 rounded-xl p-4 flex flex-col gap-2.5">
                <div className="flex items-center justify-between text-xs font-semibold">
                    <div className="flex items-center gap-2">
                        <span className="text-sky-400 font-bold uppercase tracking-wider">
                            Round Progress:
                        </span>
                        <span className="text-white">
                            Question {Math.min(currentRound, totalRounds)} of {totalRounds}
                        </span>
                    </div>
                    <div className="text-slate-400">
                        {isSessionFinished ? (
                            <span className="text-emerald-400 font-bold">🎉 Interview Session Completed</span>
                        ) : (
                            <span>{totalRounds - currentRound + 1} round(s) remaining</span>
                        )}
                    </div>
                </div>

                {/* Progress Bar & Step Dots */}
                <div className="flex items-center gap-2">
                    {Array.from({ length: totalRounds }).map((_, idx) => {
                        const roundNum = idx + 1;
                        const isCompleted = roundNum < currentRound || isSessionFinished;
                        const isCurrent = roundNum === currentRound && !isSessionFinished;

                        return (
                            <div key={idx} className="flex-1 flex flex-col gap-1">
                                <div
                                    className={`h-2 rounded-full transition-all duration-500 ${isCompleted
                                        ? "bg-emerald-500 shadow-sm shadow-emerald-500/50"
                                        : isCurrent
                                            ? "bg-sky-500 animate-pulse"
                                            : "bg-slate-800"
                                        }`}
                                />
                                <span className={`text-[10px] text-center font-mono ${isCompleted ? "text-emerald-400 font-bold" : isCurrent ? "text-sky-400 font-bold" : "text-slate-600"}`}>
                                    Q{roundNum}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Active Question Banner */}
            <div className="w-full bg-gradient-to-r from-sky-950/60 via-slate-900 to-indigo-950/60 border border-sky-500/30 rounded-xl p-4 flex items-start gap-3">
                <span className="text-xl">🎙️</span>
                <div className="flex-1">
                    <div className="flex items-center justify-between">
                        <p className="text-xs text-sky-400 font-bold uppercase tracking-wider mb-1">
                            Current Question (Round {Math.min(currentRound, totalRounds)}):
                        </p>
                        <button
                            onClick={() => speakQuestion(activeQuestion)}
                            className="text-xs text-sky-400 hover:text-sky-300 flex items-center gap-1 font-medium transition-colors"
                            title="Repeat Question via SpeechSynthesis"
                        >
                            🔊 Repeat
                        </button>
                    </div>
                    <p className="text-white text-base font-semibold leading-relaxed">
                        {activeQuestion}
                    </p>
                </div>
            </div>

            {/* Video Viewport with MediaPipe Mesh */}
            <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-slate-700 bg-slate-950 shadow-inner">
                <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="absolute inset-0 w-full h-full object-cover -scale-x-100"
                />
                <canvas
                    ref={canvasRef}
                    className="absolute inset-0 w-full h-full object-cover -scale-x-100 pointer-events-none"
                />

                {isLoaded ? (
                    <>
                        <div className="absolute top-4 left-4 flex flex-wrap items-center gap-2">
                            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full backdrop-blur-md bg-black/70 border border-white/10 text-xs text-white">
                                <span
                                    className={`w-2.5 h-2.5 rounded-full animate-pulse ${emotionState.eyeContact === "Direct" ? "bg-emerald-400" : "bg-rose-500"
                                        }`}
                                />
                                <span>Eye Contact: {emotionState.eyeContact}</span>
                            </div>

                            {pacing && (
                                <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full backdrop-blur-md border text-xs font-semibold ${getPacingBadgeStyle(pacing.status)}`}>
                                    <span>⚡ {pacing.wpm} WPM</span>
                                    <span>·</span>
                                    <span>{pacing.status}</span>
                                </div>
                            )}

                            {fillerAnalysis && (
                                <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full backdrop-blur-md border text-xs font-semibold ${getFillerBadgeStyle(fillerAnalysis.count)}`}>
                                    <span>💬 {fillerAnalysis.count} Filler{fillerAnalysis.count === 1 ? "" : "s"}</span>
                                    <span>·</span>
                                    <span>{fillerAnalysis.status}</span>
                                </div>
                            )}
                        </div>

                        {/* Active HUD Badge in Video Viewport */}
                        <div className="absolute top-4 right-4 flex items-center gap-2 px-3.5 py-1.5 rounded-full backdrop-blur-md bg-slate-950/80 border border-sky-500/40 text-xs text-sky-200 shadow-md">
                            <span className="w-2 h-2 rounded-full bg-sky-400" />
                            <span className="font-bold text-white">{targetRole}</span>
                            <span className="text-slate-500">·</span>
                            <span className="text-sky-300 font-medium">{experienceLevel}</span>
                        </div>
                    </>
                ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-sm text-slate-400">
                        Initializing AI Computer Vision...
                    </div>
                )}
            </div>

            {/* Candidate Spoken Transcript */}
            <div className="w-full bg-slate-950 border border-slate-800 p-4 rounded-xl">
                <div className="flex items-center justify-between mb-1">
                    <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
                        Your Answer Transcript:
                    </p>
                    {transcript && (
                        <div className="flex items-center gap-2 text-[11px] font-mono">
                            <span className="text-slate-400">
                                {transcript.trim().split(/\s+/).filter(Boolean).length} words
                            </span>
                            {fillerAnalysis && (
                                <span className={`px-2 py-0.5 rounded font-semibold ${getFillerBadgeStyle(fillerAnalysis.count)}`}>
                                    {fillerAnalysis.count} filler{fillerAnalysis.count === 1 ? "" : "s"}
                                </span>
                            )}
                        </div>
                    )}
                </div>
                <p className="text-slate-200 text-sm italic font-mono min-h-[24px]">
                    {transcript ? `"${transcript}"` : "Click 'Start Answering', speak your response, then click 'Stop & Submit'..."}
                </p>
            </div>

            {/* AI Evaluation Loading */}
            {isAnalyzing && (
                <div className="w-full p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-300 text-sm animate-pulse font-semibold flex items-center gap-3">
                    <span className="w-3 h-3 rounded-full bg-amber-400 animate-ping" />
                    <span>🤖 AI Interviewer is analyzing technical accuracy, composure, and speech pacing...</span>
                </div>
            )}

            {/* Latest AI Feedback */}
            {aiResponse && !isAnalyzing && (
                <div className="w-full bg-slate-950 border border-emerald-500/40 p-5 rounded-xl flex flex-col gap-3">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                        <span className="text-emerald-400 font-bold text-sm uppercase tracking-wider flex items-center gap-2">
                            🤖 AI Interviewer Evaluation (Round {Math.min(currentRound - 1 || 1, totalRounds)})
                        </span>
                        <div className="flex items-center gap-2">
                            <span className="text-xs bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 px-3 py-1 rounded-full font-bold">
                                Score: {aiResponse.score}/100
                            </span>
                        </div>
                    </div>

                    <div>
                        <p className="text-xs text-slate-400 font-bold uppercase mb-1">Feedback:</p>
                        <p className="text-slate-300 text-sm leading-relaxed">{aiResponse.feedback}</p>
                    </div>
                </div>
            )}

            {/* 5-Metric Real-Time HUD Bar */}
            <div className="w-full grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 bg-slate-800/90 p-5 rounded-xl border border-slate-700 text-white">
                <div>
                    <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Detected Emotion</p>
                    <p className="text-lg font-bold text-emerald-400 mt-1 truncate">{emotionState.emotion}</p>
                </div>
                <div>
                    <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Composure Score</p>
                    <p className="text-lg font-bold text-sky-400 mt-1">{emotionState.confidenceScore}%</p>
                </div>
                <div>
                    <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Speech Pacing</p>
                    <div className="mt-1 flex items-center gap-2">
                        <span className="text-lg font-bold text-amber-400">
                            {pacing ? `${pacing.wpm} WPM` : "--"}
                        </span>
                        {pacing && (
                            <span className={`text-[10px] px-2 py-0.5 rounded-full border font-semibold ${getPacingBadgeStyle(pacing.status)}`}>
                                {pacing.status}
                            </span>
                        )}
                    </div>
                </div>
                <div>
                    <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Filler Words</p>
                    <div className="mt-1 flex items-center gap-2">
                        <span className={`text-lg font-bold ${fillerAnalysis ? (fillerAnalysis.count <= 1 ? "text-emerald-400" : fillerAnalysis.count <= 3 ? "text-amber-400" : "text-rose-400") : "text-slate-400"}`}>
                            {fillerAnalysis ? `${fillerAnalysis.count} Count` : "--"}
                        </span>
                        {fillerAnalysis && (
                            <span className={`text-[10px] px-2 py-0.5 rounded-full border font-semibold ${getFillerBadgeStyle(fillerAnalysis.count)}`}>
                                {fillerAnalysis.status}
                            </span>
                        )}
                    </div>
                </div>
                <div>
                    <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Eye Contact</p>
                    <p className={`text-lg font-bold mt-1 ${emotionState.eyeContact === "Direct" ? "text-emerald-400" : "text-rose-400"}`}>
                        {emotionState.eyeContact}
                    </p>
                </div>
            </div>

            {/* Final Performance Summary Modal */}
            {showSummaryModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
                    <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl p-6 sm:p-8 flex flex-col gap-6 text-white">
                        {/* Modal Header */}
                        <div className="flex items-start justify-between border-b border-slate-800 pb-4">
                            <div>
                                <div className="flex items-center gap-2">
                                    <span className="text-2xl">🏆</span>
                                    <h2 className="text-2xl font-black tracking-tight text-white">
                                        Interview Performance Summary
                                    </h2>
                                </div>
                                <div className="flex items-center gap-2 mt-2">
                                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-sky-950/80 border border-sky-500/40 text-sky-300 font-semibold">
                                        💼 {targetRole}
                                    </span>
                                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-slate-300 font-medium">
                                        📈 {experienceLevel}
                                    </span>
                                    <span className="text-xs text-slate-400">
                                        · {roundsHistory.length} of {totalRounds} rounds completed
                                    </span>
                                </div>
                            </div>
                            <button
                                onClick={() => setShowSummaryModal(false)}
                                className="text-slate-400 hover:text-white p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-sm font-bold transition-all"
                            >
                                ✕ Close
                            </button>
                        </div>

                        {/* Top Summary Metric Cards (5 Cards) */}
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                            <div className="bg-slate-950 border border-emerald-500/30 p-4 rounded-xl flex flex-col items-center justify-center text-center">
                                <span className="text-xs text-slate-400 font-semibold uppercase">Avg Tech Score</span>
                                <span className="text-2xl sm:text-3xl font-black text-emerald-400 mt-1">{avgTechScore}/100</span>
                                <span className="text-[11px] text-emerald-500/80 mt-1 font-semibold">
                                    {avgTechScore >= 80 ? "Senior Level" : avgTechScore >= 65 ? "Mid Level" : "Developing"}
                                </span>
                            </div>

                            <div className="bg-slate-950 border border-sky-500/30 p-4 rounded-xl flex flex-col items-center justify-center text-center">
                                <span className="text-xs text-slate-400 font-semibold uppercase">Avg Composure</span>
                                <span className="text-2xl sm:text-3xl font-black text-sky-400 mt-1">{avgComposureScore}%</span>
                                <span className="text-[11px] text-sky-500/80 mt-1 font-semibold">
                                    {avgComposureScore >= 80 ? "High Presence" : "Steady"}
                                </span>
                            </div>

                            <div className="bg-slate-950 border border-amber-500/30 p-4 rounded-xl flex flex-col items-center justify-center text-center">
                                <span className="text-xs text-slate-400 font-semibold uppercase">Avg Pacing</span>
                                <span className="text-2xl sm:text-3xl font-black text-amber-400 mt-1">{avgWpm}</span>
                                <span className="text-[11px] text-amber-500/80 mt-1 font-semibold">Words / Minute</span>
                            </div>

                            <div className="bg-slate-950 border border-rose-500/30 p-4 rounded-xl flex flex-col items-center justify-center text-center">
                                <span className="text-xs text-slate-400 font-semibold uppercase">Filler Words</span>
                                <span className="text-2xl sm:text-3xl font-black text-rose-400 mt-1">{totalFillerCount}</span>
                                <span className={`text-[10px] px-2 py-0.5 rounded-full mt-1 border font-semibold ${getFillerBadgeStyle(parseFloat(avgFillerPerRound))}`}>
                                    ~{avgFillerPerRound} / round
                                </span>
                            </div>

                            <div className="bg-slate-950 border border-purple-500/30 p-4 rounded-xl flex flex-col items-center justify-center text-center">
                                <span className="text-xs text-slate-400 font-semibold uppercase">Direct Eye Contact</span>
                                <span className="text-2xl sm:text-3xl font-black text-purple-400 mt-1">{eyeContactPercent}%</span>
                                <span className="text-[11px] text-purple-500/80 mt-1 font-semibold">
                                    {directEyeContactCount}/{roundsHistory.length} Rounds
                                </span>
                            </div>
                        </div>

                        {/* Performance Analysis: Strengths & Improvement Areas */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="bg-emerald-950/20 border border-emerald-500/30 rounded-xl p-4">
                                <h3 className="text-sm font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-2 mb-3">
                                    <span>✨</span> Key Strengths
                                </h3>
                                <ul className="space-y-2 text-xs text-slate-200">
                                    {insights.strengths.map((s, i) => (
                                        <li key={i} className="flex items-start gap-2">
                                            <span className="text-emerald-400 font-bold">•</span>
                                            <span>{s}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="bg-amber-950/20 border border-amber-500/30 rounded-xl p-4">
                                <h3 className="text-sm font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2 mb-3">
                                    <span>🎯</span> Areas to Improve
                                </h3>
                                <ul className="space-y-2 text-xs text-slate-200">
                                    {insights.improvements.map((imp, i) => (
                                        <li key={i} className="flex items-start gap-2">
                                            <span className="text-amber-400 font-bold">•</span>
                                            <span>{imp}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        {/* Detailed Round-by-Round Breakdown */}
                        <div className="flex flex-col gap-3">
                            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                                <span>📋</span> Round-by-Round Breakdown
                            </h3>
                            <div className="space-y-3">
                                {roundsHistory.map((r) => (
                                    <div key={r.round} className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex flex-col gap-2">
                                        <div className="flex items-center justify-between flex-wrap gap-2">
                                            <span className="text-xs font-bold text-sky-400">
                                                Round {r.round}
                                            </span>
                                            <div className="flex items-center flex-wrap gap-2 text-xs">
                                                <span className="bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded font-bold">
                                                    Score: {r.score}/100
                                                </span>
                                                <span className="bg-sky-500/20 text-sky-300 px-2 py-0.5 rounded font-bold">
                                                    Composure: {r.composureScore}%
                                                </span>
                                                <span className={`px-2 py-0.5 rounded font-bold border ${getPacingBadgeStyle(r.pacingStatus)}`}>
                                                    {r.wpm} WPM ({r.pacingStatus})
                                                </span>
                                                <span className={`px-2 py-0.5 rounded font-bold border ${getFillerBadgeStyle(r.fillerCount)}`}>
                                                    💬 {r.fillerCount} Filler{r.fillerCount === 1 ? "" : "s"}
                                                </span>
                                            </div>
                                        </div>
                                        <div>
                                            <p className="text-[11px] text-slate-500 font-semibold uppercase">Question:</p>
                                            <p className="text-xs text-slate-300">{r.question}</p>
                                        </div>
                                        <div>
                                            <p className="text-[11px] text-slate-500 font-semibold uppercase">Candidate Transcript:</p>
                                            <p className="text-xs text-slate-300 italic font-mono">"{r.transcript}"</p>
                                            {r.fillerCount > 0 && (
                                                <div className="mt-1 flex items-center flex-wrap gap-1 text-[11px] text-rose-300/80">
                                                    <span className="font-semibold">Detected Fillers:</span>
                                                    {Object.entries(r.fillerBreakdown).map(([word, count]) => (
                                                        <span key={word} className="px-1.5 py-0.5 bg-rose-950/60 border border-rose-500/30 rounded text-rose-300">
                                                            "{word}" × {count}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                        <div>
                                            <p className="text-[11px] text-slate-500 font-semibold uppercase">Feedback:</p>
                                            <p className="text-xs text-emerald-300/90">{r.feedback}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Modal Action Footer */}
                        <div className="flex items-center justify-between border-t border-slate-800 pt-4">
                            <button
                                onClick={() => setShowSummaryModal(false)}
                                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-semibold transition-all"
                            >
                                Back to HUD
                            </button>
                            <button
                                onClick={restartInterview}
                                className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-sm transition-all flex items-center gap-2 shadow-lg shadow-emerald-500/20"
                            >
                                <span>🔄</span> Restart New Interview
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}