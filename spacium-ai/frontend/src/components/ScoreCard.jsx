export default function ScoreCard({ label, score }) {
  const color =
    score === null || score === undefined
      ? "text-gray-500"
      : score >= 70
      ? "text-green-400"
      : score >= 45
      ? "text-yellow-400"
      : "text-red-400";

  return (
    <div className="bg-gray-900 rounded-2xl p-5">
      <p className="text-gray-400 text-xs uppercase tracking-widest mb-2">{label}</p>
      <p className={`text-5xl font-bold ${color}`}>
        {score !== null && score !== undefined ? Math.round(score) : "—"}
      </p>
      <p className="text-gray-500 text-xs mt-2">/ 100</p>
    </div>
  );
}
