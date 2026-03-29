import {
  LineChart, Line, XAxis, YAxis, Tooltip,
  ResponsiveContainer, Legend,
} from "recharts";
import InfoTooltip from "./InfoTooltip";

const CHART_INFO = "Shows how the three scores have changed across the last 3 readings. Green = Sterility, Yellow = Storage Conditions, Blue = Compliance.";

export default function TrendChart({ history }) {
  if (!history || history.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center text-slate-400 text-sm">
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
      <div className="flex items-center gap-1.5 mb-4">
        <p className="text-sm font-semibold text-slate-700 uppercase tracking-wide">Score Trends</p>
        <InfoTooltip text={CHART_INFO} />
      </div>
      <div className="flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 4, right: 8, bottom: 0, left: -20 }}>
            <XAxis dataKey="t" hide />
            <YAxis domain={["auto", "auto"]} tick={{ fill: "#94a3b8", fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={{ backgroundColor: "#fff", border: "1px solid #e2e8f0", borderRadius: "12px", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }}
              labelStyle={{ display: "none" }}
              itemStyle={{ color: "#475569", fontSize: 12 }}
            />
            <Legend wrapperStyle={{ fontSize: 12, color: "#64748b", margin: -10}} />
            <Line type="monotone" dataKey="Sterility"          stroke="#10b981" strokeWidth={2} dot={{ fill: "#10b981", r: 4 }} activeDot={{ r: 6 }} />
            <Line type="monotone" dataKey="Storage Conditions" stroke="#f59e0b" strokeWidth={2} dot={{ fill: "#f59e0b", r: 4 }} activeDot={{ r: 6 }} />
            <Line type="monotone" dataKey="Compliance"         stroke="#3b82f6" strokeWidth={2} dot={{ fill: "#3b82f6", r: 4 }} activeDot={{ r: 6 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
