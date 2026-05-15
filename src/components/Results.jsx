import { CheckCircle2, Download } from "lucide-react";
import { downloadReviewReport } from "../utils/exportReport";
import { InsightList } from "./InsightList";
import { ScoreCard } from "./ScoreCard";

export function Results({ analysis, meta, match, matchLabel, progressDelta }) {
  const hasResults = Boolean(meta);

  return (
    <section className="animate-in grid gap-5" style={{ animationDelay: "160ms" }}>
      <div className="grid gap-4 sm:grid-cols-3">
        <ScoreCard label="ATS score" value={hasResults ? analysis.atsScore : "-"} text="Structure, scanability and keyword readiness" tone="mint" />
        <ScoreCard label="Progress" value={hasResults ? analysis.atsScore : "-"} text={hasResults ? "Compared with your previous saved review" : "Upload a PDF to begin"} tone="coral" delta={progressDelta} />
        <ScoreCard label="Job match" value={hasResults && match ? match.matchScore : "-"} text={hasResults ? matchLabel : "Paste a job advert for local matching"} tone="ocean" />
      </div>

      <section className="rounded-lg border border-white/80 bg-white/85 p-5 shadow-soft backdrop-blur">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-mint" aria-hidden="true" />
            <h2 className="text-lg font-black">AI feedback</h2>
          </div>
          {hasResults ? (
            <button
              className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-teal-100 bg-white px-3 text-sm font-black text-mint transition hover:bg-teal-50"
              type="button"
              onClick={() => downloadReviewReport({ analysis, meta, match })}
            >
              <Download className="h-4 w-4" aria-hidden="true" />
              Download report
            </button>
          ) : null}
        </div>
        {hasResults ? (
          <div className="grid gap-5">
            <InsightList title="Strengths" items={analysis.strengths} tone="mint" />
            <InsightList title="Weaknesses" items={analysis.weaknesses} tone="amber" />
            <InsightList title="Missing keywords" items={analysis.missingKeywords} tone="blue" />
            <InsightList title="Suggestions" items={analysis.suggestions} tone="slate" />
            {match ? <LocalMatch match={match} /> : null}
          </div>
        ) : (
          <div className="rounded-lg bg-white/70 p-6 text-slate-600">
            Results will appear here after the PDF is uploaded, parsed and analysed.
          </div>
        )}
      </section>

      {meta ? (
        <section className="animate-in rounded-lg border border-white/80 bg-white/85 p-5 shadow-soft backdrop-blur">
          <h2 className="mb-3 text-lg font-black">Extracted text preview</h2>
          <p className="mb-3 text-sm font-bold text-slate-500">
            {meta.fileName} - {meta.wordCount} words extracted {meta.cached ? "- cached result" : ""}
          </p>
          <p className="max-h-36 overflow-auto rounded-lg bg-pearl/80 p-4 text-sm leading-6 text-slate-700">{meta.preview}</p>
        </section>
      ) : null}
    </section>
  );
}

function LocalMatch({ match }) {
  return (
    <div>
      <h3 className="mb-3 text-sm font-black uppercase text-slate-500">Local job description match</h3>
      <div className="grid gap-3 rounded-lg bg-white/70 p-4 sm:grid-cols-2">
        <div>
          <p className="text-sm font-black text-mint">Matched keywords</p>
          <p className="mt-2 text-sm leading-6 text-slate-600">{match.matchedKeywords.length ? match.matchedKeywords.join(", ") : "No strong matches found yet."}</p>
        </div>
        <div>
          <p className="text-sm font-black text-coral">Missing keywords</p>
          <p className="mt-2 text-sm leading-6 text-slate-600">{match.missingKeywords.length ? match.missingKeywords.join(", ") : "No obvious missing terms from the pasted job advert."}</p>
        </div>
      </div>
    </div>
  );
}
