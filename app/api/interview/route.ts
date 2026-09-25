import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(req: Request) {
    try {
        const { transcript, emotion, confidenceScore, role = "Full-Stack Engineer", level = "Mid-Level (2-5 yrs)" } = await req.json();

        if (!transcript) {
            return NextResponse.json({ error: "No transcript provided" }, { status: 400 });
        }

        const roleGuidelines: Record<string, string> = {
            "Frontend Developer": "Focus on UI/UX architecture, DOM rendering and reconciliation, React/component lifecycles, CSS/layout paradigms, browser performance, accessibility (a11y), state management, and modern Web APIs.",
            "Backend Developer": "Focus on distributed systems, microservices, database design (SQL/NoSQL) and indexing, REST/gRPC/GraphQL API contracts, concurrency, caching strategies, data consistency, security, and scalability.",
            "Full-Stack Engineer": "Focus on end-to-end architecture, API design, seamless frontend-to-backend data flow, database querying, state sync, security/auth, and full-stack performance trade-offs.",
            "Data Structures & Algorithms": "Focus on algorithmic complexity (Big-O time and space), optimal data structures (trees, graphs, heaps, dynamic programming, two pointers), edge cases, algorithm paradigms, and code optimization trade-offs."
        };

        const levelGuidelines: Record<string, string> = {
            "Junior (0-2 yrs)": "Evaluate foundational concepts, syntax understanding, and clear problem-solving logic. Maintain a supportive, constructive coaching tone. Ask direct questions probing core concepts.",
            "Mid-Level (2-5 yrs)": "Evaluate practical production experience, edge cases, error handling, clean abstractions, standard design patterns, and performance considerations. Expect solid real-world rationale.",
            "Senior (5+ yrs)": "Evaluate high-level architectural design, scalability bottlenecks, trade-offs, concurrency/resilience, failure modes, cost/complexity trade-offs, and leadership perspective. Evaluate strictly with deep, challenging follow-ups."
        };

        const selectedRoleGuideline = roleGuidelines[role] || roleGuidelines["Full-Stack Engineer"];
        const selectedLevelGuideline = levelGuidelines[level] || levelGuidelines["Mid-Level (2-5 yrs)"];

        const systemPrompt = `
      You are an elite, professional Technical Lead and Interviewer conducting a live mock technical interview for a "${role}" position at the "${level}" experience level.
      
      ROLE SPECIFIC EMPHASIS:
      ${selectedRoleGuideline}

      EXPERIENCE LEVEL CALIBRATION:
      ${selectedLevelGuideline}

      Candidate's Spoken Answer: "${transcript}"
      Candidate's Vision Metrics: Emotion Detected = "${emotion}", Composure Rating = ${confidenceScore}%.

      Evaluation Instructions:
      1. Analyze the candidate's answer strictly against the standards expected for a ${level} ${role}.
      2. In "feedback", write 1-2 concise, impactful sentences assessing technical depth, clarity, and specific nuances related to ${role}.
      3. In "score", provide a fair integer from 0 to 100 calibrated for the ${level} expectations.
      4. In "followUpQuestion", formulate a sharp, direct technical follow-up question that drills deeper into the specific ${role} concepts or architecture they discussed.

      Provide a structured response in valid JSON format ONLY with these exact keys:
      {
        "feedback": "1-2 concise sentences analyzing the candidate's answer quality and technical depth.",
        "score": 85,
        "followUpQuestion": "A sharp, direct follow-up technical question based on what they just said."
      }
    `;

        const candidateModels = ["gemini-3.6-flash", "gemini-3.5-flash-lite", "gemini-3.8-flash"];
        let resultText: string | null = null;
        let lastError: Error | null = null;

        for (const modelName of candidateModels) {
            try {
                const response = await ai.models.generateContent({
                    model: modelName,
                    contents: systemPrompt,
                    config: {
                        responseMimeType: "application/json",
                    },
                });

                if (response.text) {
                    resultText = response.text;
                    break;
                }
            } catch (err) {
                lastError = err instanceof Error ? err : new Error(String(err));
                console.warn(`Model ${modelName} failed or unavailable (503/high demand), trying next fallback...`, lastError.message);
            }
        }

        if (!resultText) {
            throw lastError || new Error("All Gemini models are currently experiencing high demand. Please try again in a few seconds.");
        }

        const parsedData = JSON.parse(resultText);
        return NextResponse.json(parsedData);
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        console.error("LLM Interviewer Error:", errorMessage);
        return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
}
