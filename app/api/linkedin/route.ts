import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(req: Request) {
    try {
        const body = await req.json().catch(() => ({}));
        const { profileText, targetRole = "Full-Stack Software Engineer" } = body;

        if (!profileText || typeof profileText !== "string" || !profileText.trim()) {
            return NextResponse.json(
                { error: "Please provide LinkedIn profile details or summary text for analysis." },
                { status: 400 }
            );
        }

        const systemPrompt = `
      You are a World-Class Executive Tech Recruiter and LinkedIn Profile Specialist.
      Critique and optimize the candidate's LinkedIn profile for maximum inbound recruiter visibility and search indexing for a "${targetRole}" position.

      Candidate LinkedIn Profile Content:
      """
      ${profileText}
      """

      Target Role: "${targetRole}"

      Provide a comprehensive, high-converting LinkedIn profile critique strictly in valid JSON format matching this exact schema:
      {
        "profileScore": 84,
        "ratingBadge": "Top 5% Candidate",
        "headlineSuggestions": [
          "Full-Stack Engineer | React 19, Next.js, Node.js & Distributed Microservices | Building High-Scale Web Apps",
          "Senior Software Engineer | Ex-Tech Lead | Scalable Cloud Architectures & Real-Time AI Systems"
        ],
        "criticalDrawbacks": [
          "Profile headline is overly generic and lacks recruiter search terms.",
          "About section lacks quantified business metrics and tech stack keywords."
        ],
        "missingRecruiterKeywords": [
          "Microservices", "System Design", "AWS / Cloud", "GraphQL", "Performance Optimization"
        ],
        "contentFixes": [
          {
            "section": "Headline",
            "current": "Software Developer looking for opportunities",
            "optimized": "Full-Stack Engineer | React, Next.js, Node.js & Microservices | 50K+ Active Users Scaled",
            "impactReason": "Injects high-intent recruiter search keywords and quantifies engineering impact immediately."
          },
          {
            "section": "About Section Summary",
            "current": "Passionate developer building web applications.",
            "optimized": "Results-driven Full-Stack Engineer with 3+ years of experience architecting high-throughput React/Node.js web applications, reducing latency by 40% and deploying resilient cloud microservices.",
            "impactReason": "Transforms generic passion statement into a metrics-backed elevator pitch for recruiters."
          }
        ]
      }

      Notes:
      - "ratingBadge" MUST be one of: "Top 5% Candidate", "Needs Optimization", or "Incomplete".
      - "profileScore" MUST be an integer from 0 to 100.
      - "headlineSuggestions" should contain 2 to 3 catchy, high-converting LinkedIn headlines.
      - "contentFixes" should provide 2 to 4 section-by-section before-and-after rewrites.
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
                console.warn(`Model ${modelName} failed or busy, trying next fallback...`, lastError.message);
            }
        }

        if (!resultText) {
            throw lastError || new Error("LinkedIn optimization service is busy. Please try again in a few seconds.");
        }

        const parsedData = JSON.parse(resultText);
        return NextResponse.json(parsedData);
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : "Failed to analyze LinkedIn profile.";
        console.error("LinkedIn API Error:", errorMessage);
        return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
}
