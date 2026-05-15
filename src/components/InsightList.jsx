export function InsightList({ title, items, tone }) {
  const borderColor = {
    mint: "border-mint",
    amber: "border-amber-500",
    blue: "border-ocean",
    slate: "border-slate-400"
  }[tone];

  return (
    <div>
      <h3 className="mb-3 text-sm font-black uppercase text-slate-500">{title}</h3>
      <ul className="grid gap-2">
        {(items.length ? items : ["No issues found in this category."]).map(item => (
          <li className={`rounded-r-lg border-l-4 ${borderColor} bg-white/70 px-4 py-3 text-sm leading-6 text-slate-700 transition duration-300 hover:translate-x-1 hover:bg-pearl`} key={item}>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
