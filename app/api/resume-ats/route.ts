import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(req: Request) {
    try {
        const body = await req.json().catch(() => ({}));
        const { resumeText, jobDescription = "" } = body;

        if (!resumeText || typeof resumeText !== "string" || !resumeText.trim()) {
            return NextResponse.json(
                { error: "Please provide resume content for ATS analysis." },
                { status: 400 }
            );
        }

        const systemPrompt = `
      You are an elite Senior Technical Recruiter and Applicant Tracking System (ATS) Expert.
      Analyze the candidate's resume against standard engineering hiring criteria${
          jobDescription ? " and the specific target Job Description provided below" : ""
      }.

      Candidate Resume Text:
      """
      ${resumeText}
      """

      ${
          jobDescription
              ? `Target Job Description:
      """
      ${jobDescription}
      """`
              : ""
      }

      Provide a comprehensive, objective ATS analysis strictly in valid JSON format matching this exact schema:
      {
        "matchScore": 82,
        "atsCompatibility": "High",
        "missingKeywords": ["Docker", "Kubernetes", "GraphQL", "CI/CD Pipeline", "Microservices"],
        "formattingScore": 88,
        "keyStrengths": [
          "Strong quantitative achievements with clear metrics and KPIs.",
          "Solid foundational experience with full-stack technologies."
        ],
        "bulletPointFixes": [
          {
            "original": "Worked on building APIs for the backend web app.",
            "suggested": "Architected 12+ RESTful microservice endpoints processing 50K daily requests using Node.js and Redis.",
            "reason": "Replaced weak passive verb 'worked on' with strong action verb 'Architected' and added quantified scale metrics."
          }
        ]
      }

      Notes:
      - "atsCompatibility" MUST be one of: "High", "Moderate", or "Needs Improvement".
      - "matchScore" MUST be an integer from 0 to 100.
      - "formattingScore" MUST be an integer from 0 to 100 assessing action verb usage, clarity, and structural readability.
      - "bulletPointFixes" should provide 2 to 4 actionable before-and-after bullet rewrites derived from the candidate's resume text.
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
                console.warn(`Model ${modelName} failed, trying next fallback...`, lastError.message);
            }
        }

        if (!resultText) {
            throw lastError || new Error("ATS evaluation service is busy. Please try again in a few seconds.");
        }

        const parsedData = JSON.parse(resultText);
        return NextResponse.json(parsedData);
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : "Failed to analyze resume.";
        console.error("ATS Resume API Error:", errorMessage);
        return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
}
