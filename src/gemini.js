// The browser only talks to our own /api/chat function.
// The API keys and the Groq/Gemini fallback logic live in api/chat.js (server side).

async function main(prompt, setLoader, speak, setError) {
    try {
        const res = await fetch("/api/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ prompt }),
        });

        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data.error || `Request failed (${res.status})`);

        console.log(`Answered by ${data.provider}`);
        speak(data.reply);
    } catch (err) {
        console.error(err);
        setError(err.message || "Something went wrong. Please try again.");
        setTimeout(() => setError(""), 4000);
    } finally {
        setLoader(false);
    }
}

export default main;
