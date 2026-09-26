import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

interface ChatHistoryMessage {
    role: "user" | "model";
    parts: Array<{ text: string }>;
}

export async function POST(req: Request) {
    try {
        const body = await req.json().catch(() => ({}));
        const { message, history = [] } = body;

        if (!message || typeof message !== "string" || !message.trim()) {
            return NextResponse.json(
                { error: "Please provide a valid technical question or message." },
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

        const systemInstruction = `
      You are an elite Senior Staff Engineer, Principal System Architect, and Technical Mentor.
      Your goal is to provide clear, high-yield, step-by-step answers to technical software engineering questions, code debugging queries, and architectural trade-offs.

      Instructions:
      - Always structure your responses using clean GitHub Flavored Markdown.
      - Use fenced code blocks with language identifiers (e.g. \`\`\`typescript, \`\`\`sql, \`\`\`python) for code snippets.
      - Provide practical real-world production advice, trade-offs, and performance tips.
      - Maintain an encouraging, articulate, and technical mentor tone.
    `;

        // Formulate chat context with conversation history
        const formattedContents = [
            {
                role: "user" as const,
                parts: [{ text: systemInstruction }],
            },
            {
                role: "model" as const,
                parts: [{ text: "Understood. I am ready to act as your Senior Technical Mentor and answer any engineering or debugging questions." }],
            },
        ];

        if (Array.isArray(history) && history.length > 0) {
            for (const item of history) {
                if (item.role && Array.isArray(item.parts) && item.parts[0]?.text) {
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

        // Append user's latest query
        formattedContents.push({
            role: "user" as const,
            parts: [{ text: message }],
        });

        const candidateModels = ["gemini-flash-lite-latest", "gemini-3.5-flash-lite", "gemini-3.5-flash", "gemini-3.8-flash"];
        let replyText: string | null = null;
        let lastError: Error | null = null;

        for (const modelName of candidateModels) {
            for (let attempt = 1; attempt <= 3; attempt++) {
                try {
                    const response = await ai.models.generateContent({
                        model: modelName,
                        contents: formattedContents,
                    });

                    if (response.text) {
                        replyText = response.text;
                        break;
                    }
                } catch (err) {
                    lastError = err instanceof Error ? err : new Error(String(err));
                    console.warn(`Model ${modelName} (attempt ${attempt}) failed or busy, retrying...`, lastError.message);
                    if (attempt < 3) await new Promise((r) => setTimeout(r, 400));
                }
            }
            if (replyText) break;
        }

        if (!replyText) {
            throw lastError || new Error("Technical mentor service is busy. Please try again in a few seconds.");
        }

        return NextResponse.json({ reply: replyText });
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : "Failed to solve technical doubt.";
        console.error("Doubt Solver API Error:", errorMessage);
        return NextResponse.json({ error: errorMessage }, { status: 500 });
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
