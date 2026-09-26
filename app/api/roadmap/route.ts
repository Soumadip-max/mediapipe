import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const domain = body.domain || body.interest || "Full-Stack Web Engineering";
        const experienceLevel = body.experienceLevel || body.level || "mid";

        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            return NextResponse.json(
                { error: "GEMINI_API_KEY environment variable is missing" },
                { status: 500 }
            );
        }

        const ai = new GoogleGenAI({ apiKey });

        const prompt = `You are a Senior Principal Technical Architect & Curriculum Author.
Generate a tailored, domain-specific interactive node graph roadmap (roadmap.sh style) specifically customized for an engineer mastering: "${domain}" at the "${experienceLevel}" level.

DYNAMIC PATHWAY INSTRUCTIONS:
1. Dynamically decide the optimal number of sequential progression phases (typically 3 to 6 phases) relevant ONLY to "${domain}".
   - If domain is "Frontend", focus strictly on Frontend primitives, DOM, CSS/Tailwind, React/Next.js, State Management, Build Tooling, and Web Vitals.
   - If domain is "Backend", focus strictly on Language runtimes, API design (REST/gRPC), Databases (SQL/NoSQL), Caching, Security, and Microservices.
   - If domain is "Java", focus strictly on Core Java, JVM internals, Spring Boot, Hibernate/JPA, Microservices, and Testing.
   - If domain is any other topic, adapt phases and topics strictly to that domain.
2. Generate 8 to 16 logical nodes across the phases.
3. Node coordinates:
   - Assign Y-coordinates based on phase progression: Y = phaseIndex * 220 (e.g. Phase 1: Y=0..80, Phase 2: Y=220..300, Phase 3: Y=440..520, Phase 4: Y=660..740, etc.).
   - Assign X-coordinates for parallel topics: X = -260, 0, or 260.
4. Connect the nodes logically with directional edges.

Return ONLY a raw JSON object matching this schema:
{
  "roleTitle": "${domain} Roadmap",
  "overview": "Dynamic tailored learning roadmap for ${domain} (${experienceLevel} level).",
  "nodes": [
    {
      "id": "1",
      "label": "Topic Title",
      "phase": "Phase 1: Phase Name",
      "position": { "x": 0, "y": 0 },
      "type": "main",
      "description": "Clear actionable summary of key trade-offs and domain knowledge.",
      "keyConcepts": "Core concepts separated by commas",
      "notes": "Practical production tips and recommendations",
      "youtubeQuery": "${domain} topic tutorial",
      "status": "learning"
    }
  ],
  "edges": [
    { "id": "e1-2", "source": "1", "target": "2", "animated": true }
  ]
}

Every node must include: id, label, phase, position, type ('main' | 'subtopic' | 'choice'), description, keyConcepts, notes, youtubeQuery, status ('learning' | 'done' | 'skip').
Respond with VALID JSON ONLY. Do not wrap in markdown code blocks or additional prose.`;

        const response = await ai.models.generateContent({
            model: "gemini-1.5-flash",
            contents: prompt,
        });

        const rawText = response.text || "";
        const jsonText = rawText.replace(/```json/g, "").replace(/```/g, "").trim();
        const data = JSON.parse(jsonText);

        return NextResponse.json(data);
    } catch (error: any) {
        console.error("Roadmap API error:", error);
        return NextResponse.json(
            { error: error?.message || "Failed to generate AI roadmap graph. Please try again." },
            { status: 500 }
        );
    }
}


