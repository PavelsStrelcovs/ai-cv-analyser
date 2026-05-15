# ResumeIQ - AI CV Analyser

ResumeIQ is a full-stack MVP for analysing graduate CVs.

## Features

- Drag-and-drop PDF CV upload
- PDF text extraction with `pdf-parse`
- AI analysis through the OpenAI API
- ATS score, overall score, strengths, weaknesses, missing skills and suggested improvements
- React + Tailwind frontend
- Node.js + Express backend

## Setup

```bash
npm install
cp .env.example .env
```

Add your OpenAI API key to `.env`:

```bash
OPENAI_API_KEY=your_key_here
```

Run the app:

```bash
npm run dev
```

Frontend: `http://localhost:5173`

Backend: `http://localhost:5000`

## Deploy to Vercel

This project includes Vercel API wrappers in `api/analyse.js` and `api/health.js`, both reusing the Express app from `server/app.js`.

Set `OPENAI_API_KEY` and `OPENAI_MODEL` in your Vercel project environment variables, then deploy the repository.
