import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(req: Request) {
    try {
        const body = await req.json().catch(() => ({}));
        const { interest = "Full-Stack Development", level = "Mid-Level (2-5 yrs)" } = body;

        if (!interest || typeof interest !== "string") {
            return NextResponse.json({ error: "Please provide a valid career interest or domain." }, { status: 400 });
        }

        const systemPrompt = `
      You are an expert Principal Engineer and Tech Curriculum Architect.
      Create a comprehensive, structured, step-by-step Learning Roadmap for a candidate interested in "${interest}" at the "${level}" experience level.

      Evaluation Guidelines:
      - Design 3 to 4 sequential learning phases (e.g., Phase 1: Foundations, Phase 2: Advanced Architecture, Phase 3: Systems & Production).
      - Each phase must contain 2 to 4 detailed topics.
      - For each topic, provide concise study notes, key concepts, and a high-yield YouTube search query.

      Respond ONLY with valid JSON matching this exact structure:
      {
        "roleTitle": "Title of the Career Roadmap",
        "overview": "2-3 sentences summarizing the strategic focus and learning goals of this roadmap.",
        "phases": [
          {
            "phaseName": "Phase 1: Foundational Mastery",
            "weeks": "Weeks 1-3",
            "topics": [
              {
                "title": "Topic Title",
                "description": "Clear 1-2 sentence topic summary.",
                "keyConcepts": ["Concept 1", "Concept 2", "Concept 3"],
                "youtubeSearchQuery": "Exact search term for YouTube tutorials",
                "notes": "Practical architectural study notes or tip for this topic."
              }
            ]
          }
        ]
      }
    `;

        const candidateModels = ["gemini-flash-lite-latest", "gemini-3.5-flash-lite", "gemini-3.5-flash", "gemini-3.8-flash"];
        let resultText: string | null = null;
        let lastError: Error | null = null;

        for (const modelName of candidateModels) {
            for (let attempt = 1; attempt <= 3; attempt++) {
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
                    console.warn(`Model ${modelName} (attempt ${attempt}) failed or busy, retrying...`, lastError.message);
                    if (attempt < 3) await new Promise((r) => setTimeout(r, 400));
                }
            }
            if (resultText) break;
        }

        if (!resultText) {
            throw lastError || new Error("AI service is currently busy. Please try generating again in a few seconds.");
        }

        const parsedData = JSON.parse(resultText);
        return NextResponse.json(parsedData);
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : "Failed to generate learning roadmap.";
        console.error("Roadmap Generator API Error:", errorMessage);
        return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
}
