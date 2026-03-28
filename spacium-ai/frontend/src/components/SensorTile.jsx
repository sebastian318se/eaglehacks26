import InfoTooltip from "./InfoTooltip";

export default function SensorTile({ label, value, warn, info }) {
  return (
    <div className="rounded-xl p-4 bg-gray-900">
      <div className="flex items-center gap-1.5 mb-1">
        <p className="text-gray-400 text-xs">{label}</p>
        {info && <InfoTooltip text={info} />}
      </div>
      <p className={`text-xl font-semibold ${warn ? "text-red-400" : "text-white"}`}>
        {value !== null && value !== undefined ? value : "—"}
      </p>
    </div>
  );
}
