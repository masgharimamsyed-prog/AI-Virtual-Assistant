import { createContext } from "react";
import { useState } from "react";
import main from '../gemini';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {

    const [listening, setListening] = useState(false);
    const [speaking, setSpeaking] = useState(false);
    const [loaderstate, setLoader] = useState(false);
    const [aispeaking, setAiSpeaking] = useState(false);
    const [error, setError] = useState("");

    function speak(text) {
        window.speechSynthesis.cancel();

        const text_speak = new SpeechSynthesisUtterance(text);
        text_speak.volume = 1;
        text_speak.rate = 1;
        text_speak.pitch = 1;
        text_speak.lang = "en-US";
        text_speak.onstart = () => setAiSpeaking(true);
        text_speak.onend = () => setAiSpeaking(false);
        text_speak.onerror = () => setAiSpeaking(false);
        window.speechSynthesis.speak(text_speak);
    }

    async function Aiprompting(prompt) {
        await main(prompt, setLoader,speak,setError);
    }

    let speechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    let recognition = new speechRecognition();
    recognition.onresult = (e) => {
        setListening(false);
        setLoader(true);
        Aiprompting(e.results[0][0].transcript);
    };


    const value = {
        listening,
        setListening,
        speak,
        speaking,
        setSpeaking,
        recognition,
        loaderstate,
        setLoader,
        aispeaking,
        error, 
        setError

    }

    return (
        <UserContext.Provider value={value}>
            {children}
        </UserContext.Provider>
    );
};