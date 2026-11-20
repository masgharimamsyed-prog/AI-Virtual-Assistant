const api_key = import.meta.env.VITE_GEMINI_API_KEY;

import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
    apiKey: api_key,
});

const tools = [
    {
        type: "google_search",
    },
];

const generationConfig = {
    max_output_tokens: 65536,
    thinking_level: "high",
};

async function main(prompt, setLoader, speak, setError) {
    try {
        console.log(prompt);
        const interaction = await ai.interactions.create({
            model: "models/gemini-4-hydrogen",
            input: prompt,
            tools: tools,
            generation_config: generationConfig,
        });

        console.log(interaction.steps?.at(-1));
        speak(interaction.steps?.at(-1));

    } catch (error) {
        setError(error.message);

        setTimeout(() => {
            setError("");
        }, 3000);

    } finally {
        setLoader(false);
    }
}

export default main;
