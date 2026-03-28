import useSensorData from "./hooks/useSensorData";
import ScoreCard from "./components/ScoreCard";
import SensorTile from "./components/SensorTile";
import TrendChart from "./components/TrendChart";
import AISummary from "./components/AISummary";

export default function App() {
  const { history, latest } = useSensorData();
  const temperature_f = latest ? (latest.temperature * 9/5 + 32).toFixed(1) : null;

  return (
    <div className="min-h-screen bg-slate-50">

      {/* Top nav */}
      <nav className="bg-white border-b border-slate-200 px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
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
          <h1 className="text-2xl font-bold text-slate-900">Surgical Storage Monitor</h1>
          <p className="text-slate-500 text-sm mt-1">Real-time environmental conditions for sterile instrument storage</p>
        </div>

        {/* Score Cards */}
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <ScoreCard label="Sterility"          score={latest?.sterility_score} info="Composite score (0–100) based on CO₂, PM2.5, and TVOC levels. Reflects the risk of airborne contamination for stored surgical items." />
          <ScoreCard label="Storage Conditions" score={latest?.storage_score}     info="Composite score (0–100) based on temperature and humidity. Surgical items require 18–25°C and 30–60% RH to preserve sterility and prevent corrosion." />
          <ScoreCard label="Compliance"         score={latest?.compliance_score}       info="Composite score (0–100) combining all environmental factors. Indicates whether the storage room meets recommended standards for surgical item preservation." />
        </section>

        {/* Sensor Tiles */}
        <section className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          <SensorTile label="Temperature"  value={latest ? `${latest.temperature}°C / ${temperature_f}°F` : null} warn={latest?.temperature < 18 || latest?.temperature > 25} info="Ideal range: 18–25°C. Temperatures outside this range can degrade packaging, adhesives, and sterile barriers of surgical instruments." />
          <SensorTile label="Humidity"     value={latest ? `${latest.humidity}%` : null}                          warn={latest?.humidity < 30 || latest?.humidity > 60}        info="Ideal range: 30–60% RH. High humidity promotes microbial growth and corrosion. Low humidity causes static buildup and packaging brittleness." />
          <SensorTile label="PM2.5"        value={latest ? `${latest.pm25_ug_m3} µg/m³` : null}                  warn={latest?.pm25_ug_m3 > 10}                               info="Fine particulate matter (≤2.5µm). Warn threshold: >10 µg/m³. Particles can settle on sterile packaging and compromise instrument integrity." />
          <SensorTile label="TVOC"         value={latest ? `${latest.tvoc_ppb} ppb` : null}                      warn={latest?.tvoc_ppb > 200}                                info="Total Volatile Organic Compounds. Warn threshold: >200 ppb. Elevated VOCs may indicate chemical off-gassing that can react with sterile materials." />
          <SensorTile label="CO₂"          value={latest ? `${latest.co2_ppm} ppm` : null}                       warn={latest?.co2_ppm > 1000}                                info="Carbon dioxide concentration. Warn threshold: >1000 ppm. High CO₂ signals poor ventilation, increasing the risk of airborne contamination." />
          <SensorTile label="Light"        value={latest ? `${latest.light_lux} lux` : null}                     warn={latest?.light_lux > 300}                               info="Illuminance level. Warn threshold: >300 lux. Prolonged light exposure, especially UV, can degrade plastics, rubber components, and sterile packaging." />
          <SensorTile label="Pressure"     value={latest ? `+${latest.pressure_pa} Pa` : null}                   warn={latest?.pressure_pa < 8}                               info="Differential air pressure relative to adjacent areas. Warn threshold: <8 Pa. Positive pressure prevents unfiltered air and contaminants from entering the storage room." />
          <SensorTile label="Door"         value={latest ? (latest.door_open ? "Open" : "Closed") : null}        warn={latest?.door_open}                                     info="Storage room door status. An open door breaks the positive pressure barrier, allowing uncontrolled airflow and potential contamination of stored items." />
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
