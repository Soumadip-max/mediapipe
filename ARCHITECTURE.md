# System Architecture & Technical Guidelines

## Tech Stack
- **Framework**: Next.js 14+ (App Router, TypeScript, Tailwind CSS, Lucide Icons)
- **AI & LLM Services**: Google Gen AI SDK (`@google/genai`) using model `gemini-1.5-flash`
- **Speech-to-Text**: Groq API (`whisper-large-v3`) via `FormData`
- **Computer Vision**: MediaPipe `@mediapipe/tasks-vision` (`FaceLandmarker` & WebGL Canvas overlay)
- **Audio Output**: Browser Native `SpeechSynthesis` API (`window.speechSynthesis`)
- **Environment Config**: `.env.local` (`GROQ_API_KEY`, `GEMINI_API_KEY`)

---

## Unified Directory & Route Structure

```text
app/
├── api/
│   ├── transcribe/
│   │   └── route.ts          # Groq Whisper Speech-to-Text handler
│   ├── interview/
│   │   └── route.ts          # Gemini 1.5 Flash Mock Interview evaluator
│   ├── roadmap/
│   │   └── route.ts          # Structured JSON Learning Roadmap generator
│   ├── resume-ats/
│   │   └── route.ts          # ATS Compatibility & Keyword analysis engine
│   ├── linkedin/
│   │   └── route.ts          # Profile optimization & feedback engine
│   └── doubt-solver/
│       └── route.ts          # Interactive technical Q&A assistant
├── page.tsx                  # Main Unified Dashboard Hub (Tab Router)
components/
├── navigation/
│   └── TopNavbar.tsx         # Main system navigation bar
├── learning/
│   ├── InterestForm.tsx      # User interest & domain input selector
│   └── RoadmapGraph.tsx      # Interactive visual roadmap & curated resources
├── job-prep/
│   ├── AtsChecker.tsx        # Resume paste & ATS scoring dashboard
│   ├── LinkedinOptimizer.tsx # Profile critique & optimization guide
│   ├── FaceAnalyzer.tsx      # WebCam feed, MediaPipe vision loop, audio orchestration
│   └── AudioRecorder.tsx     # Mic capture & duration timer
└── doubt-solver/
    └── ChatDrawer.tsx        # Context-aware AI technical doubt solver