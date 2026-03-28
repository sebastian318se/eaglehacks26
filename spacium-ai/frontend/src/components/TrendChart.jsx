import {
  LineChart, Line, XAxis, YAxis, Tooltip,
  ResponsiveContainer, Legend,
} from "recharts";
import InfoTooltip from "./InfoTooltip";

const CHART_INFO = "Shows how the three scores have changed across the last 3 readings. Green = Sterility, Yellow = Storage Conditions, Blue = Compliance.";

export default function TrendChart({ history }) {
  if (!history || history.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center text-gray-600 text-sm">
        Waiting for data…
      </div>
    );
  }

  const data = history.map((r, i) => ({
    t: i + 1,
    "Sterility":          Math.round(r.sterility_score   ?? r.air_quality_score),
    "Storage Conditions": Math.round(r.storage_score     ?? r.comfort_score),
    "Compliance":         Math.round(r.compliance_score  ?? r.focus_score),
  }));

  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex items-center gap-1.5 mb-2">
        <p className="text-gray-400 text-xs uppercase tracking-widest">Score Trends</p>
        <InfoTooltip text={CHART_INFO} />
      </div>
      <div className="flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 4, right: 8, bottom: 0, left: -20 }}>
            <XAxis dataKey="t" hide />
            <YAxis domain={["auto", "auto"]} tick={{ fill: "#6b7280", fontSize: 11 }} />
            <Tooltip
              contentStyle={{ backgroundColor: "#111827", border: "none", borderRadius: "8px" }}
              labelStyle={{ display: "none" }}
              itemStyle={{ color: "#e5e7eb", fontSize: 12 }}
            />
            <Legend wrapperStyle={{ fontSize: 12, color: "#9ca3af" }} />
            <Line type="monotone" dataKey="Sterility"          stroke="#34d399" strokeWidth={2} dot={true} />
            <Line type="monotone" dataKey="Storage Conditions" stroke="#fbbf24" strokeWidth={2} dot={true} />
            <Line type="monotone" dataKey="Compliance"         stroke="#60a5fa" strokeWidth={2} dot={true} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
