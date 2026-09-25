# Product Requirement Document (PRD) - Career Launchpad AI

## Product Overview
Career Launchpad AI is an end-to-end career acceleration and placement preparation platform. It unifies personalized learning roadmaps, job application optimization (ATS & LinkedIn analysis), real-time AI mock interviewing with multimodal analysis, and an instant technical doubt solver into a single cohesive ecosystem.

---

## Core System Modules

### Module 1: Unified Platform Shell & Navigation
- **Top Bar / Navigation Router**: Seamless switching between 3 primary pillars:
  1. 📘 **Learning Prep** (Roadmaps & Courses)
  2. 💼 **Job Prep** (ATS Checker, LinkedIn Optimizer, AI Mock Interview Studio)
  3. 💬 **Doubt Solver** (24/7 AI Mentor Chatbot)
- **Global Context Provider**: Persists user career goal, target role, experience level, and session state across modules.

---

### Module 2: Learning Prep Engine
- **Interest & Goal Input**: Form capturing candidate domain (*Frontend, Backend, Full-Stack, Systems, DevOps, Data Structures*) and learning target.
- **AI Roadmap Generator**: Powered by Gemini 1.5 Flash structured outputs.
  - Interactive Visual Roadmap Nodes (Phases, Concepts, Prerequisites).
  - Curated learning resource links (YouTube query links, documentation, reference notes).
  - Progress tracking checkboxes for milestone completion.

---

### Module 3: Job Prep Suite

#### 3A. ATS Resume Analyzer
- **Input**: Resume text paste or file upload + Target Job Description.
- **Evaluation Engine**:
  - ATS Match Score (0–100%).
  - Missing Key Technical Keywords & Skills.
  - Formatting & Impact Scorecard (Action verbs, quantified achievements).
  - Rewritten Bullet Point Suggestions.

#### 3B. LinkedIn Profile Optimizer
- **Input**: LinkedIn Summary / Experience text paste or profile URL.
- **Evaluation Engine**:
  - Profile Headline & Summary Strength Rating.
  - Critical Drawbacks & Missing Keywords for Recruiter Searchability.
  - Actionable Step-by-Step Profile Improvement Plan.

#### 3C. AI Mock Interview Studio
- **Vision & Composure Engine**: MediaPipe `@mediapipe/tasks-vision` (FaceLandmarker & Iris tracking) rendering gold wireframes, eye contact ratio, and emotional state.
- **Speech-to-Text**: Groq Whisper (`whisper-large-v3`) sub-second audio transcription.
- **Speech Analytics**: Words Per Minute (WPM) pacing calculator + Live Filler Word Counter (`um`, `uh`, `like`, `basically`, `actually`, `you know`).
- **Dynamic LLM Interviewer**: Gemini 1.5 Flash JSON evaluator configured by Target Role & Seniority Level.
- **Speech Output**: Browser `SpeechSynthesis` out-loud question reading.
- **Final Performance Modal**: Comprehensive scorecard with technical average, composure rating, speech pacing, eye contact, filler word analysis, and round-by-round breakdown.

---

### Module 4: 24/7 AI Doubt Solver
- **Persistent Chat Interface**: Sidebar/drawer or dedicated full-page chatbot tab.
- **Context-Aware Assistance**: Answers code errors, explains roadmap concepts, and clarifies interview feedback.
- **Rich Output Formatting**: Formatted Markdown code blocks, syntax highlighting, and step-by-step problem-solving breakdowns.