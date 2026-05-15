import cors from "cors";
import express from "express";
import multer from "multer";
import OpenAI from "openai";
import pdfParse from "pdf-parse";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 6 * 1024 * 1024
  },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype !== "application/pdf") {
      cb(new Error("Only PDF files are supported."));
      return;
    }
    cb(null, true);
  }
});

export const app = express();

app.use(cors());
app.use(express.json({ limit: "1mb" }));

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, service: "ResumeIQ API" });
});

app.post("/api/analyse", upload.single("cv"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "Upload a PDF CV to analyse." });
    }

    const parsedPdf = await pdfParse(req.file.buffer);
    const cvText = cleanText(parsedPdf.text);
    const jobDescription = cleanText(req.body.jobDescription || "");

    if (cvText.length < 300) {
      return res.status(400).json({
        error: "The PDF text is too short to analyse. Try a text-based CV rather than a scanned image."
      });
    }

    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({
        error: "OPENAI_API_KEY is missing. Add it to your .env file before running AI analysis."
      });
    }

    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const analysis = await analyseCvWithOpenAI(client, cvText, jobDescription);

    res.json({
      fileName: req.file.originalname,
      wordCount: cvText.split(/\s+/).filter(Boolean).length,
      extractedTextPreview: cvText.slice(0, 700),
      analysis
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: error.message || "Something went wrong while analysing the CV."
    });
  }
});

app.use((error, _req, res, _next) => {
  if (error instanceof multer.MulterError) {
    return res.status(400).json({ error: error.message });
  }

  if (error.message === "Only PDF files are supported.") {
    return res.status(400).json({ error: error.message });
  }

  res.status(500).json({ error: error.message || "Unexpected server error." });
});

function cleanText(text) {
  return String(text || "")
    .replace(/\u0000/g, "")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

async function analyseCvWithOpenAI(client, cvText, jobDescription) {
  const prompt = `You are ResumeIQ, an expert graduate CV and ATS reviewer.

Analyse the CV text below${jobDescription ? " against the target job description" : ""}.

Return strict JSON only, with this exact shape:
{
  "score": number,
  "atsScore": number,
  "summary": string,
  "strengths": string[],
  "weaknesses": string[],
  "missingSkills": string[],
  "suggestedImprovements": string[]
}

Rules:
- Scores must be integers from 0 to 100.
- Give practical, specific feedback suitable for a graduate portfolio project.
- Mention ATS structure, measurable achievements, keywords, clarity and relevance.
- Do not invent experience that is not in the CV.

CV:
${cvText.slice(0, 14000)}

${jobDescription ? `Target job description:\n${jobDescription.slice(0, 5000)}` : ""}`;

  const response = await client.responses.create({
    model: process.env.OPENAI_MODEL || "gpt-4.1-mini",
    input: prompt
  });

  const content = response.output_text || extractTextFromResponse(response);
  return parseJsonAnalysis(content);
}

function extractTextFromResponse(response) {
  return (response.output || [])
    .flatMap(item => item.content || [])
    .map(part => part.text || "")
    .join("\n")
    .trim();
}

function parseJsonAnalysis(content) {
  const jsonText = content.match(/\{[\s\S]*\}/)?.[0];
  if (!jsonText) {
    throw new Error("The AI response did not contain valid JSON.");
  }

  const parsed = JSON.parse(jsonText);
  return {
    score: clampScore(parsed.score),
    atsScore: clampScore(parsed.atsScore),
    summary: String(parsed.summary || "Analysis complete."),
    strengths: normalizeList(parsed.strengths),
    weaknesses: normalizeList(parsed.weaknesses),
    missingSkills: normalizeList(parsed.missingSkills),
    suggestedImprovements: normalizeList(parsed.suggestedImprovements)
  };
}

function normalizeList(value) {
  return Array.isArray(value) ? value.map(String).filter(Boolean).slice(0, 8) : [];
}

function clampScore(value) {
  const number = Number(value);
  if (!Number.isFinite(number)) return 0;
  return Math.max(0, Math.min(100, Math.round(number)));
}
