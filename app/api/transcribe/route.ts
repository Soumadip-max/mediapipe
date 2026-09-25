import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const formData = await req.formData();
        const audioFile = formData.get("file") as Blob;

        if (!audioFile) {
            return NextResponse.json({ error: "No audio file provided" }, { status: 400 });
        }

        const groqFormData = new FormData();
        groqFormData.append("file", audioFile, "recording.webm");
        groqFormData.append("model", "whisper-large-v3");

        const response = await fetch("https://api.groq.com/openai/v1/audio/transcriptions", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
            },
            body: groqFormData,
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error?.message || "Failed to transcribe audio");
        }

        return NextResponse.json({ transcript: data.text });
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : "Unknown server error";
        console.error("Transcription Error:", errorMessage);
        return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
}