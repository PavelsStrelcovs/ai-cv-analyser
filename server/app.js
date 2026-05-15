import crypto from "node:crypto";
import cors from "cors";
import express from "express";
import multer from "multer";
import OpenAI from "openai";
import pdfParse from "pdf-parse";

const CV_TEXT_LIMIT = 10000;
const CACHE_TTL_MS = 1000 * 60 * 30;
const RATE_LIMIT_WINDOW_MS = 1000 * 60 * 60;
const RATE_LIMIT_MAX = 8;
const analysisCache = new Map();
const rateLimitStore = new Map();

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

app.post("/api/analyse", rateLimit, upload.single("cv"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "Upload a PDF CV to analyse." });
    }

    const parsedPdf = await extractPdfText(req.file.buffer);
    const cvText = prepareCvText(parsedPdf.text);

    if (!cvText) {
      return res.status(400).json({
        error: "No readable CV text was found. Try a text-based PDF rather than a scanned image."
      });
    }

    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({
        error: "OPENAI_API_KEY is missing. Add it to your .env file before running AI analysis."
      });
    }

    const cacheKey = hashText(cvText);
    const cached = getCachedAnalysis(cacheKey);
    const analysis = cached || await analyseCvWithOpenAI(new OpenAI({ apiKey: process.env.OPENAI_API_KEY }), cvText);

    if (!cached) {
      setCachedAnalysis(cacheKey, analysis);
    }

    res.json({
      fileName: req.file.originalname,
      wordCount: cvText.split(/\s+/).filter(Boolean).length,
      extractedTextPreview: cvText.slice(0, 700),
      cached: Boolean(cached),
      analysis
    });
  } catch (error) {
    console.error(error);
    res.status(statusForError(error)).json({ error: messageForError(error) });
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

export async function extractPdfText(buffer) {
  try {
    return await pdfParse(buffer);
  } catch {
    const error = new Error("Invalid PDF. Please upload a readable PDF file.");
    error.status = 400;
    throw error;
  }
}

export function cleanText(text) {
  return String(text || "")
    .replace(/\u0000/g, "")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

export function prepareCvText(text) {
  // Cost saving: normalize whitespace and cap the CV before sending it to OpenAI.
  return cleanText(text).slice(0, CV_TEXT_LIMIT).trim();
}

async function analyseCvWithOpenAI(client, cvText) {
  // Cost saving: short prompt, cheap default model, JSON-only response and bounded output.
  const prompt = `You are an ATS CV reviewer. Analyze the CV below.

Return JSON only:
{
  "atsScore": number,
  "strengths": string[],
  "weaknesses": string[],
  "missingKeywords": string[],
  "suggestions": string[]
}

CV:
${cvText}`;

  const response = await client.chat.completions.create({
    model: process.env.OPENAI_MODEL || "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
    response_format: { type: "json_object" },
    max_tokens: 650
  });

  const content = response.choices?.[0]?.message?.content || "";
  return parseJsonAnalysis(content);
}

export function parseJsonAnalysis(content) {
  const jsonText = content.match(/\{[\s\S]*\}/)?.[0];
  if (!jsonText) {
    throw new Error("The AI response did not contain valid JSON.");
  }

  const parsed = JSON.parse(jsonText);
  validateAnalysisShape(parsed);
  return {
    atsScore: clampScore(parsed.atsScore),
    strengths: normalizeList(parsed.strengths),
    weaknesses: normalizeList(parsed.weaknesses),
    missingKeywords: normalizeList(parsed.missingKeywords),
    suggestions: normalizeList(parsed.suggestions)
  };
}

export function normalizeList(value) {
  return Array.isArray(value) ? value.map(String).filter(Boolean).slice(0, 8) : [];
}

export function clampScore(value) {
  const number = Number(value);
  if (!Number.isFinite(number)) return 0;
  return Math.max(0, Math.min(100, Math.round(number)));
}

function hashText(text) {
  return crypto.createHash("sha256").update(text).digest("hex");
}

function getCachedAnalysis(key) {
  const cached = analysisCache.get(key);
  if (!cached) return null;
  if (Date.now() - cached.createdAt > CACHE_TTL_MS) {
    analysisCache.delete(key);
    return null;
  }
  return cached.analysis;
}

function setCachedAnalysis(key, analysis) {
  analysisCache.set(key, { analysis, createdAt: Date.now() });
}

function rateLimit(req, res, next) {
  const key = req.ip || req.socket.remoteAddress || "unknown";
  const now = Date.now();
  const current = rateLimitStore.get(key) || { count: 0, resetAt: now + RATE_LIMIT_WINDOW_MS };

  if (now > current.resetAt) {
    rateLimitStore.set(key, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    next();
    return;
  }

  if (current.count >= RATE_LIMIT_MAX) {
    res.status(429).json({ error: "Too many analyses from this browser. Please try again later." });
    return;
  }

  current.count += 1;
  rateLimitStore.set(key, current);
  next();
}

function validateAnalysisShape(value) {
  const requiredArrays = ["strengths", "weaknesses", "missingKeywords", "suggestions"];
  if (!Number.isFinite(Number(value.atsScore))) {
    throw new Error("The AI response did not include a valid ATS score.");
  }
  for (const key of requiredArrays) {
    if (!Array.isArray(value[key])) {
      throw new Error(`The AI response did not include a valid ${key} list.`);
    }
  }
}

function statusForError(error) {
  if (error.status === 429 || error.code === "rate_limit_exceeded") return 429;
  if (error.status) return error.status;
  return 500;
}

function messageForError(error) {
  if (error.status === 429 || error.code === "rate_limit_exceeded") {
    return "OpenAI rate limit reached. Please wait a moment and try again.";
  }
  return error.message || "Something went wrong while analysing the CV.";
}
