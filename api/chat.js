// Server-side function: the API keys live here and never reach the browser.
// Works on Vercel (as /api/chat) and in local `npm run dev` (see vite.config.js).
import { GoogleGenAI } from "@google/genai";

const env = (name) => process.env[name] || process.env[`VITE_${name}`] || "";

const MAX_PROMPT_LENGTH = 500;

// ---------- Groq ----------
const GROQ_MODELS = [env("GROQ_MODEL") || "openai/gpt-oss-120b", "openai/gpt-oss-20b"];

function buildSystemPrompt() {
    const today = new Date().toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
    });
    return (
        "You are Agha AI, a friendly voice assistant. Today's date is " + today + ". " +
        "Your training data is old, so for anything about recent events, news, prices, " +
        "scores, weather, or who currently holds a position, search the web and answer " +
        "from what you find instead of from memory. " +
        "Reply in plain spoken English, short and clear (1-4 sentences). " +
        "Do not use markdown, bullet points, or emojis."
    );
}

// Questions like these force a web search
const NEEDS_SEARCH =
    /\b(latest|news|today|tonight|yesterday|current|currently|now|recent|recently|this (week|month|year)|20(2[4-9]|3\d)|who is|who won|price|score|weather|trending|update|release[sd]?)\b/i;

async function callGroq(prompt, model) {
    const key = env("GROQ_API_KEY");
    if (!key) throw new Error("Groq API key missing");

    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${key}`,
        },
        body: JSON.stringify({
            model,
            messages: [
                { role: "system", content: buildSystemPrompt() },
                { role: "user", content: prompt },
            ],
            temperature: 0.7,
            ...(model.startsWith("openai/gpt-oss")
                ? {
                      reasoning_effort: "low",
                      tools: [{ type: "browser_search" }],
                      tool_choice: NEEDS_SEARCH.test(prompt) ? "required" : "auto",
                  }
                : {}),
            max_tokens: 1024,
        }),
    });

    if (!res.ok) {
        const body = await res.text().catch(() => "");
        throw new Error(`error ${res.status}: ${body.slice(0, 150)}`);
    }

    const data = await res.json();
    const text = data?.choices?.[0]?.message?.content?.trim();
    if (!text) throw new Error("empty reply");
    return text;
}

// ---------- Gemini ----------
const GEMINI_KEYS = () =>
    env("GEMINI_API_KEY")
        .split(",")
        .map((k) => k.trim())
        .filter(Boolean);

function extractText(step) {
    if (!step) return "";
    if (typeof step === "string") return step;
    if (typeof step.text === "string") return step.text;
    if (Array.isArray(step.content)) {
        return step.content
            .map((c) => (typeof c === "string" ? c : c?.text || ""))
            .join(" ")
            .trim();
    }
    if (typeof step.content === "string") return step.content;
    return "";
}

async function callGemini(prompt, apiKey) {
    const ai = new GoogleGenAI({ apiKey });
    const interaction = await ai.interactions.create({
        model: "models/gemini-4-hydrogen",
        input: prompt,
        tools: [{ type: "google_search" }],
        generation_config: {
            max_output_tokens: 65536,
            thinking_level: "high",
        },
    });

    const text = extractText(interaction.steps?.at(-1)).trim();
    if (!text) throw new Error("empty reply");
    return text;
}

// ---------- Fallback chain: Groq (2 models) -> Gemini key 1 -> Gemini key 2 ----------
function buildProviders() {
    return [
        ...GROQ_MODELS.map((model) => ({
            name: `Groq ${model}`,
            call: (prompt) => callGroq(prompt, model),
        })),
        ...GEMINI_KEYS().map((key, i) => ({
            name: `Gemini (key ${i + 1})`,
            call: (prompt) => callGemini(prompt, key),
        })),
    ];
}

// ---------- HTTP handler ----------
export default async function handler(req, res) {
    if (req.method !== "POST") {
        res.setHeader("Allow", "POST");
        return res.status(405).json({ error: "Use POST" });
    }

    // Only allow requests coming from this same website
    const origin = req.headers.origin;
    if (origin && new URL(origin).host !== req.headers.host) {
        return res.status(403).json({ error: "Not allowed" });
    }

    const prompt = typeof req.body?.prompt === "string" ? req.body.prompt.trim() : "";
    if (!prompt) return res.status(400).json({ error: "Empty question" });
    if (prompt.length > MAX_PROMPT_LENGTH) {
        return res.status(400).json({ error: "Question is too long" });
    }

    const failures = [];
    for (const provider of buildProviders()) {
        try {
            const reply = await provider.call(prompt);
            return res.status(200).json({ reply, provider: provider.name });
        } catch (err) {
            failures.push(`${provider.name}: ${err.message}`);
        }
    }

    console.error("All providers failed:\n" + failures.join("\n"));
    return res.status(502).json({
        error: "All AI services are unavailable right now. Please try again.",
    });
}
