
# AI Virtual Assistant

An AI-powered voice assistant built with React.js and Google's Gemini API. It allows users to interact with an AI assistant through voice commands, convert speech into text, and receive AI-generated responses through speech synthesis.

## Overview

This project explores the integration of Artificial Intelligence and voice-based interaction in a modern React application. It combines speech recognition, text-to-speech, and Google's Gemini API to create an interactive virtual assistant.

## Features

- **Voice Recognition:** Capture user commands through the microphone.
- **Speech-to-Text:** Convert spoken input into readable text.
- **AI-Powered Responses:** Generate intelligent responses using Google Gemini.
- **Text-to-Speech:** Convert AI responses into spoken audio.
- **Google Search Integration:** Enable search capabilities through Gemini tools.
- **Loading Indicators:** Provide feedback while processing requests.
- **Error Handling:** Display API and application errors on the interface.

## Tech Stack

| Technology | Purpose |
|---|---|
| React.js | User interface |
| JavaScript | Application logic |
| CSS | Styling |
| Vite | Development environment |
| Google Gemini API | AI response generation |
| Web Speech API | Voice recognition and speech synthesis |
| React Icons | UI icons |
| React Loader Spinner | Loading indicators |

## Project Structure

```text
AI-Virtual-Assistant/
│
├── public/
├── src/
│   ├── assets/
│   ├── components/
│   ├── context/
│   ├── App.jsx
│   ├── App.css
│   ├── gemini.js
│   └── main.jsx
│
├── .env
├── .gitignore
├── index.html
├── package.json
└── README.md

```

add-groq-gemini-fallback
**2. Navigate to the project directory**

```bash
cd AI-Virtual-Assistant
```

**3. Install dependencies**

```bash
npm install
```

**4. Configure environment variables**

Create a `.env` file in the root directory (copy `.env.example`):

Answers are tried in order: Groq (two models), then Gemini key 1, then Gemini key 2. The keys are only used by the server function in `api/chat.js`, so they are never sent to the browser.

**5. Start the development server**

```bash
npm run dev
```

Open the local URL provided by Vite in your browser.

## Environment Variables

| Variable | Description |
|---|---|
| GROQ_API_KEY | Groq API key |
| GEMINI_API_KEY | One or more Gemini keys, comma-separated |
| GROQ_MODEL | Optional: Groq model to try first |

## Deploying to Vercel

1. Push the project to GitHub (never upload `.env`).
2. Import the repo on [vercel.com](https://vercel.com).
3. Under Settings, Environment Variables, add `GROQ_API_KEY` and `GEMINI_API_KEY`.
4. Deploy. The `api/chat.js` function runs on the server and keeps the keys private.

## Browser Compatibility

Voice recognition and speech synthesis depend on browser support. Allow microphone access when prompted.


main
## Future Improvements

- [ ] Support for multiple languages.
- [ ] Additional voice and speech options.
- [ ] Conversational context and memory.
- [ ] Improved responsive design.
- [ ] Backend integration for secure API handling.
- [ ] Customizable assistant settings.

## Author

**Asghar Imam Syed**

Computer Science Student | Frontend Developer

- GitHub: [@masgharimamsyed-prog](https://github.com/masgharimamsyed-prog)
- LinkedIn: [Asghar Imam](https://www.linkedin.com/in/asghar-imam/)

---

If you find this project useful or interesting, consider giving it a star.
