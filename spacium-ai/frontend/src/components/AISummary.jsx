export default function AISummary({ latest }) {
  const recommendations = latest?.recommendation?.split(" | ").filter(Boolean);
  const hasAlert = latest?.alert;

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center gap-2 mb-4">
        <p className="text-sm font-semibold text-slate-700 uppercase tracking-wide">AI Summary</p>
        {hasAlert && (
          <span className="flex items-center gap-1 bg-red-100 text-red-600 text-xs font-medium px-2 py-0.5 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse inline-block" />
            Alert
          </span>
        )}
      </div>

      {!latest && (
        <p className="text-slate-400 text-sm">Waiting for data…</p>
      )}

      {latest && !recommendations?.length && (
        <p className="text-slate-400 text-sm">No recommendations available.</p>
      )}

      {recommendations?.length > 0 && (
        <ul className="space-y-2">
          {recommendations.map((rec, i) => (
            <li key={i} className="flex gap-2 text-sm text-slate-600">
              <span className="text-blue-400 mt-0.5">•</span>
              <span>{rec}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
