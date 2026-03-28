import InfoTooltip from "./InfoTooltip";

export default function SensorTile({ label, value, warn, info }) {
  return (
    <div className={`rounded-xl p-4 border shadow-sm transition-colors ${
      warn
        ? "bg-red-50 border-red-200"
        : "bg-white border-slate-200"
    }`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">{label}</span>
          {info && <InfoTooltip text={info} />}
        </div>
        {warn && (
          <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
        )}
      </div>
      <p className={`text-xl font-semibold ${warn ? "text-red-600" : "text-slate-800"}`}>
        {value !== null && value !== undefined ? value : "—"}
      </p>
    </div>
  );
}
