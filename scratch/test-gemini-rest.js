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

async function testWorkingModels() {
    const models = ["gemini-flash-latest", "gemini-3.5-flash", "gemini-flash-lite-latest"];

    for (const m of models) {
        try {
            const url = `https://generativelanguage.googleapis.com/v1beta/models/${m}:generateContent?key=${apiKey}`;
            const res = await fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: "Respond with 1 word: WORKING" }] }]
                })
            });

            const data = await res.json();
            if (res.ok) {
                console.log(`✅ SUCCESS WITH ${m}:`, data.candidates[0].content.parts[0].text.trim());
            } else {
                console.log(`❌ FAIL ${m}:`, data.error?.message);
            }
        } catch (err) {
            console.error(err);
        }
    }
}

testWorkingModels();
