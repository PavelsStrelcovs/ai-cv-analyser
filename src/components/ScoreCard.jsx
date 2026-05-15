import { TrendingUp } from "lucide-react";

export function ScoreCard({ label, value, text, tone, delta }) {
  const gradient = {
    mint: "from-teal-500 to-emerald-600",
    coral: "from-coral to-gold",
    ocean: "from-ocean to-indigo-600"
  }[tone];

  return (
    <article className="group rounded-lg border border-white/80 bg-white/90 p-5 shadow-soft backdrop-blur transition duration-300 hover:-translate-y-1 hover:shadow-glow">
      <span className="text-xs font-black uppercase text-slate-500">{label}</span>
      <div className="mt-2 flex items-end gap-2">
        <strong className={`bg-gradient-to-r ${gradient} bg-clip-text text-4xl font-black text-transparent`}>{value}</strong>
        {typeof delta === "number" ? (
          <span className={`mb-1 inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-black ${delta >= 0 ? "bg-teal-50 text-mint" : "bg-rose-50 text-coral"}`}>
            <TrendingUp className="h-3.5 w-3.5" aria-hidden="true" />
            {delta >= 0 ? "+" : ""}
            {delta}
          </span>
        ) : null}
      </div>
      <p className="mt-2 text-sm leading-5 text-slate-600">{text}</p>
    </article>
  );
}
