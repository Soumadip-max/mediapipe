# System Architecture & Pipeline Guidelines

## Tech Stack
- Framework: Next.js 14+ (App Router, TypeScript, Tailwind CSS)
- Computer Vision: MediaPipe `@mediapipe/tasks-vision` (FaceLandmarker & Iris Tracking)
- Speech-to-Text: Groq API (`whisper-large-v3`) via `FormData`
- Intelligence Engine: Google Gen AI SDK (`@google/genai`) using model `gemini-1.5-flash`
- Audio Output: Browser SpeechSynthesis API (`window.speechSynthesis`)
- Environment Config: `.env.local` (`GROQ_API_KEY`, `GEMINI_API_KEY`)

## Folder & Route Structure
- `app/api/transcribe/route.ts` -> Receives audio Blob, forwards to Groq Whisper API, returns transcript text and duration.
- `app/api/interview/route.ts` -> Receives transcript, face metrics, target role, and experience level; queries Gemini 1.5 Flash; returns structured JSON (feedback, score, followUpQuestion).
- `components/AudioRecorder.tsx` -> Captures microphone input with duration timers, posts to `/api/transcribe`.
- `components/FaceAnalyzer.tsx` -> Renders webcam feed, executes MediaPipe vision loop, tracks state (rounds, target role, filler words, WPM), orchestrates Gemini evaluation calls, and handles SpeechSynthesis audio.

## State & Utility Guidelines
- Target Role & Level State: Managed inside `components/FaceAnalyzer.tsx` and injected into the POST body for `/api/interview`.
- Filler Word Counter: Utility function parsing incoming transcript strings for hesitation markers (`um`, `uh`, `like`, `basically`, `actually`, `you know`) and updating session totals.
- Session Management: Stores multi-round history arrays to compute cumulative averages for the final summary modal.

## Golden Engineering Rules for AI Agent
1. Strict Route Paths: Keep API routes isolated strictly under `app/api/[route_name]/route.ts`. Never nest routes inside other API directories.
2. WebAssembly/MediaPipe Safety: Always verify `video.readyState >= 2`, `video.videoWidth > 0`, and timestamp diffs in `detectLoop` before calling MediaPipe detection.
3. Safe Fetch Operations: Always check `if (!res.ok)` before executing `await res.json()`.
4. Incremental Builds: Never modify unrelated working modules. Preserve all existing audio, vision, and speech functionality during feature refactoring.