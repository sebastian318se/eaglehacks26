import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import useSensorData from '../hooks/useSensorData';
import ScoreCard from '../components/ScoreCard';
import SensorTile from '../components/SensorTile';
import TrendChart from '../components/TrendChart';
import AISummary from '../components/AISummary';
import environments from '../config/environments';
import { ArrowLeft, TriangleAlert, X } from 'lucide-react';

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
  const { history, latest, loading } = useSensorData(environmentId);

  const [alertDismissed, setAlertDismissed] = useState(false);

  useEffect(() => {
    if (latest?.alert) {
      setAlertDismissed(false);
    }
  }, [latest?.timestamp]);

  const showModal = latest?.alert && !alertDismissed;

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

      
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setAlertDismissed(true)} />
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md p-6 border border-red-100">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                <TriangleAlert size={20} className="text-red-500" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h2 className="text-slate-900 font-semibold text-base">Environmental Alert</h2>
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                </div>
                <p className="text-slate-600 text-sm leading-relaxed">{latest.recommendation}</p>
              </div>
              <button
                onClick={() => setAlertDismissed(true)}
                className="text-slate-400 hover:text-slate-600 transition-colors shrink-0 mt-0.5"
              >
                <X size={18} />
              </button>
            </div>
            <div className="mt-5 flex justify-end">
              <button
                onClick={() => setAlertDismissed(true)}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-sm font-medium rounded-lg transition-colors"
              >
                Acknowledge
              </button>
            </div>
          </div>
        </div>
      )}

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

      {!latest && !loading && (
        <div className="bg-amber-50 border-b border-amber-200 px-8 py-3 flex items-center gap-3">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse shrink-0" />
          <p className="text-amber-700 text-sm">
            Waiting for first batch — the system collects 3 readings before processing. Make sure <strong>bridge.py</strong> is running.
          </p>
        </div>
      )}

      <main className="max-w-6xl mx-auto px-8 py-10">

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">{environment.name}</h1>
          <p className="text-slate-500 text-md mt-1">{environment.description}</p>
        </div>

        {/* Score Cards */}
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <ScoreCard label="Sterility"          score={latest?.sterility_score}  info="Composite score (0–100) reflecting contamination risk based on air quality sensors." />
          <ScoreCard label="Storage Conditions" score={latest?.storage_score}    info="Composite score (0–100) based on temperature and humidity levels for this environment." />
          <ScoreCard label="Compliance"         score={latest?.compliance_score} info="Overall compliance score (0–100) combining all sensor readings against environment standards." />
        </section>

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
