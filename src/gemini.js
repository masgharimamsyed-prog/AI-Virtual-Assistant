
async function main(prompt, setLoader, speak, setError) {
    try {
        const res = await fetch("/api/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ prompt }),
        });

        const data = await res.json().catch(() => ({}));

        if (!res.ok) {
            throw new Error(data.error || `Request failed (${res.status})`);
        }

        console.log(`Answered by ${data.provider}`);
        console.log(data.reply);

        // Remove citation references before speaking
        const cleanReply = data.reply
            .replace(/\[\d+†[^\]]*\]/g, "")
            .replace(/\s{2,}/g, " ")
            .trim();

        speak(cleanReply);

    } catch (err) {
        console.error(err);
        setError(err.message || "Something went wrong. Please try again.");

        setTimeout(() => setError(""), 4000);
    } finally {
        setLoader(false);
    }
}

export default main;
