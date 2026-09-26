import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { message, history } = body;

        if (!message || typeof message !== "string" || !message.trim()) {
            return NextResponse.json(
                { error: "Message string is required" },
                { status: 400 }
            );
        }

        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            return NextResponse.json(
                { error: "GEMINI_API_KEY environment variable is missing" },
                { status: 500 }
            );
        }

        const ai = new GoogleGenAI({ apiKey });

        const systemInstruction = `You are a Senior Principal System Architect & Technical Mentor at Zenith.
Your goal is to help software engineers, computer science students, and job seekers resolve technical doubts, debug complex production issues, analyze architectural edge cases, and master engineering concepts.

Guidelines:
1. Be extremely clear, direct, and authoritative yet encouraging.
2. Structure your answers with clear Markdown formatting:
   - Use headings (###) for sections (e.g. ### Root Cause Analysis, ### Step-by-step Solution).
   - Use bold text for key concepts.
   - Use triple backtick code blocks with language identifiers (e.g. \`\`\`ts, \`\`\`go, \`\`\`python, \`\`\`sql) for code snippets.
3. Include high-quality, production-ready code examples with inline comments.
4. Highlight performance implications, security best practices, and system scalability trade-offs.`;

        // Format chat history for Gemini API
        const formattedContents = [];

        // Include system instruction in prompt context
        formattedContents.push({
            role: "user",
            parts: [{ text: `[SYSTEM INSTRUCTION]\n${systemInstruction}` }],
        });
        formattedContents.push({
            role: "model",
            parts: [{ text: "Understood. I am online as your Senior Principal System Architect & Tech Mentor. How can I assist you today?" }],
        });

        if (Array.isArray(history)) {
            for (const item of history) {
                if (item.role && Array.isArray(item.parts) && item.parts.length > 0) {
                    formattedContents.push({
                        role: item.role === "user" ? "user" : "model",
                        parts: [{ text: item.parts[0].text }],
                    });
                }
            }
        }

        // Append current user message
        formattedContents.push({
            role: "user",
            parts: [{ text: message.trim() }],
        });

        // Query Gemini 1.5 Flash using exact model string without "models/" prefix
        const response = await ai.models.generateContent({
            model: "gemini-1.5-flash",
            contents: formattedContents,
        });

        const reply = response.text || "I was unable to analyze this request. Please try rephrasing.";

        return NextResponse.json({
            reply,
            response: reply,
        });
    } catch (error: any) {
        console.error("Doubt Solver API error:", error);
        return NextResponse.json(
            { error: error?.message || "Internal server error in Doubt Solver API." },
            { status: 500 }
        );
    }
}
