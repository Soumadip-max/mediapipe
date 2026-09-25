"use client";

import React, { useState, useRef, useEffect } from "react";

export default function AudioRecorder({
    onTranscriptionComplete,
    disabled = false,
}: {
    onTranscriptionComplete: (text: string, durationSeconds?: number) => void;
    disabled?: boolean;
}) {
    const [isRecording, setIsRecording] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [recordingTime, setRecordingTime] = useState(0);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioChunksRef = useRef<Blob[]>([]);
    const startTimeRef = useRef<number>(0);
    const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        return () => {
            if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
        };
    }, []);

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorderRef.current = new MediaRecorder(stream);
            audioChunksRef.current = [];
            startTimeRef.current = Date.now();
            setRecordingTime(0);

            timerIntervalRef.current = setInterval(() => {
                setRecordingTime(Math.floor((Date.now() - startTimeRef.current) / 1000));
            }, 500);

            mediaRecorderRef.current.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    audioChunksRef.current.push(event.data);
                }
            };

            mediaRecorderRef.current.onstop = async () => {
                if (timerIntervalRef.current) {
                    clearInterval(timerIntervalRef.current);
                    timerIntervalRef.current = null;
                }
                const durationSeconds = Math.max(1, (Date.now() - startTimeRef.current) / 1000);
                setIsProcessing(true);
                const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
                await sendAudioToBackend(audioBlob, durationSeconds);
                setIsProcessing(false);

                stream.getTracks().forEach((track) => track.stop());
            };

            mediaRecorderRef.current.start();
            setIsRecording(true);
        } catch (err) {
            console.error("Microphone access denied:", err);
            alert("Please allow microphone access to record your answer.");
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
        }
    };

    const sendAudioToBackend = async (audioBlob: Blob, durationSeconds: number) => {
        const formData = new FormData();
        formData.append("file", audioBlob);

        try {
            const res = await fetch("/api/transcribe", {
                method: "POST",
                body: formData,
            });

            if (!res.ok) {
                const errorText = await res.text();
                try {
                    const errorJson = JSON.parse(errorText);
                    alert("Transcription error: " + (errorJson.error || errorJson.message || res.statusText));
                } catch {
                    alert(`Transcription failed (${res.status}): ${errorText || res.statusText}`);
                }
                return;
            }

            const data = await res.json();
            if (data.transcript) {
                onTranscriptionComplete(data.transcript, durationSeconds);
            } else {
                alert("Transcription error: " + (data.error || "No transcript returned"));
            }
        } catch (error) {
            console.error("Error sending audio:", error);
            alert("Network error: Could not connect to speech transcription service.");
        }
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
    };

    return (
        <div className="flex items-center gap-3">
            {isRecording && (
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-rose-950/60 border border-rose-500/40 text-rose-400 font-mono text-xs animate-pulse">
                    <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                    <span>REC {formatTime(recordingTime)}</span>
                </div>
            )}

            {!isRecording ? (
                <button
                    onClick={startRecording}
                    disabled={isProcessing || disabled}
                    className="px-5 py-2.5 rounded-full bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-slate-950 font-bold text-sm transition-all flex items-center gap-2 shadow-lg shadow-emerald-500/20 disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
                >
                    <span className="w-2.5 h-2.5 rounded-full bg-slate-950" />
                    {isProcessing ? "Transcribing with Whisper..." : "Start Answering"}
                </button>
            ) : (
                <button
                    onClick={stopRecording}
                    className="px-5 py-2.5 rounded-full bg-rose-500 hover:bg-rose-600 active:scale-95 text-white font-bold text-sm transition-all animate-pulse flex items-center gap-2 shadow-lg shadow-rose-500/30 cursor-pointer"
                >
                    <span className="w-2.5 h-2.5 rounded-full bg-white" />
                    Stop & Submit Answer
                </button>
            )}
        </div>
    );
}
