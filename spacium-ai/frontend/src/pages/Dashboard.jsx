import { useNavigate, useParams } from 'react-router-dom';
import useSensorData from '../hooks/useSensorData';
import ScoreCard from '../components/ScoreCard';
import SensorTile from '../components/SensorTile';
import TrendChart from '../components/TrendChart';
import AISummary from '../components/AISummary';
import environments from '../config/environments';
import { ArrowLeft } from 'lucide-react';

function getSensorValue(sensor, latest) {
  if (!latest) return null;
  const raw = latest[sensor.key];
  if (raw === null || raw === undefined) return null;

  if (sensor.key === "temperature") {
    const f = ((raw * 9) / 5 + 32).toFixed(1);
    return `${raw}°C / ${f}°F`;
  }
  if (sensor.key === "door_open") return raw ? "Open" : "Closed";
  if (sensor.key === "occupancy") return `${Math.round(raw)} people`;
  return `${raw}${sensor.unit ? " " + sensor.unit : ""}`;
}

function getSensorWarn(sensor, latest) {
  if (!latest) return false;
  const raw = latest[sensor.key];
  if (raw === null || raw === undefined) return false;

  if ("warnIf" in sensor) return raw === sensor.warnIf;
  const above = sensor.warnAbove !== undefined && raw > sensor.warnAbove;
  const below = sensor.warnBelow !== undefined && raw < sensor.warnBelow;
  return above || below;
}

export default function Dashboard() {
  const navigate = useNavigate();
  const { environment: environmentId } = useParams();
  const environment = environments.find(e => e.id === environmentId);
  const { history, latest } = useSensorData(environmentId);

  if (!environment) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-500 mb-4">Unknown environment.</p>
          <button onClick={() => navigate("/")} className="text-blue-600 text-sm underline">Go back</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">

      {/* Top nav */}
      <nav className="bg-white border-b border-slate-200 px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate("/")} className="text-slate-400 hover:text-slate-600 transition-colors">
            <ArrowLeft size={18} />
          </button>
          <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center">
            <span className="text-white text-xs font-bold">S</span>
          </div>
          <span className="text-slate-900 font-bold text-lg">Spacium<span className="text-blue-600">.AI</span></span>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <span className={`w-2 h-2 rounded-full ${latest ? "bg-emerald-400 animate-pulse" : "bg-slate-300"}`} />
          {latest ? "Live" : "Waiting for sensor…"}
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-8 py-10">

        {/* Page title */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900">{environment.name}</h1>
          <p className="text-slate-500 text-sm mt-1">{environment.description}</p>
        </div>

        {/* Score Cards */}
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <ScoreCard label="Sterility"          score={latest?.sterility_score}  info="Composite score (0–100) reflecting contamination risk based on air quality sensors." />
          <ScoreCard label="Storage Conditions" score={latest?.storage_score}    info="Composite score (0–100) based on temperature and humidity levels for this environment." />
          <ScoreCard label="Compliance"         score={latest?.compliance_score} info="Overall compliance score (0–100) combining all sensor readings against environment standards." />
        </section>

        {/* Sensor Tiles — dynamic from environment config */}
        <section className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          {environment.sensors.map(sensor => (
            <SensorTile
              key={sensor.key}
              label={sensor.label}
              value={getSensorValue(sensor, latest)}
              warn={getSensorWarn(sensor, latest)}
              info={`Ideal range: ${sensor.idealRange}`}
            />
          ))}
        </section>

        {/* Bottom row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm h-72">
            <TrendChart history={history} />
          </div>
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm h-72 overflow-y-auto">
            <AISummary latest={latest} />
          </div>
        </div>

      </main>
    </div>
  );
}
