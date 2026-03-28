import {
  LineChart, Line, XAxis, YAxis, Tooltip,
  ResponsiveContainer, Legend,
} from "recharts";

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
    "Air Quality": Math.round(r.air_quality_score),
    "Comfort":     Math.round(r.comfort_score),
    "Focus":       Math.round(r.focus_score),
  }));

  return (
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
        <Line type="monotone" dataKey="Air Quality" stroke="#34d399" strokeWidth={2} dot={true} />
        <Line type="monotone" dataKey="Comfort"     stroke="#fbbf24" strokeWidth={2} dot={true} />
        <Line type="monotone" dataKey="Focus"       stroke="#60a5fa" strokeWidth={2} dot={true} />
      </LineChart>
    </ResponsiveContainer>
  );
}
