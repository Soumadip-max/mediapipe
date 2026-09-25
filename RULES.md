


# Agent Operating Rules & System Safeguards

## 1. Code Isolation & Non-Regression Strategy
- Never rewrite working API routes or components when adding new features.
- Keep all API endpoints strictly isolated under `app/api/[route_name]/route.ts`. Never nest API routes inside sub-folders.
- Keep components modular: `FaceAnalyzer.tsx` (Interview), `RoadmapGraph.tsx` (Learning), `AtsChecker.tsx` (Resume), and `ChatDrawer.tsx` (Doubt Solver) must stay completely decoupled.

## 2. MediaPipe & WebAssembly Canvas Safety Rules
- Guard all MediaPipe detection loops with strict prerequisites:
  - `video.readyState >= 2`
  - `video.videoWidth > 0` and `video.videoHeight > 0`
  - `timestamp > lastTimestamp` to prevent duplicate processing frame loops.

## 3. API & Response Validation Safeguards
- Always validate fetch status with `if (!res.ok)` before attempting `await res.json()`.
- Wrap all backend LLM API calls in `try / catch` blocks and return standardized JSON error objects: `{ error: string }`.

## 4. Architectural Incremental Expansion
- Build one module at a time. Run `npm run build` after every major UI or route implementation to catch TypeScript or bundling errors immediately.