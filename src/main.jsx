import React, { useEffect, useMemo, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import { AlertCircle, Loader2, Sparkles } from "lucide-react";
import { HistoryPanel } from "./components/HistoryPanel";
import { Results } from "./components/Results";
import { TemplatesPage } from "./components/TemplatesPage";
import { UploadPanel } from "./components/UploadPanel";
import { buildReviewSummary, HISTORY_KEY, loadReviewHistory } from "./utils/history";
import { calculateLocalJobMatch } from "./utils/jobMatch";
import "./styles.css";

const emptyAnalysis = {
  atsScore: 0,
  strengths: [],
  weaknesses: [],
  missingKeywords: [],
  suggestions: []
};

function App() {
  const [activeView, setActiveView] = useState("analyser");
  const [file, setFile] = useState(null);
  const [jobDescription, setJobDescription] = useState("");
  const [analysis, setAnalysis] = useState(emptyAnalysis);
  const [meta, setMeta] = useState(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [history, setHistory] = useState(() => loadReviewHistory());
  const inputRef = useRef(null);

  const canAnalyse = Boolean(file) && !isLoading;
  const localMatch = useMemo(() => {
    if (!meta) return null;
    return calculateLocalJobMatch(meta.preview, jobDescription, analysis.missingKeywords);
  }, [analysis.missingKeywords, jobDescription, meta]);

  const matchLabel = useMemo(() => {
    if (!localMatch) return "Paste a job advert for free local matching";
    if (!localMatch.missingKeywords.length) return "Keyword coverage looks healthy";
    return `${localMatch.missingKeywords.length} likely gap${localMatch.missingKeywords.length === 1 ? "" : "s"} found locally`;
  }, [localMatch]);

  const progressDelta = useMemo(() => {
    if (!meta || history.length < 2) return null;
    return history[0].atsScore - history[1].atsScore;
  }, [history, meta]);

  useEffect(() => {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  }, [history]);

  function selectFile(nextFile) {
    setError("");
    setAnalysis(emptyAnalysis);
    setMeta(null);

    if (!nextFile) return;
    if (nextFile.type !== "application/pdf") {
      setError("Please upload a PDF CV.");
      return;
    }

    setFile(nextFile);
  }

  async function analyseCv() {
    if (!file) return;

    setIsLoading(true);
    setError("");

    const formData = new FormData();
    formData.append("cv", file);
    formData.append("jobDescription", jobDescription);

    try {
      const response = await fetch("/api/analyse", {
        method: "POST",
        body: formData
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Could not analyse this CV.");
      }

      setAnalysis(data.analysis);
      const nextMeta = {
        fileName: data.fileName,
        wordCount: data.wordCount,
        preview: data.extractedTextPreview,
        cached: data.cached
      };
      setMeta(nextMeta);
      saveReview(data.analysis, nextMeta);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setIsLoading(false);
    }
  }

  function saveReview(nextAnalysis, nextMeta) {
    const review = {
      id: `${Date.now()}-${nextMeta.fileName}`,
      date: new Date().toISOString(),
      fileName: nextMeta.fileName,
      wordCount: nextMeta.wordCount,
      atsScore: nextAnalysis.atsScore,
      missingKeywordsCount: nextAnalysis.missingKeywords.length,
      summary: buildReviewSummary(nextAnalysis)
    };

    setHistory(previous => [review, ...previous].slice(0, 5));
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[radial-gradient(circle_at_12%_8%,_rgba(15,118,110,0.20),_transparent_30%),radial-gradient(circle_at_92%_4%,_rgba(232,93,117,0.14),_transparent_28%),linear-gradient(135deg,_#FAF7F2_0%,_#EEF7F4_48%,_#F7F3FF_100%)] px-4 py-6 text-ink sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-6">
        <Header />
        <Navigation activeView={activeView} onChange={setActiveView} />

        {activeView === "templates" ? (
          <TemplatesPage />
        ) : (
          <section className="grid gap-5 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
            <div className="animate-in grid gap-5" style={{ animationDelay: "90ms" }}>
              <UploadPanel
                file={file}
                inputRef={inputRef}
                isDragging={isDragging}
                setIsDragging={setIsDragging}
                onSelectFile={selectFile}
                onClear={() => {
                  setFile(null);
                  setAnalysis(emptyAnalysis);
                  setMeta(null);
                  setError("");
                }}
              />

              <section className="rounded-lg border border-white/80 bg-white/80 p-5 shadow-soft backdrop-blur">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <h2 className="text-lg font-black">Target job description</h2>
                  <span className="text-sm font-bold text-slate-500">Free local match</span>
                </div>
                <textarea
                  className="min-h-44 w-full resize-y rounded-lg border border-teal-100 bg-white/80 p-4 leading-6 outline-none transition duration-300 focus:border-mint focus:bg-white focus:ring-4 focus:ring-teal-100"
                  value={jobDescription}
                  onChange={event => setJobDescription(event.target.value)}
                  placeholder="Paste the job advert here. Matching is calculated locally, so this does not increase OpenAI usage."
                />
              </section>

              {error ? (
                <div className="flex gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-red-800">
                  <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
                  <p className="text-sm font-semibold">{error}</p>
                </div>
              ) : null}

              <button
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-mint to-ocean px-5 font-black text-white shadow-glow transition duration-300 hover:-translate-y-0.5 hover:shadow-soft disabled:cursor-not-allowed disabled:from-slate-300 disabled:to-slate-300"
                type="button"
                disabled={!canAnalyse}
                onClick={analyseCv}
              >
                {isLoading ? <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" /> : <Sparkles className="h-5 w-5" aria-hidden="true" />}
                {isLoading ? "Analysing CV" : "Analyse CV"}
              </button>

              <HowItWorks />
              <HistoryPanel
                history={history}
                onClear={() => setHistory([])}
                onDelete={id => setHistory(previous => previous.filter(review => review.id !== id))}
              />
            </div>

            <Results analysis={analysis} meta={meta} match={localMatch} matchLabel={matchLabel} progressDelta={progressDelta} />
          </section>
        )}
      </div>
    </main>
  );
}

function Header() {
  return (
    <header className="animate-in flex flex-col gap-5 border-b border-white/70 pb-6 lg:flex-row lg:items-end lg:justify-between">
      <div className="max-w-3xl">
        <p className="mb-3 inline-flex rounded-full border border-teal-200 bg-white/70 px-3 py-1 text-sm font-black uppercase text-mint shadow-sm backdrop-blur">
          CV Builder by <span className="ps-mark ml-1">PS</span>
        </p>
        <h1 className="bg-gradient-to-r from-slate-950 via-teal-900 to-coral bg-clip-text pb-2 text-4xl font-black leading-[1.08] tracking-normal text-transparent sm:text-6xl">
          Build a better CV with every upload
        </h1>
        <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600">
          Upload a PDF, get AI feedback, compare local job keywords, then track the last five reviews without creating an account.
        </p>
      </div>
      <div className="score-shimmer flex items-center gap-2 rounded-lg border border-white/80 bg-gradient-to-r from-white via-teal-50 to-rose-50 px-4 py-3 shadow-glow backdrop-blur">
        <Sparkles className="soft-pulse h-5 w-5 text-coral" aria-hidden="true" />
        <span className="text-sm font-bold text-slate-700">PDF parsing + AI review + progress history</span>
      </div>
    </header>
  );
}

function Navigation({ activeView, onChange }) {
  return (
    <nav className="animate-in flex flex-wrap gap-2" style={{ animationDelay: "60ms" }} aria-label="Main sections">
      {["analyser", "templates"].map(view => (
        <button
          className={`min-h-11 rounded-lg px-4 text-sm font-black transition ${activeView === view ? "bg-ink text-white shadow-soft" : "border border-white/80 bg-white/80 text-slate-700 hover:bg-white"}`}
          type="button"
          key={view}
          onClick={() => onChange(view)}
        >
          {view === "analyser" ? "AI CV Analyser" : "CV Templates"}
        </button>
      ))}
    </nav>
  );
}

function HowItWorks() {
  return (
    <section className="rounded-lg border border-white/80 bg-white/80 p-5 shadow-soft backdrop-blur">
      <h2 className="text-lg font-black">How it works</h2>
      <div className="mt-4 grid gap-3 sm:grid-cols-4">
        {["Upload PDF", "Extract text", "AI review", "Improve CV"].map((step, index) => (
          <div className="rounded-lg bg-white/75 p-3 text-sm font-black text-slate-700" key={step}>
            <span className="mr-2 text-mint">{index + 1}.</span>
            {step}
          </div>
        ))}
      </div>
    </section>
  );
}

createRoot(document.getElementById("root")).render(<App />);
