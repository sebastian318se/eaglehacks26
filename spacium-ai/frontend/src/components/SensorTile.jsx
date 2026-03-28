export default function SensorTile({ label, value, warn }) {
  return (
    <div className="rounded-xl p-4 bg-gray-900">
      <p className="text-gray-400 text-xs mb-1">{label}</p>
      <p className={`text-xl font-semibold ${warn ? "text-red-400" : "text-white"}`}>
        {value !== null && value !== undefined ? value : "—"}
      </p>
    </div>
  );
}
