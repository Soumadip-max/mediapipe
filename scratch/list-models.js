const fs = require("fs");
const path = require("path");

const envFile = fs.readFileSync(path.join(__dirname, "../.env.local"), "utf8");
const envVars = {};
envFile.split("\n").forEach((line) => {
    const parts = line.split("=");
    if (parts.length >= 2) {
        envVars[parts[0].trim()] = parts.slice(1).join("=").trim();
    }
});

const apiKey = envVars.GEMINI_API_KEY;

async function listModels() {
    try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
        const res = await fetch(url);
        const data = await res.json();
        console.log("Status:", res.status);
        if (data.models) {
            console.log("AVAILABLE MODELS:");
            data.models.forEach((m) => {
                if (m.supportedGenerationMethods && m.supportedGenerationMethods.includes("generateContent")) {
                    console.log(" -", m.name.replace("models/", ""));
                }
            });
        } else {
            console.log("No models returned:", data);
        }
    } catch (err) {
        console.error("List models error:", err);
    }
}

listModels();
