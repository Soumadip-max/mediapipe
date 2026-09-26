const fs = require("fs");
const path = require("path");
const { GoogleGenAI } = require("@google/genai");

const envFile = fs.readFileSync(path.join(__dirname, "../.env.local"), "utf8");
const envVars = {};
envFile.split("\n").forEach((line) => {
    const parts = line.split("=");
    if (parts.length >= 2) {
        envVars[parts[0].trim()] = parts.slice(1).join("=").trim();
    }
});

const apiKey = envVars.GEMINI_API_KEY;
console.log("Testing key:", apiKey);

const ai = new GoogleGenAI({ apiKey });

async function generateWithFallback(contents) {
    const candidateModels = [
        "gemini-3.8-flash",
        "gemini-3.5-flash",
        "gemini-3.1-pro-preview"
    ];

    let lastErr = null;
    for (const modelName of candidateModels) {
        // Try up to 2 times for 503 transient errors
        for (let attempt = 1; attempt <= 2; attempt++) {
            try {
                console.log(`Trying ${modelName} (attempt ${attempt})...`);
                const response = await ai.models.generateContent({
                    model: modelName,
                    contents: contents,
                });
                if (response.text) {
                    console.log(`SUCCESS with ${modelName}:`, response.text.substring(0, 100));
                    return response.text;
                }
            } catch (err) {
                lastErr = err;
                console.log(`Attempt ${attempt} for ${modelName} failed:`, err.message || err);
                if (attempt === 1) await new Promise((r) => setTimeout(r, 1000));
            }
        }
    }
    throw lastErr;
}

generateWithFallback("Explain CORS briefly").catch(console.error);
