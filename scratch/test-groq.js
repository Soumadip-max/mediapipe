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

const groqKey = envVars.GROQ_API_KEY;

async function testGroq() {
    const models = ["llama-3.1-8b-instant", "llama-3.2-3b-preview", "mixtral-8x7b-32768"];
    for (const m of models) {
        try {
            const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${groqKey}`
                },
                body: JSON.stringify({
                    model: m,
                    messages: [{ role: "user", content: "Hello" }]
                })
            });

            const data = await res.json();
            if (res.ok) {
                console.log(`🎉 GROQ SUCCESS with ${m}:`, data.choices[0].message.content);
                return;
            } else {
                console.log(`Groq ${m} failed:`, data.error?.message);
            }
        } catch (err) {
            console.error("Groq error:", err);
        }
    }
}

testGroq();
