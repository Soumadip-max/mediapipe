# Product Requirement Document (PRD) - AI Interviewer Studio

## Product Overview
AI Interviewer Studio is a real-time, browser-based mock interview platform built for hackathon demonstration. It combines real-time facial composure tracking, high-speed audio transcription, dynamic LLM evaluation, and voice feedback to simulate a realistic technical interview.

## Key Features & Status

### 1. Vision & Composure Pipeline [COMPLETED]
- Renders live video feed with gold sparse facial wireframe overlay.
- Tracks eye contact (Direct / Lost) using iris landmark coordinates.
- Estimates emotional state (Smiling/Confident, Hesitant/Thinking, Tense/Confused, Surprised/Scared).
- Computes real-time Composure Score (0-100%).

### 2. Audio & Speech-to-Text Pipeline [COMPLETED]
- Single-button Start/Stop audio recording using `MediaRecorder`.
- Transcribes audio via Groq Whisper (`whisper-large-v3`) in under 0.5s.
- Displays live transcript in HUD.

### 3. LLM Interviewer Engine [COMPLETED]
- Sends transcript + composure metrics to Gemini 1.5 Flash.
- Receives structured JSON: answer score (0-100), concise feedback, and follow-up question.
- Speaks follow-up question automatically using browser `SpeechSynthesis`.

### 4. Multi-Round Session & Performance Summary [COMPLETED]
- Multi-round session tracker supporting 3 to 5 configurable questions.
- Real-time Speech Pacing calculation (Words Per Minute) with color-coded status badges ("Good Pacing", "Too Fast", "Too Slow").
- Final Performance Summary Modal displaying technical average, composure average, speech pacing cadence, eye contact metrics, key strengths, areas to improve, round-by-round scorecard, and clean session reset.

### 5. Role Customization & Speech Analysis [COMPLETED]
- Target Role & Experience Level Selection (Frontend, Backend, Fullstack, DSA / Junior, Mid, Senior) dynamically injecting calibrated system prompts into Gemini. [COMPLETED]
- Filler Word Tracking ("um", "uh", "like", "actually", "basically", "you know") parsed from transcription and scored in HUD + final summary. [COMPLETED]