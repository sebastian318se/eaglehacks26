import InfoTooltip from "./InfoTooltip";

export default function ScoreCard({ label, score, info }) {
  const hasScore = score !== null && score !== undefined;

  const style = !hasScore
    ? { ring: "bg-slate-100 text-slate-400", badge: "bg-slate-100 text-slate-400", bar: "bg-slate-200" }
    : score >= 70
    ? { ring: "bg-emerald-50 text-emerald-600", badge: "bg-emerald-100 text-emerald-700", bar: "bg-emerald-400" }
    : score >= 45
    ? { ring: "bg-amber-50 text-amber-600",   badge: "bg-amber-100 text-amber-700",   bar: "bg-amber-400" }
    : { ring: "bg-red-50 text-red-600",        badge: "bg-red-100 text-red-700",        bar: "bg-red-400" };

  const pct = hasScore ? Math.round(score) : 0;

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span className="text-sm font-semibold text-slate-700 uppercase tracking-wide">{label}</span>
          {info && <InfoTooltip text={info} />}
        </div>
        <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${style.badge}`}>
          {hasScore ? (score >= 70 ? "Good" : score >= 45 ? "Fair" : "Poor") : "—"}
        </span>
      </div>

      <div className="flex items-end gap-3">
        <span className={`text-6xl font-bold leading-none ${style.ring.split(" ")[1]}`}>
          {hasScore ? pct : "—"}
        </span>
        <span className="text-slate-400 text-sm mb-1">/ 100</span>
      </div>

      <div className="w-full bg-slate-100 rounded-full h-1.5">
        <div className={`h-1.5 rounded-full transition-all duration-500 ${style.bar}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
