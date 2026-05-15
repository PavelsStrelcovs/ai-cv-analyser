import { BarChart3, Clock3, Trash2, X } from "lucide-react";
import { formatDate } from "../utils/history";

export function HistoryPanel({ history, onClear, onDelete }) {
  return (
    <section className="rounded-lg border border-white/80 bg-white/80 p-5 shadow-soft backdrop-blur">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-mint" aria-hidden="true" />
          <h2 className="text-lg font-black">Progress history</h2>
        </div>
        {history.length ? (
          <button
            className="inline-flex h-9 items-center gap-2 rounded-lg border border-rose-100 bg-rose-50 px-3 text-sm font-black text-coral transition hover:bg-rose-100"
            type="button"
            onClick={onClear}
          >
            <Trash2 className="h-4 w-4" aria-hidden="true" />
            Clear
          </button>
        ) : null}
      </div>

      {history.length ? (
        <>
          <HistoryStats history={history} />
          <ol className="mt-4 grid gap-3">
            {history.map((review, index) => {
              const previous = history[index + 1];
              const delta = previous ? review.atsScore - previous.atsScore : null;

              return (
                <li className="animate-in rounded-lg border border-teal-100 bg-gradient-to-r from-white to-teal-50/70 p-4" key={review.id}>
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-black text-slate-800">{review.fileName}</p>
                      <p className="mt-1 flex items-center gap-1 text-xs font-bold text-slate-500">
                        <Clock3 className="h-3.5 w-3.5" aria-hidden="true" />
                        {formatDate(review.date)} - {review.wordCount} words
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="rounded-full bg-white px-3 py-1 text-sm font-black text-mint shadow-sm">{review.atsScore}/100</span>
                      {typeof delta === "number" ? (
                        <span className={`rounded-full px-2 py-1 text-xs font-black ${delta >= 0 ? "bg-teal-100 text-mint" : "bg-rose-100 text-coral"}`}>
                          {delta >= 0 ? "+" : ""}
                          {delta}
                        </span>
                      ) : null}
                      <button
                        className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-white text-slate-500 hover:text-coral"
                        type="button"
                        onClick={() => onDelete(review.id)}
                        aria-label={`Delete ${review.fileName} review`}
                      >
                        <X className="h-3.5 w-3.5" aria-hidden="true" />
                      </button>
                    </div>
                  </div>
                  <p className="mt-3 line-clamp-2 text-sm leading-6 text-slate-600">{review.summary}</p>
                </li>
              );
            })}
          </ol>
        </>
      ) : (
        <div className="rounded-lg bg-white/70 p-4 text-sm leading-6 text-slate-600">
          Your last 5 reviews will be saved in this browser after each analysis, even if you refresh the page.
        </div>
      )}
    </section>
  );
}

function HistoryStats({ history }) {
  const latest = history[0];
  const oldest = history[history.length - 1];
  const improvement = latest && oldest ? latest.atsScore - oldest.atsScore : 0;
  const best = Math.max(...history.map(review => review.atsScore));

  return (
    <div className="grid gap-2 sm:grid-cols-3">
      <span className="rounded-lg bg-white/75 p-3 text-sm font-black text-slate-700">Best: {best}/100</span>
      <span className={`rounded-lg p-3 text-sm font-black ${improvement >= 0 ? "bg-teal-50 text-mint" : "bg-rose-50 text-coral"}`}>
        Trend: {improvement >= 0 ? "+" : ""}
        {improvement}
      </span>
      <span className="rounded-lg bg-white/75 p-3 text-sm font-black text-slate-700">{history.length}/5 saved</span>
    </div>
  );
}
